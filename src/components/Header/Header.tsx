import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import styles from './Header.module.css';

export default function Header(): ReactElement {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <nav>{user && <button onClick={logout}>Log out</button>}</nav>
    </header>
  );
}
