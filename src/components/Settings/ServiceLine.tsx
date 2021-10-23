import Button from 'components/Button/Button';
import { useAuth } from 'hooks/useAuth';
import { ReactElement } from 'react';
import { useState } from 'react';
import { Service } from 'types/services';
import styles from './Settings.module.scss';

interface Props {
  service: Service;
}

export default function ServiceLine({ service }: Props): ReactElement {
  const { logout, user, login } = useAuth();
  const [token, setToken] = useState<string>('');

  return (
    <>
      <h4 style={{ textTransform: 'capitalize' }}>Service: {service}</h4>
      {user?.[service] ? (
        <Button onClick={() => logout(service)}>Log out</Button>
      ) : (
        <form
          style={{ display: 'flex', gap: 'var(--space-4)' }}
          onSubmit={() => login(token, service)}
        >
          <input
            onChange={(e) => {
              setToken(e.target.value);
            }}
            className={styles.tokenInput}
            value={token}
            type="password"
          />
          <Button type="submit">Log in</Button>
        </form>
      )}
    </>
  );
}
