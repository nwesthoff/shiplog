import { config } from 'config/constants';
import { useEffect, useState } from 'react';
import { vercelFetcher } from 'services/vercel';

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (token: string) => {
    const res = await vercelFetcher(config.VERCEL_API_BASE + '/www/user', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.error) {
      window.localStorage.setItem('vercelToken', token);
      setToken(token);
      setIsAuthenticated(true);
    } else if (res.error.code === 'forbidden') {
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem('vercelToken');
    setToken(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem('vercelToken');

    if (storedToken) {
      login(storedToken);
    }
  }, []);

  return { login, logout, token, isAuthenticated };
}
