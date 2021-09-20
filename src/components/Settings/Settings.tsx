import { ReactElement, useState } from 'react';
import Button from 'components/Button/Button';
import { useAuth } from 'hooks/useAuth';
import styles from './Settings.module.scss';
import Header from 'components/Header/Header';
import { localStore } from 'config/localStorage';

export default function Settings(): ReactElement {
  const { logout } = useAuth();
  const [startAtLogin, setStartAtLogin] = useState(
    window.localStorage.getItem(localStore.startAtLogin) === 'true'
  );

  function handleStartupChange(e) {
    console.log(e.target.checked);
    setStartAtLogin(e.target.checked);
    window.localStorage.setItem(localStore.startAtLogin, e.target.checked.toString());
  }

  return (
    <>
      <Header>
        <h1>Settings</h1>
      </Header>
      <div className={styles.settingsPage}>
        <span style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
          <input
            id="startupCheckbox"
            type="checkbox"
            checked={startAtLogin}
            onChange={handleStartupChange}
          />
          <label htmlFor="startupCheckbox">Open on startup</label>{' '}
          <span style={{ color: 'var(--color-red)' }}>(beta)</span>
        </span>
        <Button onClick={logout}>Log out</Button>
      </div>
    </>
  );
}
