import { useRef, useState } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../utils/todoValidation.js";
import styles from "./TodoForm.module.css";

function TodoForm({ onAddTodo }) {
    const inputRef = useRef();
    const [workingTodoTitle, setWorkingTodoTitle] = useState('');

    const handleAddTodo = (event) => {
        event.preventDefault();

        if (workingTodoTitle.trim()) {
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