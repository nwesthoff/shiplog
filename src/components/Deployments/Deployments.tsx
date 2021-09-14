import { paths } from 'config/paths';
import { ReactElement } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useVercelDeployment } from 'services/vercel';

export default function Deployments(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { data } = useVercelDeployment({ teamId });

  return (
    <div>
      <Link to={paths.home}>back</Link>
      {teamId}
      <ul>
        {data?.deployments &&
          data.deployments.length > 0 &&
          data.deployments.map((deployment) => (
            <li key={deployment.uid}>
              {deployment.name}
              {deployment.uid}
            </li>
          ))}
      </ul>
    </div>
  );
}
