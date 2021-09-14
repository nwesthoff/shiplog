import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { useVercelTeamList } from 'services/vercel';

export default function TeamList(): ReactElement {
  const { user } = useAuth();
  const { data } = useVercelTeamList();

  return (
    <ul>
      <li>
        <Link to={paths.team}>{user?.name}</Link>
      </li>
      {data?.teams &&
        data.teams.length > 0 &&
        data.teams.map((team) => (
          <li key={team.id}>
            <Link to={`/team/${team.id}`}>{team.name}</Link>
          </li>
        ))}
    </ul>
  );
}
