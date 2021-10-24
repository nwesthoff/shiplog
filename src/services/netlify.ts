import { config } from 'config/constants';

export async function netlifyFetcher<T = any>(url: string, options?: RequestInit) {
  const token = window.localStorage.getItem('netlifyToken');

  const res = await fetch(config.NETLIFY_API_BASE + url, {
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
