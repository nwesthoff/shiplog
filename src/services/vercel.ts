import { config } from 'config/constants';
import useSWR from 'swr';
import { VercelDeployment, VercelTeam, VercelUser } from 'types/vercel';

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

export const useVercelTeamList = () =>
  useSWR<{ teams: VercelTeam[] }>('/v1/teams', vercelFetcher);

export const useVercelUser = () =>
  useSWR<{ user: VercelUser }>('/www/user', vercelFetcher);

export const useVercelDeployment = ({ teamId }: { teamId?: string }) => {
  const searchParams = new URLSearchParams();
  teamId && searchParams.append('teamId', teamId);
  const qs = searchParams.toString();

  return useSWR<{ deployments: VercelDeployment[] }>(
    '/v5/now/deployments?' + qs,
    vercelFetcher
  );
};
