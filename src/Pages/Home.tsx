import { ReactElement, useEffect } from 'react';
import { localStore } from 'config/localStorage';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { useParams } from 'react-router';
import { Service } from 'types/services';
import { useNavigate } from 'react-router-dom';

interface Props {}

export default function Home({}: Props): ReactElement {
  const { user, loading: userLoading } = useAuth();
  const lastTeam = localStorage.getItem(localStore.lastOpenTeam);
  const { service } = useParams<{ service?: Service }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (lastTeam) {
      const team = JSON.parse(lastTeam);
      navigate(`${paths.team}/${team.service}/${team.id}`);
    }

    if (!service && !userLoading) {
      const service = user?.netlify ? 'netlify' : 'vercel';
      if (service === 'netlify') {
        navigate(`${paths.team}/${service}/${user?.netlify?.id}`);
      } else if (service === 'vercel') {
        navigate(`${paths.team}/${service}/${user?.vercel?.uid}`);
      }
    }
  }, [lastTeam, service, userLoading]);

  return <></>;
}
