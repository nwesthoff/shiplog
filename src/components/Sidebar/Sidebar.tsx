import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.scss';
import { paths } from 'config/paths';
import { FiSettings } from 'react-icons/fi';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useVercelProjectList } from 'services/vercel';
import ProjectList from 'components/ProjectList/ProjectList';

export default function Sidebar(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { pathname } = useLocation();
  const history = useHistory();

  const { data: projData } = useVercelProjectList({ teamId });

  return (
    <aside className={styles.sidebarWrapper} data-theme="dark">
      <div className={styles.sidebar}>
        <div className={styles.innerSidebar}>
          {pathname !== paths.settings && <TeamSelect />}
          {pathname.includes(paths.team) && projData && projData.projects.length > 0 && (
            <ProjectList projects={projData.projects} />
          )}
        </div>
      </div>
      <div className={styles.settingsBg}>
        <button
          style={{
            pointerEvents: 'all',
            color: 'white',
          }}
          onClick={
            pathname === paths.settings
              ? history.goBack
              : () => history.push(paths.settings)
          }
        >
          <div style={{ padding: 'var(--space-16)' }}>
            <FiSettings />
          </div>
        </button>
      </div>
    </aside>
  );
}
