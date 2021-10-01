import { ReactElement, useEffect, useState } from 'react';
import { VercelDeployment } from 'types/vercel';
import styles from './Deployments.module.scss';
import { FiArrowUpRight, FiGitBranch } from 'react-icons/fi';
import { formatDistanceStrict, intervalToDuration } from 'date-fns';
import { shortFormatDistance } from 'utils/helpers/shortFormatDistance';
import AnchorButton from 'components/Button/AnchorButton';

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
  state,
  ready,
  buildingAt,
  ...props
}: VercelDeployment & Props): ReactElement {
  const interval = intervalToDuration({
    start: buildingAt || new Date(),
    end: state === 'READY' ? ready : new Date(),
  });

  const [buildTime, setBuildTime] = useState(`${interval.minutes}m ${interval.seconds}s`);

  useEffect(() => {
    const timeSinceInterval = setInterval(() => {
      const interval = intervalToDuration({
        start: buildingAt || new Date(),
        end: state === 'READY' ? ready : new Date(),
      });

      setBuildTime(`${interval.minutes}m ${interval.seconds}s`);
    }, 1000);

    return () => {
      clearInterval(timeSinceInterval);
    };
  }, [buildingAt, ready, state]);

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
          <span className={styles.projectName}>{props.name}</span>{' '}
          {shortFormatDistance(formatDistanceStrict(created, new Date()))} ago by{' '}
          {props.creator.username}
        </h3>
      </div>
      <div className={styles.dplSidebar}>
        <div className={styles.dplInfo}>
          <div className={styles.dplState}>
            <div
              className={styles.statusCircle}
              style={{
                backgroundColor: stateColorMap[state] || 'gray',
              }}
            />
            <p>{state.toLowerCase()}</p>
          </div>
          {(state === 'READY' || state === 'BUILDING') && buildingAt && (
            <div>{buildTime}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {state === 'READY' ? (
            <>
              <AnchorButton target="blank" href={'https://' + props.url}>
                Visit
              </AnchorButton>
              <AnchorButton
                variant="outlined"
                target="blank"
                href={`https://vercel.com/${team}/${props.name}/${props.uid.replace(
                  'dpl_',
                  ''
                )}`}
              >
                <FiArrowUpRight />
              </AnchorButton>
            </>
          ) : (
            <AnchorButton
              variant="outlined"
              target="blank"
              href={`https://vercel.com/${team}/${props.name}/${props.uid.replace(
                'dpl_',
                ''
              )}`}
            >
              Details
              <FiArrowUpRight />
            </AnchorButton>
          )}
        </div>
      </div>
    </li>
  );
}
