import { netlifyFetcher } from 'services/netlify';
import { vercelFetcher } from 'services/vercel';
import { PublicConfiguration } from 'swr/dist/types';
import useSWRInfinite from 'swr/infinite';
import { KeyLoader } from 'swr';
import { NetlifyDeployment } from 'types/netlify';
import { Deployment, Service } from 'types/services';
import { VercelDeployment } from 'types/vercel';

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
      creator: {
        username: dpl.creator.username,
      },
      meta: {
        ghRepo: dpl.meta.githubRepo,
        ghCommitMessage: dpl.meta.githubCommitMessage,
        ghCommitSha: dpl.meta.githubCommitSha,
        ghCommitRef: dpl.meta.githubCommitRef,
        ghOrg: dpl.meta.githubOrg,
      },
    };
  });
  return { ...res, deployments: dpls } as { deployments: Deployment[] };
}

const netlifyStateMap = {
  ready: 'READY',
  error: 'ERROR',
};
async function netlifyFetchDeploys(url: string, options?: RequestInit) {
  const res = await netlifyFetcher<NetlifyDeployment[]>(url, options);

  const dpls = res.map((dpl) => {
    return {
      id: dpl.id,
      name: dpl.name,
      created: new Date(dpl.created_at).getTime(),
      buildStart: new Date(dpl.created_at).getTime(),
      buildEnd: new Date(dpl.created_at).getTime() + dpl.deploy_time * 1000 || 0,
      url: dpl.deploy_url,
      state: netlifyStateMap[dpl.state] || 'READY',
      admin_url: dpl.admin_url + '/deploys/' + dpl.id,
      creator: {
        username: dpl.committer || '',
      },
      meta: {
        ghCommitMessage: dpl.title,
        ghRepo: 'string',
        ghCommitSha: 'string',
        ghOrg: 'string',
        ghCommitRef: dpl.commit_ref || '',
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
  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `sites/${urlParams.siteId}/deploys?${qs}`;

  // add the cursor to the API endpoint
  return `sites/${urlParams.siteId}/deploys?${qs}&page=${pageIndex}`;
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
  const urlParams: { siteId?: string | null } = {};
  if (service === 'vercel') {
    teamId?.includes('team_') && searchParams.append('teamId', teamId);
    projectId && searchParams.append('projectId', projectId);
    limit && searchParams.append('limit', limit.toString());
  } else if (service === 'netlify') {
    limit && searchParams.append('per_page', limit.toString());
    urlParams.siteId = projectId;
  }
  const qs = searchParams.toString();
  const fetcher = service === 'vercel' ? vercelFetchDeploys : netlifyFetchDeploys;
  let getPage: KeyLoader = null;
  if (service === 'vercel') {
    getPage = (page: number, prevData: any) => getVercelKey(page, prevData, qs);
  } else if (projectId && service === 'netlify') {
    getPage = (page: number, prevData: any) =>
      getNetlifyKey(page, prevData, { qs, urlParams });
  }

  return useSWRInfinite<{ deployments: Deployment[] }>(getPage, fetcher, swrOptions);
};
