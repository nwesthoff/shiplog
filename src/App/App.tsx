import { HashRouter as Router } from 'react-router-dom';
import { Routes } from '../Pages/Routes';
import { ProvideAuth } from 'hooks/useAuth';
import Layout from 'components/Layout/Layout';

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Layout>
          <Routes />
        </Layout>
      </ProvideAuth>
    </Router>
  );
}

export default App;
