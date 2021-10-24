import { localStore } from 'config/localStorage';
import { useState, useEffect, useContext, createContext } from 'react';
import { netlifyFetcher } from 'services/netlify';
import { vercelFetcher } from 'services/vercel';
import { NetlifyUser } from 'types/netlify';
import { Service } from 'types/services';
import { VercelUser } from 'types/vercel';

const authContext = createContext<{
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, service: Service) => void;
  logout: (service?: Service) => void;
  user: { vercel?: VercelUser; netlify?: NetlifyUser } | null;
}>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
});

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [vercelUser, setVercelUser] = useState<VercelUser>();
  const [netlifyUser, setNetlifyUser] = useState<NetlifyUser>();
  const user = { vercel: vercelUser, netlify: netlifyUser };
  const isAuthenticated = !!user.vercel || !!user.netlify;
  const [loading, setLoading] = useState(true);

  const login = async (token: string, service: Service | Service[]) => {
    if (service === 'vercel') {
      const res = await vercelFetcher('/www/user', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.error) {
        window.localStorage.setItem(localStore.vercelToken, token);
        setVercelUser(res.user);
      } else if (res.error.code === 'forbidden') {
        logout('vercel');
      }
    } else if ('netlify') {
      const res = await netlifyFetcher('/users', {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.error && res[0]) {
        window.localStorage.setItem(localStore.netlifyToken, token);
        setNetlifyUser(res[0]);
      } else if (res.status === 401) {
        logout('netlify');
      }
    } else {
      throw Error(`Service ${service} not found`);
    }
  };

  const logout = (service?: Service) => {
    if (!service) {
      window.localStorage.removeItem(localStore.netlifyToken);
      window.localStorage.removeItem(localStore.vercelToken);
      setVercelUser(undefined);
      setNetlifyUser(undefined);
    } else {
      window.localStorage.removeItem(localStore[`${service}Token`]);
      service === 'vercel' && setVercelUser(undefined);
      service === 'netlify' && setNetlifyUser(undefined);
    }
  };

  async function restoreAuth() {
    setLoading(true);
    const storedVercelToken = window.localStorage.getItem(localStore.vercelToken);
    const storedNetlifyToken = window.localStorage.getItem(localStore.netlifyToken);

    await Promise.all([
      storedVercelToken ? login(storedVercelToken, 'vercel') : new Promise(() => {}),
      storedNetlifyToken ? login(storedNetlifyToken, 'netlify') : new Promise(() => {}),
    ]);

    setLoading(false);
  }

  useEffect(() => {
    restoreAuth();
  }, []);

  return {
    loading,
    login,
    user,
    logout,
    isAuthenticated,
  };
}
