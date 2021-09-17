import { ReactElement } from 'react';
import LinkButton from 'components/Button/LinkButton';
import { paths } from 'config/paths';
import { VercelProject } from 'types/vercel';
import { useLocation, useParams } from 'react-router';
import styles from './ProjectList.module.scss';
import ProjectButton from './ProjectButton';

interface Props {
  projects: VercelProject[];
}

export default function ProjectList({ projects }: Props): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const proj = params.get('proj');

  return (
    <ul className={styles.projList}>
      <ProjectButton
        to={`${paths.team}/${teamId ? teamId : ''}`}
        variant={proj === null ? 'default' : 'transparent'}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        All Projects
      </ProjectButton>
      {projects.length > 0 &&
        projects.map((dpl) => {
          return (
            <li
              key={dpl.id}
              style={{ listStyle: 'none', color: 'var(--color-foreground)' }}
            >
              <LinkButton
                variant={proj === dpl.name ? 'default' : 'transparent'}
                to={`${paths.team}${teamId ? `/${teamId}` : ''}?proj=${dpl.name}`}
              >
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dpl.name}
                </span>
              </LinkButton>
            </li>
          );
        })}
    </ul>
  );
}
