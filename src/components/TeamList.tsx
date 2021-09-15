import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useVercelTeamList } from 'services/vercel';
import { localStore } from 'config/localStorage';

export default function TeamList(): ReactElement {
  const [teamId, setTeamId] = useState<string>();
  const { user } = useAuth();
  const { data } = useVercelTeamList();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const lastTeamId = localStorage.getItem(localStore.lastOpenTeamId);
    lastTeamId && setTeamId(lastTeamId);
  }, []);

  useEffect(() => {
    if (teamId && !location.pathname.includes(teamId)) {
      localStorage.setItem(localStore.lastOpenTeamId, teamId);
      history.push(`${paths.team}/${teamId.includes('team') ? teamId : ''}`);
    }
  }, [teamId, history, location]);

  return (
    <select value={teamId} onChange={(e) => setTeamId(e.target.value)}>
      <optgroup label="Personal Account">
        <option label={user?.name} value={user?.uid} />
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
