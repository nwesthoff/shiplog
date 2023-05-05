import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { localStore } from 'config/localStorage';
import Select from 'components/Select/Select';
import { Service } from 'types/services';
import { useTeamList } from 'hooks/useTeamList';

export default function TeamSelect(): ReactElement {
  const { user } = useAuth();
  const { data: vercelTeamData } = useTeamList({ service: 'vercel' });
  const { data: netlifyTeamData } = useTeamList({ service: 'netlify' });
  const navigate = useNavigate();
  const location = useLocation();
  const teamsAndUser: { id: string; name: string; service: Service }[] = [];

  netlifyTeamData &&
    teamsAndUser.push(
      ...netlifyTeamData.teams.map((team) => ({
        id: team.id,
        name: team.name,
        service: 'netlify' as Service,
      }))
    );

  user?.vercel &&
    teamsAndUser.push({
      id: user?.vercel?.uid,
      name: user?.vercel?.name,
      service: 'vercel',
    });

  vercelTeamData &&
    teamsAndUser.push(
      ...vercelTeamData.teams.map((team) => {
        return { ...team, service: 'vercel' as Service };
      })
    );

  const selectedItem =
    teamsAndUser.find((team) => team?.id && location.pathname.includes(team.id)) || user;

  function onChange(team) {
    if (team.id && !location.pathname.includes(team.id)) {
      localStorage.setItem(localStore.lastOpenTeam, JSON.stringify(team));
      navigate(`${paths.team}/${team.service}/${team.id}`);
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
