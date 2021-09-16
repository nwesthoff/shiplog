import { HashRouter as Router } from 'react-router-dom';
import { Routes } from '../Pages/Routes';
import { ProvideAuth } from 'hooks/useAuth';

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Routes />
      </ProvideAuth>
    </Router>
  );
}

export default App;
