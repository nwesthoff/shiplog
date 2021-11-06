import { ReactElement } from 'react';
import { localStore } from 'config/localStorage';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Redirect, useParams } from 'react-router';
import { Service } from 'types/services';

interface Props {}

export default function Home({}: Props): ReactElement {
  const { user, loading: userLoading } = useAuth();
  const lastTeam = localStorage.getItem(localStore.lastOpenTeam);
  const { service } = useParams<{ service?: Service }>();

  if (lastTeam) {
    const team = JSON.parse(lastTeam);
    return <Redirect to={`${paths.team}/${team.service}/${team.id}`} />;
  }

  if (!service && !userLoading) {
    const service = user?.netlify ? 'netlify' : 'vercel';
    if (service === 'netlify') {
      return <Redirect to={`${paths.team}/${service}/${user?.netlify?.id}`} />;
    } else if (service === 'vercel') {
      return <Redirect to={`${paths.team}/${service}/${user?.vercel?.uid}`} />;
    }
  }

  return <></>;
}
