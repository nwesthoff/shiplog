import { ReactElement, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import styles from './LoginForm.module.css';
import Button from 'components/Button/Button';

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
    <form className={styles.loginForm}>
      <h1 style={{ marginBottom: 'var(--space-8)' }}>Login</h1>
      <div className={styles.inputGroup}>
        <label htmlFor="password">Token</label>
        <input
          className={styles.tokenInput}
          id="password"
          type="password"
          onChange={handleTokenChange}
        />
      </div>
      <div>
        <span>
          <a href="https://vercel.com/account/tokens" target="blank">
            Create
          </a>{' '}
          an authentication token manually and paste above
        </span>
      </div>
      <Button onClick={handleLogin}>Login</Button>
    </form>
  );
}
