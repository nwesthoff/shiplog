import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useVercelDeploymentList, useVercelTeam } from 'services/vercel';
import styles from './Deployments.module.css';

const stateColorMap = {
  READY: '#50e3c2',
  ERROR: '#e00',
  QUEUED: 'lightgray',
  CANCELED: '#eaeaea',
  BUILDING: 'orange',
};

export default function Deployments(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: team } = useVercelTeam({ teamId });
  const { user } = useAuth();
  const { data: deployments, isValidating: deploymentsRefreshing } =
    useVercelDeploymentList({ teamId, limit: 20, swrOptions: { refreshInterval: 10 } });

  return (
    <div>
      <Link to={paths.home}>back</Link>
      {deploymentsRefreshing && 'refreshing'}
      <h3>{team?.name || user?.name}</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {deployments?.deployments &&
          deployments.deployments.length > 0 &&
          deployments.deployments.map((deployment) => (
            <li className={styles.deploymentLine} key={deployment.uid}>
              <div
                className={styles.statusCircle}
                style={{
                  backgroundColor: stateColorMap[deployment.state] || 'gray',
                }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{deployment.name}</h4>
                <p style={{ margin: 0 }}>{deployment.uid}</p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
