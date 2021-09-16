import Deployments from 'Pages/Deployments/DeploymentList';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Login from './Login';
import Settings from './Settings/Settings';
import Layout from 'components/Layout/Layout';

export const Routes = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (location.pathname === paths.home) {
    return <Redirect to={paths.team} />;
  }

  if (!user && location.pathname !== paths.login) {
    return <Redirect to={paths.login} />;
  }

  if (user && location.pathname === paths.login) {
    return <Redirect to={paths.home} />;
  }

  return (
    <Switch location={location} key={location.pathname}>
      <Route path={paths.settings} exact>
        <Layout>
          <Settings />
        </Layout>
      </Route>

      <Route exact path={paths.login}>
        <Layout>
          <Login />
        </Layout>
      </Route>

      <Route path={`${paths.team}/:teamId/:projectId`}>
        <Layout>
          <Deployments />
        </Layout>
      </Route>

      <Route path={`${paths.team}/:teamId`}>
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
