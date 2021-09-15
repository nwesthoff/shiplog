import Deployments from 'Pages/Deployments/DeploymentList';
import { paths } from 'config/paths';
import { useAuth } from 'hooks/useAuth';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Login from './Login';

export const Routes = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user && location.pathname !== paths.login) {
    return <Redirect to={paths.login} />;
  }

  if (user && location.pathname === paths.login) {
    return <Redirect to={paths.home} />;
  }

  return (
    <Switch location={location} key={location.pathname}>
      <Route exact path={paths.login}>
        <Login />
      </Route>

      <Route path={`${paths.team}/:teamId`}>
        <Deployments />
      </Route>

      <Route path={paths.team} exact>
        <Deployments />
      </Route>

      <Route path={paths.home} exact>
        <Deployments />
      </Route>
    </Switch>
  );
};
