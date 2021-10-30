import { config } from 'config/constants';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';
import { PublicConfiguration } from 'swr/dist/types';
import {
  VercelBuild,
  VercelDeployment,
  VercelProject,
  VercelTeam,
  VercelUser,
} from 'types/vercel';

export async function vercelFetcher<T = any>(url: string, options?: RequestInit) {
  const token = window.localStorage.getItem('vercelToken');

  const res = await fetch(config.VERCEL_API_BASE + url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const error = {
      message: 'An error occurred while fetching the data.',
      info: await res.json(),
      status: res.status,
    };
    // Attach extra info to the error object.
    throw error;
  }

  return res.json() as Promise<T>;
}

type TeamRequestProps = { teamId?: string };

export const useVercelTeam = ({ teamId }: TeamRequestProps) => {
  const id = teamId?.includes('team_') ? teamId : '';
  return useSWR<VercelTeam>(teamId ? `/v1/teams/${id}` : null, vercelFetcher);
};

export const useVercelTeamList = () =>
  useSWR<{ teams: VercelTeam[] }>(
    window.localStorage.getItem('vercelToken') && '/v1/teams',
    vercelFetcher
  );

export const useVercelUser = () =>
  useSWR<{ user: VercelUser }>('/www/user', vercelFetcher);

const getKey = (pageIndex, previousPageData, qs) => {
  // reached the end
  if (previousPageData && !previousPageData.pagination.next) return null;

  // first page, we don't have `previousPageData`
  if (pageIndex === 0) return `/v6/now/deployments?${qs}`;

  // add the cursor to the API endpoint
  return `/v6/now/deployments?${qs}&from=${previousPageData.pagination.next}`;
};

export const useVercelDeploymentList = ({
  teamId,
  projectId,
  limit,
  swrOptions,
}: {
  teamId?: string;
  projectId?: string;
  limit?: number;
  swrOptions?: Partial<PublicConfiguration>;
} = {}) => {
  const searchParams = new URLSearchParams();
  teamId?.includes('team_') && searchParams.append('teamId', teamId);
  projectId && searchParams.append('projectId', projectId);
  limit && searchParams.append('limit', limit.toString());
  const qs = searchParams.toString();

  return useSWRInfinite<{ deployments: VercelDeployment[] }>(
    (page, prevData) => getKey(page, prevData, qs),
    vercelFetcher,
    swrOptions
  );
};

export const useVercelBuild = (
  url: string,
  { limit, swrOptions }: { limit: number; swrOptions?: Partial<PublicConfiguration> }
) => {
  const searchParams = new URLSearchParams();
  url && searchParams.append('url', url);
  limit && searchParams.append('limit', limit.toString());
  const qs = searchParams.toString();

  return useSWR<VercelBuild>('/v13/now/deployments/get?' + qs, vercelFetcher, swrOptions);
};

export const useVercelProjectList = ({ teamId }: { teamId?: string }) => {
  const searchParams = new URLSearchParams();
  teamId?.includes('team_') && searchParams.append('teamId', teamId);
  const qs = searchParams.toString();

  return useSWR<{ projects: VercelProject[] }>('/v8/projects?' + qs, vercelFetcher);
};
