import { useAuth } from 'hooks/useAuth';
import { ReactElement, useState } from 'react';

export default function Login(): ReactElement {
  const { login } = useAuth();
  const [tokenValue, setTokenValue] = useState('');

  async function handleLogin() {
    login(tokenValue);
  }

  function handleTokenChange(e) {
    setTokenValue(e.target.value);
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="password">Token</label>
        <input id="password" type="password" onChange={handleTokenChange} />
      </div>
      <div>
        <span>
          <a href="https://vercel.com/account/tokens" target="blank">
            Create Token
          </a>{' '}
          manually and paste above
        </span>
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
