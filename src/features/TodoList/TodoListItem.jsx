import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

function TodoListItem({ todo, onCompleteTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    return (
    <li>
        <form>
            {isEditing ? (
                <TextInputWithLabel
                    elementId={`editTodo${todo.id}`}
                    labelText="Edit Todo"
                    value={workingTitle}
                    onChange={(event) => setWorkingTitle(event.target.value)}
                />
            ) : (
                <>
                    <label>
                        <input
                            type="checkbox"
                            id={`checkbox${todo.id}`}
                            checked={todo.isCompleted}
                            onChange={() => onCompleteTodo(todo.id)}
                        />
                    </label>

                    <span onClick={() => setIsEditing(true)}>
                        {todo.title}
                    </span>
                </>
            )}
        </form>
        </li>
    );
}

export default TodoListItem;