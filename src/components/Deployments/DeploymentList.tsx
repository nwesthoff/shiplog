import Header from 'components/Header/Header';
import { ScrollProvider } from 'components/Layout/Layout';
import RefreshChip from 'components/RefreshChip/RefreshChip';
import { ReactElement, useContext } from 'react';
import { useEffect } from 'react';
import { useVercelUser } from 'services/vercel';
import DeploymentItem from './DeploymentItem';
import styles from './Deployments.module.scss';
import { localStore } from 'config/localStorage';
import { Deployment, Service } from 'types/services';
import { useParams } from 'react-router';
import { SiNetlify, SiVercel } from 'react-icons/si';

interface Props {
  dpls: Deployment[];
  dplValidating: boolean;
  dplPages: number;
  setDplPages: (pages: number) => void;
  teamName: string;
}

export default function DeploymentList({
  dpls,
  dplValidating,
  dplPages,
  setDplPages,
  teamName,
}: Props): ReactElement {
  const { service } = useParams<{ service: Service }>();
  const { layoutScrolled } = useContext(ScrollProvider);
  const { data: userData } = useVercelUser();

  useEffect(() => {
    const notifyAllBuilds = JSON.parse(
      window.localStorage.getItem(localStore.notifyAllBuilds) || 'true'
    );

    const dplState = !!dpls?.find((dpl) => {
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
          {service === 'vercel' && <SiVercel />} {service === 'netlify' && <SiNetlify />}{' '}
          {teamName}
        </h1>
        {dplValidating && <RefreshChip showText={!layoutScrolled} />}
      </Header>
      {dpls.length > 0 && (
        <ul className={styles.dplList}>
          {dpls.map((deployment, i) => (
            <DeploymentItem
              pageNext={() => setDplPages(dplPages + 1)}
              lastItem={dpls.length - 10 === i}
              team={teamName}
              key={deployment.id}
              {...deployment}
            />
          ))}
        </ul>
      )}
    </>
  );
}
