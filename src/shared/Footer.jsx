import styles from './Footer.module.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © {currentYear} Hector Barahona · Code the Dream React Project ·{' '}
        <a
          className={styles.link}
          href="https://github.com/hector-022b/todo-list"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;