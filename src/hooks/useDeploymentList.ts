import { netlifyFetcher } from 'services/netlify';
import { vercelFetcher } from 'services/vercel';
import { PublicConfiguration } from 'swr/dist/types';
import useSWRInfinite from 'swr/infinite';
import { KeyLoader } from 'swr';
import { NetlifyBuild, NetlifyDeployment } from 'types/netlify';
import { Deployment, Service } from 'types/services';
import { ReadyState, VercelDeployment } from 'types/vercel';

async function vercelFetchDeploys(url: string, options?: RequestInit) {
  const res = await vercelFetcher<{ deployments: VercelDeployment[] }>(url, options);

  const dpls = res.deployments.map((dpl) => {
    return {
      id: dpl.uid,
      url: dpl.url,
      name: dpl.name,
      created: dpl.created,
      buildStart: dpl.buildingAt,
      buildEnd: dpl.ready,
      state: dpl.state,
      meta: {
        ghUsername: dpl.meta.githubCommitAuthorLogin,
        ghRepo: dpl.meta.githubRepo,
        ghCommitMessage: dpl.meta.githubCommitMessage,
        ghCommitRef: dpl.meta.githubCommitSha,
        ghCommitBranch: dpl.meta.githubCommitRef,
        ghOrg: dpl.meta.githubOrg,
      },
    };
  });
  return { ...res, deployments: dpls } as { deployments: Deployment[] };
}

const netlifyStateMap: { [key: string]: ReadyState } = {
  ready: 'READY',
  error: 'ERROR',
  building: 'BUILDING',
};
async function netlifyFetchDeploys(url: string, options?: RequestInit) {
  const res = await netlifyFetcher<NetlifyDeployment[] | NetlifyBuild[]>(url, options);

  const dpls = res.map((dpl) => {
    return {
      id: dpl.deploy_id || dpl.id,
      name: dpl.subdomain,
      created: new Date(dpl.created_at).getTime(),
      buildStart: new Date(dpl.created_at).getTime(),
      buildEnd: new Date(dpl.created_at).getTime() + dpl.deploy_time * 1000 || 0,
      url: dpl.links.permalink,
      state:
        (dpl.state === 'error' && dpl.error_message?.includes('Canceled')
          ? 'CANCELED'
          : netlifyStateMap[dpl.state]) || 'READY',
      meta: {
        ghUsername: dpl.committer,
        ghCommitMessage: dpl.title || 'Manual deploy',
        ghRepo: dpl.commit_url?.replace('https://', '').split('/')[2],
        ghOrg: dpl.commit_url?.replace('https://', '').split('/')[1],
        ghCommitRef: dpl.commit_ref || '',
        ghCommitBranch: dpl.branch || '',
      },
    };
  });

  return { deployments: dpls } as { deployments: Deployment[] };
}

const getVercelKey = (pageIndex, previousPageData, qs) => {
  // reached the end
  if (previousPageData && !previousPageData.pagination.next) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/v6/now/deployments?${qs}`;

  // add the cursor to the API endpoint
  return `/v6/now/deployments?${qs}&from=${previousPageData.pagination.next}`;
};

const getNetlifyKey = (pageIndex: number, previousPageData, { qs, urlParams }) => {
  if (!urlParams.siteId) {
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `${urlParams.teamId}/builds?${qs}`;

    // add the cursor to the API endpoint
    return `${urlParams.teamId}/builds?${qs}&page=${pageIndex}`;
  } else {
    // first page, we don't have `previousPageData`
    if (pageIndex === 0) return `sites/${urlParams.siteId}/deploys?${qs}`;

    // add the cursor to the API endpoint
    return `sites/${urlParams.siteId}/deploys?${qs}&page=${pageIndex}`;
  }
};

export const useDeploymentList = ({
  service,
  teamId,
  projectId,
  limit,
  swrOptions,
}: {
  service: Service;
  teamId?: string;
  projectId: string | null;
  limit?: number;
  swrOptions?: Partial<PublicConfiguration>;
}) => {
  const searchParams = new URLSearchParams();
  const urlParams: { siteId?: string | null; teamId?: string | null } = {};
  if (service === 'vercel') {
    teamId?.includes('team_') && searchParams.append('teamId', teamId);
    projectId && searchParams.append('projectId', projectId);
    limit && searchParams.append('limit', limit.toString());
  } else if (service === 'netlify') {
    limit && searchParams.append('per_page', limit.toString());
    urlParams.siteId = projectId;
    urlParams.teamId = teamId;
  }
  const qs = searchParams.toString();
  const fetcher = service === 'vercel' ? vercelFetchDeploys : netlifyFetchDeploys;
  let getPage: KeyLoader = null;
  if (service === 'vercel') {
    getPage = (page: number, prevData: any) => getVercelKey(page, prevData, qs);
  } else if (service === 'netlify') {
    getPage = (page: number, prevData: any) =>
      getNetlifyKey(page, prevData, { qs, urlParams });
  }

  return useSWRInfinite<{ deployments: Deployment[] }>(getPage, fetcher, swrOptions);
};
