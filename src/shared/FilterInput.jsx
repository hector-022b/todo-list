import styles from './Controls.module.css';

function FilterInput({ filterTerm, onFilterChange }) {
  return (
    <div className={styles.control}>
      <label className={styles.label} htmlFor="filterInput">
        Search todos:
      </label>

      <input
        className={styles.input}
        id="filterInput"
        type="text"
        value={filterTerm}
        onChange={(event) => onFilterChange(event.target.value)}
        placeholder="Search by title..."
      />
    </div>
  );
}

export default FilterInput;