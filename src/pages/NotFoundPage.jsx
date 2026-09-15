import { Link } from 'react-router';
import styles from './Page.module.css';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>404: Page Not Found</h2>

        <p>The page you are looking for does not exist.</p>

        <nav className={styles.links}>
          <Link className={styles.link} to="/">
            Home
          </Link>

          <Link className={styles.link} to="/about">
            About
          </Link>

          <Link className={styles.link} to="/todos">
            Todos
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default NotFoundPage;