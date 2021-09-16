import Chip from 'components/Chip/Chip';
import { ScrollProvider } from 'components/Layout/Layout';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useContext } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { useParams } from 'react-router';
import { useVercelDeploymentList, useVercelTeam } from 'services/vercel';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.scss';

export default function Deployments(): ReactElement {
  const { layoutScrolled } = useContext(ScrollProvider);

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
      <header className={`${styles.dplHeader} ${layoutScrolled && styles.scrolled}`}>
        <h1 style={{ marginTop: 0 }}>{teamData?.name || user?.name}</h1>
        {deploymentsRefreshing ? (
          layoutScrolled ? (
            <FiRefreshCw
              style={{
                color: 'var(--color-muted)',
                animation: 'rotating 1.5s linear infinite',
              }}
            />
          ) : (
            <Chip>
              Refreshing
              <FiRefreshCw style={{ animation: 'rotating 1.5s linear infinite' }} />
            </Chip>
          )
        ) : null}
      </header>
      {deploymentData && deploymentData.deployments.length > 0 && (
        <ul className={styles.dplList}>
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
