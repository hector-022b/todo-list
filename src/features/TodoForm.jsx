import { useRef, useState } from "react";

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
        <form onSubmit={handleAddTodo}>
            <label htmlFor="todoTitle">Todo</label>
            <input
                ref={inputRef}
                type="text"
                id="todoTitle"
                name="todoTitle"
                value={workingTodoTitle}
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                placeholder={'Todo text'}
            />
            <button
                type="submit"
                disabled={!workingTodoTitle.trim()}
            >
                Add Todo
            </button>
        </form>
    );
}

export default TodoForm;