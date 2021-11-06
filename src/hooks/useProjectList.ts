import { netlifyFetcher } from 'services/netlify';
import { vercelFetcher } from 'services/vercel';
import useSWR from 'swr';
import { Project, Service } from 'types/services';
import { VercelProject } from 'types/vercel';

async function fetchVercelProjects(url: string, options?: RequestInit) {
  const res = vercelFetcher<{ projects: VercelProject[] }>(url, options);

  return res as Promise<{ projects: Project[] }>;
}
async function fetchNetlifyProjects(url: string, options?: RequestInit) {
  const res = await netlifyFetcher<any[]>(url, options);

  return { projects: res } as { projects: Project[] };
}

export const useProjectList = ({
  teamId,
  service,
}: {
  teamId?: string;
  service: Service;
}) => {
  const searchParams = new URLSearchParams();
  teamId?.includes('team_') && searchParams.append('teamId', teamId);
  const qs = searchParams.toString();
  const fetcher = service === 'vercel' ? fetchVercelProjects : fetchNetlifyProjects;
  let url: string | null = null;
  if (service === 'vercel') {
    url = `/v8/projects?${qs}`;
  } else if (service === 'netlify') {
    url = '/sites';
  }

  return useSWR<{ projects: Project[] }>(url, fetcher);
};
