import { HashRouter as Router } from 'react-router-dom';
import styles from './App.module.css';
import { Routes } from '../Pages/Routes';
import { ProvideAuth } from 'hooks/useAuth';
import Layout from 'components/Layout/Layout';

function App() {
  return (
    <Router>
      <ProvideAuth>
        <Layout>
          <main className={styles.App}>
            <Routes />
          </main>
        </Layout>
      </ProvideAuth>
    </Router>
  );
}

export default App;
