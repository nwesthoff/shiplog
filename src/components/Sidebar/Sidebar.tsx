import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.scss';
import { paths } from 'config/paths';
import { FiSettings } from 'react-icons/fi';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import ProjectList from 'components/ProjectList/ProjectList';
import { useProjectList } from 'hooks/useProjectList';
import { Service } from 'types/services';

export default function Sidebar(): ReactElement {
  const { teamId, service = 'vercel' } = useParams<{
    teamId: string;
    service: Service;
  }>();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: projData } = useProjectList({ teamId, service });

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
              ? () => navigate(-1)
              : () => navigate(paths.settings)
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
