import { HashRouter as Router } from 'react-router-dom';
import styles from './App.module.css';
import { Routes } from '../Pages/Routes';
import { useAuth } from 'hooks/useAuth';

function App() {
  const { logout, isAuthenticated } = useAuth();
  return (
    <Router>
      <main className={styles.App}>
        {isAuthenticated && <button onClick={logout}>Log out</button>}
        <Routes />
      </main>
    </Router>
  );
}

export default App;
