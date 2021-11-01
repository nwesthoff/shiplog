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
  authError: string | null;
}>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  loading: true,
  authError: null,
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
  const [authError, setAuthError] = useState<string | null>(null);
  const user = { vercel: vercelUser, netlify: netlifyUser };
  const isAuthenticated = !!user.vercel || !!user.netlify;
  const [loading, setLoading] = useState(true);

  const login = async (token: string, service: Service) => {
    setAuthError(null);

    try {
      if (service === 'vercel') {
        const res = await vercelFetcher('/www/user', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        window.localStorage.setItem(localStore.vercelToken, token);
        setVercelUser(res.user);
      } else if ('netlify') {
        const res = await netlifyFetcher('/users', {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        if (res[0]) {
          window.localStorage.setItem(localStore.netlifyToken, token);
          setNetlifyUser(res[0]);
        }
      } else {
        logout(service);
        throw Error(`Service ${service} not found`);
      }
    } catch (e) {
      console.log(e);
      setAuthError((e as Error).message);
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
    const promises: Promise<void>[] = [];
    const storedVercelToken = window.localStorage.getItem(localStore.vercelToken);
    const storedNetlifyToken = window.localStorage.getItem(localStore.netlifyToken);

    storedVercelToken && promises.push(login(storedVercelToken, 'vercel'));
    storedNetlifyToken && promises.push(login(storedNetlifyToken, 'netlify'));
    await Promise.all(promises);

    setLoading(false);
  }

  useEffect(() => {
    restoreAuth();
  }, []);

  return {
    authError,
    loading,
    login,
    user,
    logout,
    isAuthenticated,
  };
}
