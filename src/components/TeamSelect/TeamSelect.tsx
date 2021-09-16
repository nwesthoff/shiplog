import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useVercelTeamList } from 'services/vercel';
import { localStore } from 'config/localStorage';
import styles from './TeamSelect.module.scss';

export default function TeamSelect(): ReactElement {
  const { user } = useAuth();
  const { data } = useVercelTeamList();
  const history = useHistory();
  const location = useLocation();

  function onChange(teamId: string) {
    if (teamId && !location.pathname.includes(teamId)) {
      localStorage.setItem(localStore.lastOpenTeamId, teamId);
      history.push(`${paths.team}/${teamId.includes('team') ? teamId : ''}`);
    }
  }

  useEffect(() => {
    const lastTeamId = localStorage.getItem(localStore.lastOpenTeamId);
    lastTeamId && location.pathname === '/' && onChange(lastTeamId);
  }, []);

  return (
    <select
      className={styles.teamSelect}
      value={location.pathname.replace('/team/', '')}
      onChange={(e) => onChange(e.target.value)}
    >
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
