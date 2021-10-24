import { ReactElement, useEffect, useState, useRef } from 'react';
import styles from './Deployments.module.scss';
import { FiArrowUpRight, FiGitBranch } from 'react-icons/fi';
import { formatDistanceStrict, intervalToDuration } from 'date-fns';
import { shortFormatDistance } from 'utils/helpers/shortFormatDistance';
import AnchorButton from 'components/Button/AnchorButton';
import { Deployment, Service } from 'types/services';
import { useParams } from 'react-router';

const stateColorMap = {
  READY: 'var(--color-cyan)',
  ERROR: 'var(--color-red)',
  QUEUED: 'lightgray',
  CANCELED: '#eaeaea',
  BUILDING: 'var(--color-orange)',
};

interface Props {
  team: string;
  lastItem: boolean;
  pageNext?: VoidFunction;
}

export default function DeploymentItem({
  team,
  created,
  state,
  buildEnd,
  buildStart,
  lastItem,
  pageNext,
  ...props
}: Deployment & Props): ReactElement {
  const itemRef = useRef<HTMLLIElement>(null);
  const { service } = useParams<{ service: Service }>();

  useEffect(() => {
    if (lastItem && itemRef && pageNext) {
      const observer = new IntersectionObserver((e) => {
        if (e[0].isIntersecting) {
          pageNext();
        }
      });

      observer.observe(itemRef.current as HTMLLIElement);

      return () => {
        observer.disconnect();
      };
    }
  }, [itemRef, lastItem]);

  const interval = intervalToDuration({
    start: buildStart || new Date(),
    end: state === 'READY' ? buildEnd : new Date(),
  });

  const [buildTime, setBuildTime] = useState(`${interval.minutes}m ${interval.seconds}s`);

  useEffect(() => {
    const timeSinceInterval = setInterval(() => {
      const interval = intervalToDuration({
        start: buildStart || new Date(),
        end: state === 'READY' ? buildEnd : new Date(),
      });

      setBuildTime(`${interval.minutes}m ${interval.seconds}s`);
    }, 1000);

    return () => {
      clearInterval(timeSinceInterval);
    };
  }, [buildStart, buildEnd, state]);

  return (
    <li ref={itemRef} className={styles.dplLine} key={props.id + created}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className={styles.commitMessage}>{props.meta.ghCommitMessage}</h3>
        <div className={styles.commitRef}>
          <FiGitBranch style={{ color: 'var(--color-muted)' }} />
          <a
            target="blank"
            href={`https://github.com/${props.meta.ghOrg}/${props.meta.ghRepo}/commit/${props.meta.ghCommitSha}`}
            className={styles.dplId}
          >
            <h5 className={styles.dplCommitRefText}>{props.meta.ghCommitRef}</h5>
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
          {(state === 'READY' || state === 'BUILDING') && buildStart && (
            <div className={styles.buildTime}>{buildTime}</div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-8)' }}>
          {state === 'READY' ? (
            <>
              <AnchorButton
                target="blank"
                href={service === 'vercel' ? 'https://' + props.url : props.url}
              >
                Visit
              </AnchorButton>
              <AnchorButton
                variant="outlined"
                target="blank"
                href={
                  service === 'vercel'
                    ? `https://vercel.com/${team}/${props.name}/${props.id.replace(
                        'dpl_',
                        ''
                      )}`
                    : props.admin_url
                }
              >
                <FiArrowUpRight />
              </AnchorButton>
            </>
          ) : (
            <AnchorButton
              variant="outlined"
              target="blank"
              href={`https://vercel.com/${team}/${props.name}/${props.id.replace(
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
