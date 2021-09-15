import { ReactElement } from 'react';
import TeamSelect from 'components/TeamSelect/TeamSelect';
import styles from './Sidebar.module.css';

interface Props {}

export default function Sidebar({}: Props): ReactElement {
  return (
    <aside className={styles.sidebar} data-theme="dark">
      <div className={styles.innerSidebar}>
        <TeamSelect />
      </div>
    </aside>
  );
}
