import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';
import Logoff from '../features/Logoff.jsx';
import styles from './Header.module.css';

function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.topRow}>
          <h1 className={styles.title}>Todo List</h1>

          {isAuthenticated && (
            <div className={styles.userArea}>
              <p className={styles.userName}>{email}</p>
              <Logoff />
            </div>
          )}
        </div>

        <Navigation />
      </div>
    </header>
  );
}

export default Header;