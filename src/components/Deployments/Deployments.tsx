import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useVercelDeployment, useVercelTeam } from 'services/vercel';

export default function Deployments(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team } = useVercelTeam({ teamId });
  const { user } = useAuth();
  const { data: deployments } = useVercelDeployment({ teamId });

  return (
    <div>
      <Link to={paths.home}>back</Link>
      <h3>{team?.name || user?.name}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {deployments?.deployments &&
          deployments.deployments.length > 0 &&
          deployments.deployments.map((deployment) => (
            <li key={deployment.uid}>
              <h4 style={{ margin: 0 }}>{deployment.name}</h4>
              <p style={{ marginTop: 0 }}>{deployment.uid}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}
