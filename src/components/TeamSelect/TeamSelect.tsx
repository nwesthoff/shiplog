import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { localStore } from 'config/localStorage';
import Select from 'components/Select/Select';
import { Service } from 'types/services';
import { useTeamList } from 'hooks/useTeamList';

export default function TeamSelect(): ReactElement {
  const { user } = useAuth();
  const { data: teamData } = useTeamList({ service: 'vercel' });
  const history = useHistory();
  const location = useLocation();
  const teamsAndUser: { id: string; name: string; service: Service }[] = [];
  user?.netlify &&
    teamsAndUser.push({
      id: user?.netlify?.id,
      name: user?.netlify?.full_name,
      service: 'netlify',
    });

  user?.vercel &&
    teamsAndUser.push({
      id: user?.vercel?.uid,
      name: user?.vercel?.name,
      service: 'vercel',
    });

  teamData &&
    teamsAndUser.push(
      ...teamData.teams.map((team) => {
        return { ...team, service: 'vercel' as Service };
      })
    );

  const selectedItem =
    teamsAndUser.find((team) => team?.id && location.pathname.includes(team.id)) || user;

  function onChange(team) {
    if (team.id && !location.pathname.includes(team.id)) {
      localStorage.setItem(localStore.lastOpenTeam, JSON.stringify(team));
      history.push(`${paths.team}/${team.service}/${team.id}`);
    }
  }

  if (!teamsAndUser || teamsAndUser.length <= 1) {
    return <></>;
  }

  return (
    <Select
      items={teamsAndUser}
      defaultSelectedItem={selectedItem}
      onSelectedItemChange={({ selectedItem }) => onChange(selectedItem)}
    />
  );
}
