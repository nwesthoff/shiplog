import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.css';
import { paths } from 'config/paths';
import { FiSettings } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function Sidebar(): ReactElement {
  return (
    <aside className={styles.sidebar} data-theme="dark">
      <div className={styles.innerSidebar}>
        <TeamSelect />
      </div>
      <div>
        <Link to={paths.settings}>
          <FiSettings />
        </Link>
      </div>
    </aside>
  );
}
