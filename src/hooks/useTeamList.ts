import { netlifyFetcher } from 'services/netlify';
import { vercelFetcher } from 'services/vercel';
import useSWR from 'swr';
import { Service, Team } from 'types/services';
import { VercelTeam } from 'types/vercel';

async function fetchVercelTeams(url: string, options?: RequestInit) {
  const res = vercelFetcher<{ teams: VercelTeam[] }>(url, options);

  return res as Promise<{ teams: Team[] }>;
}
async function fetchNetlifyTeams(url: string, options?: RequestInit) {
  const res = await netlifyFetcher<any[]>(url, options);
  const teams = res.map((team) => {
    return {
      id: team.slug,
      name: team.name.replace(`'s team`, ''),
    };
  });

  return { teams } as { teams: Team[] };
}

export const useTeamList = ({ service }: { service: Service }) => {
  const fetcher = service === 'vercel' ? fetchVercelTeams : fetchNetlifyTeams;
  let url: string = '/v1/teams';
  if (service === 'netlify') {
    url = '/accounts';
  }

  return useSWR<{ teams: Team[] }>(url, fetcher);
};
