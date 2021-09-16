import { config } from 'config/constants';
import useSWR from 'swr';
import { PublicConfiguration } from 'swr/dist/types';
import {
  VercelBuild,
  VercelDeployment,
  VercelProject,
  VercelTeam,
  VercelUser,
} from 'types/vercel';

export const vercelFetcher = async (url: string, options?: RequestInit) => {
  const token = window.localStorage.getItem('vercelToken');

  const res = await fetch(config.VERCEL_API_BASE + url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    ...options,
  });

  return res.json();
};

type TeamRequestProps = { teamId?: string };

export const useVercelTeam = ({ teamId }: TeamRequestProps = {}) =>
  useSWR<VercelTeam>(teamId ? `/v1/teams/${teamId}` : null, vercelFetcher);

export const useVercelTeamList = () =>
  useSWR<{ teams: VercelTeam[] }>('/v1/teams', vercelFetcher);

export const useVercelUser = () =>
  useSWR<{ user: VercelUser }>('/www/user', vercelFetcher);

export const useVercelDeploymentList = ({
  teamId,
  limit,
  swrOptions,
}: {
  teamId?: string;
  limit?: number;
  swrOptions?: Partial<PublicConfiguration>;
} = {}) => {
  const searchParams = new URLSearchParams();
  teamId && searchParams.append('teamId', teamId);
  limit && searchParams.append('limit', limit.toString());
  const qs = searchParams.toString();

  return useSWR<{ deployments: VercelDeployment[] }>(
    '/v6/now/deployments?' + qs,
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
  teamId && searchParams.append('teamId', teamId);
  const qs = searchParams.toString();

  return useSWR<{ projects: VercelProject[] }>('/v8/projects?' + qs, vercelFetcher);
};
