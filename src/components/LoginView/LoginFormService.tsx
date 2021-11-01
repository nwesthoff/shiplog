import { ReactElement, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import styles from './LoginView.module.scss';
import Button from 'components/Button/Button';
import { Service } from 'types/services';
import { IconType } from 'react-icons/lib';

interface Props {
  open: boolean;
  tokenUrl: string;
  service: Service;
  icon: IconType;
  setOpen: VoidFunction;
  brandColor?: string;
}

export default function LoginFormService({
  open,
  service,
  tokenUrl,
  icon: Icon,
  setOpen,
  brandColor,
}: Props): ReactElement {
  const { login, authError } = useAuth();
  const [tokenValue, setTokenValue] = useState('');

  async function handleLogin() {
    login(tokenValue, service);
  }

  return (
    <div style={{ width: '100%' }}>
      <button className={styles.loginServiceTitle} onClick={setOpen}>
        <div className={styles.loginServiceIcon}>
          <Icon color={brandColor} />
        </div>
        <h3>
          Login to <span style={{ textTransform: 'capitalize' }}>{service}</span>
        </h3>
      </button>
      {open && (
        <div>
          <div className={styles.formStep}>
            <div>
              <h4 className={styles.formStepTitle}>Create a token</h4>
              <p>
                Go to your{' '}
                <a href={tokenUrl} target="blank">
                  <span style={{ textTransform: 'capitalize' }}>{service}</span> account
                </a>{' '}
                to create an access token
              </p>
            </div>
          </div>

          <div className={styles.formStep}>
            <div>
              <h4 className={styles.formStepTitle}>Enter token</h4>
              <form className={styles.loginForm} onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Paste access token below</label>
                  <div className={styles.formRow}>
                    <input
                      className={styles.tokenInput}
                      id="password"
                      type="password"
                      onChange={(e) => setTokenValue(e.target.value)}
                    />
                    <Button type="submit" onClick={handleLogin}>
                      Login
                    </Button>
                  </div>
                  {authError && (
                    <span style={{ color: 'var(--color-red)' }}>{authError}</span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
