import Button from 'components/Button/Button';
import { ReactElement } from 'react';
import { VercelDeployment } from 'types/vercel';
import styles from './Deployments.module.css';
import { FiArrowUpRight } from 'react-icons/fi';

const stateColorMap = {
  READY: 'var(--color-cyan)',
  ERROR: 'var(--color-red)',
  QUEUED: 'lightgray',
  CANCELED: '#eaeaea',
  BUILDING: 'var(--color-orange)',
};

interface Props {
  team: string;
}

export default function DeploymentItem({
  team,
  ...props
}: VercelDeployment & Props): ReactElement {
  return (
    <li className={styles.deploymentLine} key={props.uid}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className={styles.commitMessage}>{props.meta.githubCommitMessage}</h3>
        <a target="blank" href={'https://' + props.url} className={styles.propsId}>
          <h5 className={styles.commitRef}>{props.meta.githubCommitRef}</h5>
        </a>
        <h3 className={styles.projectProps}>
          {props.name} by {props.creator.username}
        </h3>
      </div>
      <div
        style={{
          width: 'var(--space-128)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 'var(--space-8)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
          <div
            className={styles.statusCircle}
            style={{
              backgroundColor: stateColorMap[props.state] || 'gray',
            }}
          />
          {props.state}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          <Button target="blank" href={'https://' + props.url}>
            Visit
          </Button>
          <Button
            target="blank"
            href={`https://vercel.com/${team}/${props.name}/${props.uid.replace(
              'dpl_',
              ''
            )}`}
          >
            <FiArrowUpRight />
          </Button>
        </div>
      </div>
    </li>
  );
}
