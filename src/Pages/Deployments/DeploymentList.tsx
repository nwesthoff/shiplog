import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useParams } from 'react-router';
import { useVercelDeploymentList, useVercelTeam } from 'services/vercel';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.css';

export default function Deployments(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { data: teamData } = useVercelTeam({ teamId });
  const { user } = useAuth();
  const { data: deploymentData, isValidating: deploymentsRefreshing } =
    useVercelDeploymentList({
      teamId,
      limit: 20,
      swrOptions: { refreshInterval: 10000 },
    });

  return (
    <>
      <header className={styles.deploymentHeader}>
        <h1 style={{ marginTop: 0 }}>
          {teamData?.name || user?.name} {deploymentsRefreshing && 'refreshing...'}
        </h1>
      </header>
      {deploymentData && deploymentData.deployments.length > 0 && (
        <ul className={styles.deploymentList}>
          {deploymentData.deployments.map((deployment) => (
            <DeploymentItem
              team={teamData?.slug || user?.username || ''}
              key={deployment.uid}
              {...deployment}
            />
          ))}
        </ul>
      )}
    </>
  );
}
