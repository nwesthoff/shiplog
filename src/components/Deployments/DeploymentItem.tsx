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
  teamSlug?: string;
  teamName: string;
  lastItem: boolean;
  pageNext?: VoidFunction;
}

export default function DeploymentItem({
  teamName,
  teamSlug,
  created,
  state,
  buildEnd,
  buildStart,
  lastItem,
  pageNext,
  ...props
}: Deployment & Props): ReactElement {
  const itemRef = useRef<HTMLLIElement>(null);
  const { teamId, service } = useParams<{ teamId: string; service?: Service }>();

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

  const adminUrl = () => {
    return service === 'vercel'
      ? teamName &&
          props.name &&
          props.id &&
          `https://vercel.com/${teamSlug}/${props.name}/${props.id.replace('dpl_', '')}`
      : teamId &&
          props.id &&
          `https://app.netlify.com/teams/${teamId}/builds/${props.id}`;
  };

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
        {props.meta.ghCommitBranch && props.meta.ghOrg && props.meta.ghRepo && (
          <div className={styles.commitRef}>
            <FiGitBranch style={{ color: 'var(--color-muted)' }} />
            <a
              target="blank"
              href={`https://github.com/${props.meta.ghOrg}/${
                props.meta.ghRepo
              }/tree/${encodeURIComponent(props.meta.ghCommitBranch)}`}
              className={styles.dplId}
            >
              <h5 className={styles.dplCommitRefText}>{props.meta.ghCommitBranch}</h5>
            </a>
          </div>
        )}
        <h3 className={styles.projectProps}>
          {props.name && <span className={styles.projectName}>{props.name} </span>}
          {shortFormatDistance(formatDistanceStrict(created, new Date()))} ago{' '}
          {props.meta.ghUsername && `by ${props.meta.ghUsername}`}
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
              <AnchorButton variant="outlined" target="blank" href={adminUrl()}>
                <FiArrowUpRight />
              </AnchorButton>
            </>
          ) : (
            <AnchorButton variant="outlined" target="blank" href={adminUrl()}>
              Details
              <FiArrowUpRight />
            </AnchorButton>
          )}
        </div>
      </div>
    </li>
  );
}
