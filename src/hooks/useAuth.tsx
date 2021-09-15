import { localStore } from 'config/localStorage';
import { useState, useEffect, useContext, createContext } from 'react';
import { vercelFetcher } from 'services/vercel';
import { VercelUser } from 'types/vercel';

const authContext = createContext<{
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: VoidFunction;
  user: VercelUser | null;
}>({ user: null, login: () => {}, logout: () => {}, isAuthenticated: false });

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  const login = async (token: string) => {
    const res = await vercelFetcher('/www/user', {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.error) {
      window.localStorage.setItem(localStore.vercelToken, token);
      setUser(res.user);
    } else if (res.error.code === 'forbidden') {
      setUser(null);
    }
  };

  const logout = () => {
    window.localStorage.removeItem(localStore.vercelToken);
    setUser(null);
  };

  useEffect(() => {
    const storedToken = window.localStorage.getItem(localStore.vercelToken);

    if (storedToken) {
      login(storedToken);
    }
  }, []);

  return {
    login,
    user,
    logout,
    isAuthenticated,
  };
}
