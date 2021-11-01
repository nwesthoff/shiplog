import { ReactElement } from 'react';
import { useVercelDeploymentList, useVercelTeam, useVercelUser } from 'services/vercel';
import DeploymentList from 'components/Deployments/DeploymentList';
import { useAuth } from 'hooks/useAuth';
import { useLocation, useParams } from 'react-router';
import { useDeploymentList } from 'hooks/useDeploymentList';
import { Deployment, Service } from 'types/services';

const PAGE_SIZE = 20;

export default function DeploymentsPage(): ReactElement {
  const { teamId, service } = useParams<{ teamId: string; service: Service }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const proj = params.get('proj');

  const { user, isAuthenticated } = useAuth();
  const { data: teamData } = useVercelTeam({
    teamId: isAuthenticated && user?.vercel ? teamId : undefined,
  });

  const {
    data: dplData,
    isValidating: dplValidating,
    size: dplPages,
    setSize: setDplPages,
  } = useDeploymentList({
    service,
    teamId,
    projectId: proj,
    limit: PAGE_SIZE,
    swrOptions: { refreshInterval: 10000, refreshWhenHidden: true },
  });

  const flatDpls = dplData?.flatMap((map) => map.deployments);

  if (!flatDpls) {
    return <></>;
  } else {
    return (
      <DeploymentList
        teamName={
          service === 'vercel'
            ? teamData?.name || user?.vercel?.username || ''
            : user?.netlify?.full_name || ''
        }
        dpls={flatDpls}
        dplValidating={dplValidating}
        dplPages={dplPages}
        setDplPages={setDplPages}
      />
    );
  }
}
