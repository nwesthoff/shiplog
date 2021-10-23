import { config } from 'config/constants';

export const netlifyFetcher = async (url: string, options?: RequestInit) => {
  const token = window.localStorage.getItem('netlifyToken');

  const res = await fetch(config.NETLIFY_API_BASE + url, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    ...options,
  });

  if (res.status !== 200) {
    return res;
  }

  return res.json();
};
