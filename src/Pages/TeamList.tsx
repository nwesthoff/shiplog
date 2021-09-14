import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import { useVercelTeamList } from 'services/vercel';

export default function TeamList(): ReactElement {
  const { user } = useAuth();
  const { data } = useVercelTeamList();
  const history = useHistory();

  function onChange(e) {
    history.push(`${paths.team}/${e.target.value}`);
  }

  return (
    <select onChange={onChange}>
      <optgroup label="Personal Account">
        <option label={user?.name} />
      </optgroup>
      {data?.teams && data.teams.length > 0 && (
        <optgroup label="Teams">
          {data.teams.map((team) => (
            <option key={team.id} label={team.name} value={team.id}>
              {team.name}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
