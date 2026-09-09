import styles from './Page.module.css';

function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>About</h2>

        <section className={styles.section}>
          <h3>App Features</h3>
          <p>
            This todo app allows users to manage todos, filter tasks, and navigate
            between different pages.
          </p>
        </section>

        <section className={styles.section}>
          <h3>Technologies Used</h3>
          <ul>
            <li>React</li>
            <li>React Router</li>
            <li>Vite</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;