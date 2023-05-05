import { HashRouter as Router } from 'react-router-dom';
import { RoutesPage } from '../Pages/Routes';
import { ProvideAuth } from 'hooks/useAuth';

function App() {
  return (
    <Router>
      <ProvideAuth>
        <RoutesPage />
      </ProvideAuth>
    </Router>
  );
}

export default App;
