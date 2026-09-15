import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle, MAX_TODO_TITLE_LENGTH, } from "../../utils/todoValidation.js";
import styles from "./TodoForm.module.css";

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (isValidTodoTitle(workingTodoTitle)) {
            onAddTodo(workingTodoTitle);

            setWorkingTodoTitle('');
            inputRef.current.focus();
        }
    };

    return (
    <form className={styles.form} onSubmit={handleAddTodo}>
        <TextInputWithLabel
            elementId="todoTitle"
            labelText="Todo"
            ref={inputRef}
            value={workingTodoTitle}
            onChange={(event) => setWorkingTodoTitle(event.target.value)}
            maxLength={MAX_TODO_TITLE_LENGTH}
        />

        <button
            className={styles.button}
            type="submit"
            disabled={!isValidTodoTitle(workingTodoTitle)}
        >
            Add Todo
        </button>
    </form>
);
}

export default TodoForm;