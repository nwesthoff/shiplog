import Button from 'components/Button/Button';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
import { Service } from 'types/services';
import styles from './Settings.module.scss';

interface Props {
  service: Service;
  icon?: IconType;
}

export default function ServiceLine({ service, icon: Icon }: Props): ReactElement {
  const { logout, user, login, authError } = useAuth();
  const [token, setToken] = useState<string>('');

  return (
    <div className={styles.settingsServiceLine}>
      <h4 style={{ textTransform: 'capitalize', marginTop: 'var(--space-8)' }}>
        {Icon && <Icon opacity={0.8} />} {service}
      </h4>
      {user?.[service] ? (
        <Button variant="outlined" onClick={() => logout(service)}>
          Log out
        </Button>
      ) : (
        <form onSubmit={() => login(token, service)}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <input
              onChange={(e) => {
                setToken(e.target.value);
              }}
              className={styles.tokenInput}
              value={token}
              type="password"
            />
            <Button type="submit" onClick={() => login(token, service)}>
              Log in
            </Button>
          </div>
          {authError && <span style={{ color: 'var(--color-red)' }}>{authError}</span>}
        </form>
      )}
    </div>
  );
}
