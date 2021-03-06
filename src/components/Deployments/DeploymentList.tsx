import Header from 'components/Header/Header';
import { ScrollProvider } from 'components/Layout/Layout';
import RefreshChip from 'components/RefreshChip/RefreshChip';
import { ReactElement, useContext } from 'react';
import { useEffect } from 'react';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.scss';
import { localStore } from 'config/localStorage';
import { Deployment, Service } from 'types/services';
import { useParams } from 'react-router';
import { SiNetlify, SiVercel } from 'react-icons/si';
import { useAuth } from 'hooks/useAuth';

interface Props {
  dpls: Deployment[];
  dplValidating: boolean;
  dplPages: number;
  setDplPages: (pages: number) => void;
  teamName: string;
  teamSlug?: string;
}

export default function DeploymentList({
  dpls,
  dplValidating,
  dplPages,
  setDplPages,
  teamName,
  teamSlug,
}: Props): ReactElement {
  const { service } = useParams<{ service: Service }>();
  const { layoutScrolled } = useContext(ScrollProvider);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const notifyAllBuilds = JSON.parse(
      window.localStorage.getItem(localStore.notifyAllBuilds) || 'true'
    );

    const anyDplBuilding = !!dpls?.find((dpl) => {
      if (!notifyAllBuilds && isAuthenticated && service !== 'netlify') {
        return dpl.state === 'BUILDING' && dpl.meta.ghUsername === user?.vercel?.username;
      }
      return dpl.state === 'BUILDING';
    });

    if (anyDplBuilding) {
      (window as any).ipc.send('buildState', 'building');
    } else {
      (window as any).ipc.send('buildState', 'ready');
    }
  }, [dpls]);

  return (
    <>
      <Header>
        <h1
          style={{
            marginTop: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-8)',
          }}
        >
          {service === 'vercel' && <SiVercel />}
          {service === 'netlify' && <SiNetlify />} {teamName}
        </h1>
        {dplValidating && <RefreshChip showText={!layoutScrolled} />}
      </Header>
      {dpls.length > 0 && (
        <ul className={styles.dplList}>
          {dpls.map((deployment, i) => (
            <DeploymentItem
              pageNext={() => setDplPages(dplPages + 1)}
              lastItem={dpls.length - 10 === i}
              teamName={teamName}
              teamSlug={teamSlug}
              key={deployment.id + '-' + i}
              {...deployment}
            />
          ))}
        </ul>
      )}
    </>
  );
}
