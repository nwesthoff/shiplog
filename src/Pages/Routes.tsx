import Deployments from './Deployments';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Redirect, Route, Switch, useLocation, useParams } from 'react-router-dom';
import Login from './Login';
import Settings from '../components/Settings/Settings';
import Layout from 'components/Layout/Layout';
import { localStore } from 'config/localStorage';
import { Service } from 'types/services';
import Home from './Home';

export const Routes = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { pathname, search } = location;
  console.log(pathname + search);

  if (!user?.vercel && !user?.netlify && pathname !== paths.login) {
    return <Redirect to={paths.login} />;
  }

  if ((user?.vercel || user?.netlify) && pathname === paths.login) {
    return <Redirect to={paths.home} />;
  }

  return (
    <Switch location={location} key={pathname}>
      <Route path={paths.home} exact>
        <Home />
      </Route>
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

      <Route path={`${paths.team}/:service`} exact>
        <Layout>
          <Deployments />
        </Layout>
      </Route>
    </Switch>
  );
};
