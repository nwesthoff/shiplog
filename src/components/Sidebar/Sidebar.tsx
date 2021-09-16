import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.css';
import { paths } from 'config/paths';
import { FiSettings } from 'react-icons/fi';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useVercelProjectList } from 'services/vercel';
import LinkButton from 'components/Button/LinkButton';
import { useAuth } from 'hooks/useAuth';

export default function Sidebar(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { user } = useAuth();
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const proj = params.get('proj');
  const { data: projData } = useVercelProjectList({ teamId });

  return (
    <aside className={styles.sidebar} data-theme="dark">
      <div className={styles.innerSidebar}>
        <TeamSelect />
        <ul
          style={{
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-8)',
          }}
        >
          <LinkButton
            to={`${paths.team}/${teamId ? teamId : ''}`}
            variant={proj === null ? 'default' : 'transparent'}
            style={{ marginBottom: 'var(--space-8)' }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              All Projects
            </span>
          </LinkButton>
          {projData &&
            projData.projects.length > 0 &&
            projData.projects
              // .filter((proj) => proj.accountId === teamId)
              .map((dpl) => {
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
      </div>
      <div>
        <Link to={pathname === paths.settings ? paths.home : paths.settings}>
          <FiSettings />
        </Link>
      </div>
    </aside>
  );
}
