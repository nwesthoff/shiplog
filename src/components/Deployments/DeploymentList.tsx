import Header from 'components/Header/Header';
import { ScrollProvider } from 'components/Layout/Layout';
import RefreshChip from 'components/RefreshChip/RefreshChip';
import { ipcRenderer } from 'electron';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useContext } from 'react';
import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
import { useVercelDeploymentList, useVercelTeam } from 'services/vercel';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.scss';

export default function DeploymentList(): ReactElement {
  const { layoutScrolled } = useContext(ScrollProvider);

  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const proj = params.get('proj');

  const { data: teamData } = useVercelTeam({ teamId });
  const { user } = useAuth();
  const { data: dplData, isValidating: dplValidating } = useVercelDeploymentList({
    teamId,
    projectId: proj || undefined,
    limit: 20,
    swrOptions: { refreshInterval: 10000, refreshWhenHidden: true },
  });

  useEffect(() => {
    const dplState = !!dplData?.deployments.find((dpl) => dpl.state === 'BUILDING');
    if (dplState) {
      (window as any).ipc.send('buildState', 'building');
    } else {
      (window as any).ipc.send('buildState', 'ready');
    }
  }, [dplData]);

  return (
    <>
      <Header>
        <h1 style={{ marginTop: 0 }}>{teamData?.name || user?.name}</h1>
        {dplValidating && <RefreshChip showText={!layoutScrolled} />}
      </Header>
      {dplData && dplData.deployments.length > 0 && (
        <ul className={styles.dplList}>
          {dplData.deployments
            // .filter((dpl) => (proj ? dpl.name === proj : true))
            .map((deployment) => (
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
