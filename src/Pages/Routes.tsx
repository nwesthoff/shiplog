import Deployments from './Deployments';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom';
import Login from './Login';
import Settings from '../components/Settings/Settings';
import Layout from 'components/Layout/Layout';
import { localStore } from 'config/localStorage';

export const Routes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { pathname } = location;

  if (pathname === paths.home) {
    const lastTeamId = localStorage.getItem(localStore.lastOpenTeamId);

    if (lastTeamId) {
      return <Redirect to={`${paths.team}/${lastTeamId}`} />;
    }

    return <Redirect to={paths.team} />;
  }

  if ((!user?.vercel || !user.netlify) && pathname !== paths.login) {
    return <Redirect to={paths.login} />;
  }

  if ((user?.vercel || user?.netlify) && pathname === paths.login) {
    return <Redirect to={paths.home} />;
  }

  return (
    <Switch location={location} key={pathname}>
      <Route path={paths.settings} exact>
        <Layout>
          <Settings />
        </Layout>
      </Route>

      <Route exact path={paths.login}>
        <Login />
      </Route>

      <Route path={`${paths.team}/:service/:teamId/:projectId`}>
        <Layout>
          <Deployments />
        </Layout>
      </Route>

      <Route path={`${paths.team}/:service/:teamId`}>
        <Layout>
          <Deployments />
        </Layout>
      </Route>

      <Route path={paths.team} exact>
        <Layout>
          <Deployments />
        </Layout>
      </Route>
    </Switch>
  );
};
