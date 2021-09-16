import { ReactElement } from 'react';
import Button from 'components/Button/Button';
import { useAuth } from 'hooks/useAuth';
import styles from './Settings.module.scss';
import Header from 'components/Header/Header';

export default function Settings(): ReactElement {
  const { logout } = useAuth();

  return (
    <>
      <Header>
        <h1>Settings</h1>
      </Header>
      <div className={styles.settingsPage}>
        <span style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <input id="startupCheckbox" type="checkbox" value="false" />
          <label htmlFor="startupCheckbox">Open on startup</label>{' '}
          <span style={{ color: 'var(--color-red)' }}>(beta)</span>
        </span>
        <Button onClick={logout}>Log out</Button>
      </div>
    </>
  );
}
