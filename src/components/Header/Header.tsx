import { useAuth } from 'hooks/useAuth';
import TeamList from 'Pages/TeamList';
import { ReactElement } from 'react';
import styles from './Header.module.css';

export default function Header(): ReactElement {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      {user ? <NavLoggedIn /> : <h3 className={styles.logo}>VercelfService</h3>}
    </header>
  );
}

function NavLoggedIn(): ReactElement {
  const { logout } = useAuth();

  return (
    <nav>
      <button onClick={logout}>Log out</button>
      <TeamList />
    </nav>
  );
}
