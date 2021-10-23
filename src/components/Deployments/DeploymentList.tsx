import Header from 'components/Header/Header';
import { ScrollProvider } from 'components/Layout/Layout';
import RefreshChip from 'components/RefreshChip/RefreshChip';
import { useAuth } from 'hooks/useAuth';
import { ReactElement, useContext } from 'react';
import { useLocation, useParams } from 'react-router';
import { useEffect } from 'react';
import { useVercelDeploymentList, useVercelTeam, useVercelUser } from 'services/vercel';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.scss';
import { localStore } from 'config/localStorage';

const PAGE_SIZE = 20;

export default function DeploymentList(): ReactElement {
  const { layoutScrolled } = useContext(ScrollProvider);

  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const proj = params.get('proj');

  const { data: userData } = useVercelUser();
  const { data: teamData } = useVercelTeam({ teamId });
  const { user } = useAuth();
  const {
    data: dplData,
    isValidating: dplValidating,
    size: dplPages,
    setSize: setDplPages,
  } = useVercelDeploymentList({
    teamId,
    projectId: proj || undefined,
    limit: PAGE_SIZE,
    swrOptions: { refreshInterval: 10000, refreshWhenHidden: true },
  });

  const flatDpls = dplData?.flatMap((map) => map.deployments);

  useEffect(() => {
    const notifyAllBuilds = JSON.parse(
      window.localStorage.getItem(localStore.notifyAllBuilds) || 'true'
    );

    const dplState = !!flatDpls?.find((dpl) => {
      if (!notifyAllBuilds && userData) {
        return (
          dpl.state === 'BUILDING' && dpl.creator.username === userData.user.username
        );
      }
      return dpl.state === 'BUILDING';
    });

    if (dplState) {
      (window as any).ipc.send('buildState', 'building');
    } else {
      (window as any).ipc.send('buildState', 'ready');
    }
  }, [dplData]);

  return (
    <>
      <Header>
        <h1 style={{ marginTop: 0 }}>{teamData?.name || user?.vercel?.name}</h1>
        {dplValidating && <RefreshChip showText={!layoutScrolled} />}
      </Header>
      {flatDpls && flatDpls.length > 0 && (
        <ul className={styles.dplList}>
          {flatDpls.map((deployment, i) => (
            <DeploymentItem
              pageNext={() => setDplPages(dplPages + 1)}
              lastItem={flatDpls.length - 10 === i}
              team={teamData?.slug || user?.vercel?.username || ''}
              key={deployment.uid}
              {...deployment}
            />
          ))}
        </ul>
      )}
    </>
  );
}
