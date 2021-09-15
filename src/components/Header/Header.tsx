import { useAuth } from 'hooks/useAuth';
import TeamList from 'Pages/TeamList';
import { ReactElement } from 'react';
import styles from './Header.module.css';

export default function Header(): ReactElement {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      {user ? (
        <nav className={styles.nav}>
          <TeamList />
          <button onClick={logout}>Log out</button>
        </nav>
      ) : (
        <h3 className={styles.logo}>VercelfService</h3>
      )}
    </header>
  );
}
