import TextInputWithLabel from '../../../shared/TextInputWithLabel';
import { useEditableTitle } from '../../../hooks/useEditableTitle';
import { isValidTodoTitle } from '../../../utils/todoValidation';
import styles from './TodoListItem.module.css';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit,
    } = useEditableTitle(todo.title);

    const handleUpdate = (event) => {
        if (!isEditing) return;

        event.preventDefault();

        const finalTitle = finishEdit();

        onUpdateTodo({
            ...todo,
            title: finalTitle,
        });
    };

    const handleEdit = (event) => {
        updateTitle(event.target.value);
    };

    return (
        <li className={styles.item}>
            <form
                className={`${styles.form} ${isEditing ? styles.editing : ''}`}
                onSubmit={handleUpdate}
            >
                {isEditing ? (
                    <>
                        <TextInputWithLabel
                            elementId={`editTodo${todo.id}`}
                            labelText="Todo"
                            value={workingTitle}
                            onChange={handleEdit}
                        />

                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            type="button"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>

                        <button
                            className={`${styles.button} ${styles.updateButton}`}
                            type="button"
                            onClick={handleUpdate}
                            disabled={!isValidTodoTitle(workingTitle)}
                        >
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                className={styles.checkbox}
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>

                        <span
                            className={`${styles.title} ${
                                todo.isCompleted ? styles.completed : ''
                            }`}
                            onClick={startEditing}
                        >
                            {todo.title}
                        </span>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;