import { ReactElement, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import styles from './LoginForm.module.scss';
import Button from 'components/Button/Button';
import Header from 'components/Header/Header';
import Layout from 'components/Layout/Layout';

export default function LoginForm(): ReactElement {
  const { login } = useAuth();
  const [tokenValue, setTokenValue] = useState('');

  async function handleLogin() {
    login(tokenValue);
  }

  function handleTokenChange(e) {
    setTokenValue(e.target.value);
  }

  return (
    <Layout sidebar={false}>
      <Header>
        <h1>Login to Vercel</h1>
      </Header>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: 'var(--space-32)',
        }}
      >
        <div
          style={{
            display: 'flex',
            maxWidth: '320px',
            gap: 'var(--space-16)',
            flexDirection: 'column',
          }}
        >
          <div className={styles.formStep}>
            <div className={styles.formDigit}>1</div>
            <div>
              <h3 className={styles.formStepTitle}>Create a token</h3>
              <p>
                Go to your{' '}
                <a href="https://vercel.com/account/tokens" target="blank">
                  Vercel account
                </a>{' '}
                to create an access token
              </p>
            </div>
          </div>

          <div className={styles.formStep}>
            <div className={styles.formDigit}>2</div>

            <div>
              <h3 className={styles.formStepTitle}>Enter token</h3>
              <form className={styles.loginForm} onSubmit={handleLogin}>
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Paste access token below</label>
                  <div className={styles.formRow}>
                    <input
                      className={styles.tokenInput}
                      id="password"
                      type="password"
                      onChange={handleTokenChange}
                    />
                    <Button type="submit">Login</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
