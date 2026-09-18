import { useMemo } from 'react';
import TodoListItem from './TodoListItem.jsx';
import styles from './TodoList.module.css';

function TodoList({
  todoList,
  onCompleteTodo,
  onUpdateTodo,
  onDeleteTodo,
  dataVersion,
  statusFilter = 'active',
}) {
  const filteredTodoList = useMemo(() => {

    let filteredTodos;

    switch (statusFilter) {
      case 'completed':
        filteredTodos = todoList.filter((todo) => todo.isCompleted);
        break;

      case 'active':
        filteredTodos = todoList.filter((todo) => !todo.isCompleted);
        break;

      case 'all':
      default:
        filteredTodos = todoList;
        break;
    }

    return {
      version: dataVersion,
      todos: filteredTodos,
    };
  }, [todoList, dataVersion, statusFilter]);

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'completed':
        return 'No Completed Todos Yet. Complete Some Tasks To See Them Here.';

      case 'active':
        return 'No Active Todos. Add A Todo Above To Get Started.';

      case 'all':
      default:
        return 'Add Todo Above To Get Started.';
    }
  };

  return filteredTodoList.todos.length === 0 ? (
    <p className={styles.empty}>{getEmptyMessage()}</p>
  ) : (
    <ul className={styles.list}>
      {filteredTodoList.todos.map((todo) => (
        <TodoListItem
          key={todo.id}
          todo={todo}
          onCompleteTodo={onCompleteTodo}
          onUpdateTodo={onUpdateTodo}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
    </ul>
  );
}

export default TodoList;