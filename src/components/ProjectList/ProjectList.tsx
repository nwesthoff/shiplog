import { ReactElement } from 'react';
import { paths } from 'config/paths';
import { useLocation, useParams } from 'react-router';
import styles from './ProjectList.module.scss';
import ProjectButton from './ProjectButton';
import { Project, Service } from 'types/services';

interface Props {
  projects: Project[];
}

export default function ProjectList({ projects }: Props): ReactElement {
  const { teamId, service } = useParams<{ teamId: string; service?: Service }>();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const proj = params.get('proj');

  return (
    <ul className={styles.projList}>
      <ProjectButton
        to={`${paths.team}/${service}/${teamId || ''}`}
        variant={proj === null ? 'default' : 'transparent'}
        style={{ marginBottom: 'var(--space-8)' }}
      >
        All Projects
      </ProjectButton>
      {projects.length > 0 &&
        projects.map((dpl) => {
          return (
            <li className={styles.projectListItem} key={dpl.id}>
              <ProjectButton
                variant={proj === dpl.id ? 'default' : 'transparent'}
                to={`${paths.team}/${service}${`/${teamId}` || ''}?proj=${dpl.id}`}
              >
                {dpl.name}
              </ProjectButton>
            </li>
          );
        })}
    </ul>
  );
}
