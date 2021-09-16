import Button from 'components/Button/Button';
import { ReactElement } from 'react';
import { VercelDeployment } from 'types/vercel';
import styles from './Deployments.module.scss';
import { FiArrowUpRight, FiGitBranch } from 'react-icons/fi';
import { formatDistance, formatDistanceStrict, formatDistanceToNow } from 'date-fns';
import { shortFormatDistance } from 'utils/helpers/shortFormatDistance';
import { useVercelBuild } from 'services/vercel';

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
  created,
  ...props
}: VercelDeployment & Props): ReactElement {
  function getTimeSinceDeploy() {
    return shortFormatDistance(formatDistanceStrict(created, new Date())) + ' ago';
  }

  return (
    <li className={styles.dplLine} key={props.uid}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className={styles.commitMessage}>{props.meta.githubCommitMessage}</h3>
        <div className={styles.commitRef}>
          <FiGitBranch style={{ color: 'var(--color-muted)' }} />
          <a
            target="blank"
            href={`https://github.com/${props.meta.githubOrg}/${props.meta.githubRepo}/commit/${props.meta.githubCommitSha}`}
            className={styles.dplId}
          >
            <h5 className={styles.dplCommitRefText}>{props.meta.githubCommitRef}</h5>
          </a>
        </div>
        <h3 className={styles.projectProps}>
          <span className={styles.projectName}>{props.name}</span> {getTimeSinceDeploy()}{' '}
          by {props.creator.username}
        </h3>
      </div>
      <div className={styles.dplSidebar}>
        <div className={styles.dplInfo}>
          <div className={styles.dplState}>
            <div
              className={styles.statusCircle}
              style={{
                backgroundColor: stateColorMap[props.state] || 'gray',
              }}
            />
            <p>{props.state.toLowerCase()}</p>
          </div>
          {props.state === 'READY' && props.buildingAt && props.ready && (
            <div>
              {shortFormatDistance(formatDistanceStrict(props.buildingAt, props.ready))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {props.state === 'READY' ? (
            <>
              <Button target="blank" href={'https://' + props.url}>
                Visit
              </Button>
              <Button
                variant="outlined"
                target="blank"
                href={`https://vercel.com/${team}/${props.name}/${props.uid.replace(
                  'dpl_',
                  ''
                )}`}
              >
                <FiArrowUpRight />
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              target="blank"
              href={`https://vercel.com/${team}/${props.name}/${props.uid.replace(
                'dpl_',
                ''
              )}`}
            >
              Details
              <FiArrowUpRight />
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}