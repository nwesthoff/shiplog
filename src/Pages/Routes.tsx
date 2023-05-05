import Deployments from './Deployments';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';
import Settings from '../components/Settings/Settings';
import Layout from 'components/Layout/Layout';
import Home from './Home';
import { ReactElement, useEffect } from 'react';

export const RoutesPage = (): ReactElement => {
  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.vercel && !user?.netlify && pathname !== paths.login) {
      navigate(paths.login);
    }

    if ((user?.vercel || user?.netlify) && pathname === paths.login) {
      navigate(paths.home);
    }
  }, [user]);

  return (
    <Routes location={location} key={pathname}>
      <Route path={paths.home} element={<Home />} />
      <Route
        path={paths.settings}
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />

      <Route path={paths.login} element={<Login />} />

      <Route
        path={`${paths.team}/:service/:teamId/:projectId`}
        element={
          <Layout>
            <Deployments />
          </Layout>
        }
      />

      <Route
        path={`${paths.team}/:service/:teamId`}
        element={
          <Layout>
            <Deployments />
          </Layout>
        }
      />

      <Route
        path={`${paths.team}/:service`}
        element={
          <Layout>
            <Deployments />
          </Layout>
        }
      />
    </Routes>
  );
};
