import styles from './Controls.module.css';

function SortBy({
  sortBy,
  sortDirection,
  onSortByChange,
  onSortDirectionChange,
}) {
  return (
    <div className={styles.controlGroup}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="sortBy">
          Sort by
        </label>

        <select
          className={styles.select}
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortByChange(event.target.value)}
        >
          <option value="createdAt">Created At</option>
          <option value="title">Title</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="sortDirection">
          Order
        </label>

        <select
          className={styles.select}
          id="sortDirection"
          value={sortDirection}
          onChange={(event) => onSortDirectionChange(event.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>
  );
}

export default SortBy;