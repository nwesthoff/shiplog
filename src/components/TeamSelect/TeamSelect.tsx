import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useVercelTeamList } from 'services/vercel';
import { localStore } from 'config/localStorage';
import Select from 'components/Select/Select';

export default function TeamSelect(): ReactElement {
  const { user } = useAuth();
  const { data } = useVercelTeamList();
  const history = useHistory();
  const location = useLocation();

  const teamsAndUser = [{ id: user?.uid, name: user?.name }].concat(data?.teams || []);
  const selectedItem =
    teamsAndUser.find((team) => team?.id && location.pathname.includes(team.id)) || user;

  function onChange(teamId) {
    if (teamId && !location.pathname.includes(teamId)) {
      localStorage.setItem(localStore.lastOpenTeamId, teamId);
      history.push(`${paths.team}/${teamId}`);
    }
  }

  return (
    <Select
      items={teamsAndUser}
      defaultSelectedItem={selectedItem}
      onSelectedItemChange={({ selectedItem }) => onChange(selectedItem.id)}
    />
  );
}
