import { useAuth } from 'hooks/useAuth';
import { Route, Switch, useLocation } from 'react-router-dom';
import Login from './Login';
import TeamList from './TeamList';
import UserDetails from './UserDetails';

export const Routes = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Switch location={location} key={location.pathname}>
      {isAuthenticated && (
        <Route exact path="/">
          <UserDetails />
          <TeamList />
        </Route>
      )}

      <Route>
        <Login />
      </Route>
    </Switch>
  );
};
