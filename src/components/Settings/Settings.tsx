import { ReactElement, useState } from 'react';
import styles from './Settings.module.scss';
import Header from 'components/Header/Header';
import { localStore } from 'config/localStorage';
import Toggle from 'components/Inputs/Toggle';
import ServiceLine from './ServiceLine';
import { SiNetlify, SiVercel } from 'react-icons/si';

export default function Settings(): ReactElement {
  const [startAtLogin, setStartAtLogin] = useState(
    window.localStorage.getItem(localStore.startAtLogin) === 'true'
  );
  const [notifyAllBuilds, setNotifyAllBuilds] = useState(
    window.localStorage.getItem(localStore.notifyAllBuilds) === 'true'
  );

  function handleStartupChange(e) {
    setStartAtLogin(e.target.checked);
    window.localStorage.setItem(localStore.startAtLogin, e.target.checked.toString());
  }

  function handleNotifyAllBuildsChange(e) {
    setNotifyAllBuilds(e.target.checked);
    window.localStorage.setItem(localStore.notifyAllBuilds, e.target.checked.toString());
  }

  return (
    <>
      <Header>
        <h1>Settings</h1>
      </Header>
      <div className={styles.settingsPage}>
        <div className={styles.settingsLine}>
          <label
            htmlFor="notifyAllBuilds"
            aria-roledescription="Sets whether the tray icon should change for all builds, or scope to current user"
          >
            Tray Icon state reflects deploys from
          </label>
          <Toggle
            onChange={handleNotifyAllBuildsChange}
            checked={notifyAllBuilds}
            trueOption="everyone"
            falseOption="only me"
          />
        </div>
        <div className={styles.settingsLine}>
          <input
            id="startupCheckbox"
            type="checkbox"
            checked={startAtLogin}
            onChange={handleStartupChange}
          />
          <label htmlFor="startupCheckbox">Open on startup</label>{' '}
          <span style={{ color: 'var(--color-red)' }}>(beta)</span>
        </div>

        <div className={styles.settingsLine}>
          <ServiceLine icon={SiVercel} service="vercel" />
          <ServiceLine icon={SiNetlify} service="netlify" />
        </div>
      </div>
    </>
  );
}
