import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.css';
import { paths } from 'config/paths';
import { FiSettings } from 'react-icons/fi';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useVercelProjectList } from 'services/vercel';
import ProjectList from 'components/ProjectList/ProjectList';

export default function Sidebar(): ReactElement {
  const { teamId } = useParams<{ teamId: string }>();
  const { pathname } = useLocation();

  const { data: projData } = useVercelProjectList({ teamId });

  return (
    <aside className={styles.sidebarWrapper} data-theme="dark">
      <div className={styles.sidebar}>
        <div className={styles.innerSidebar}>
          <TeamSelect />
          {pathname.includes(paths.team) && projData && projData.projects.length > 0 && (
            <ProjectList projects={projData.projects} />
          )}
        </div>
      </div>
      <div className={styles.settingsBg}>
        <Link
          style={{ pointerEvents: 'all' }}
          to={pathname === paths.settings ? paths.home : paths.settings}
        >
          <FiSettings />
        </Link>
      </div>
    </aside>
  );
}
