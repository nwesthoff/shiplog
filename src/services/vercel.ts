import { config } from 'config/constants';
import useSWR from 'swr';

export const vercelFetcher = async (url: string, options?: RequestInit) => {
  const token = window.localStorage.getItem('vercelToken');

  return fetch(url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    ...options,
  }).then((res) => res.json());
};

export const useVercelTeamList = () =>
  useSWR(config.VERCEL_API_BASE + '/v1/teams', vercelFetcher);

export const useVercelUser = () =>
  useSWR(config.VERCEL_API_BASE + '/www/user', vercelFetcher);
