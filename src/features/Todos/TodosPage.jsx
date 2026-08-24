import { useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    async function fetchTodos() {
      setIsTodoListLoading(true);
      setError('');

      try {
        const params = new URLSearchParams({
          limit: 100,
        });

        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            'X-CSRF-TOKEN': token,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          throw new Error('unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();
        setTodoList(data.tasks);
      } catch (error) {
        if (error.message === 'unauthorized') {
          setError('unauthorized');
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    }

    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(todoTitle) {
    setError('');

    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    setTodoList(previous => [newTodo, ...previous]);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: todoTitle,
          isCompleted: false,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const data = await response.json();
      const savedTodo = data.task ?? data;

      setTodoList(previous =>
        previous.map(todo =>
          todo.id === newTodo.id ? savedTodo : todo
        )
      );
    } catch (error) {
      setTodoList(previous =>
        previous.filter(todo => todo.id !== newTodo.id)
      );

      setError(`Error adding todo: ${error.message}`);
    }
  }

  async function completeTodo(id) {
    setError('');

    const originalTodo = todoList.find(todo => todo.id === id);

    if (!originalTodo) {
      return;
    }

    setTodoList(previous =>
      previous.map(todo =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

      const data = await response.json();
      const savedTodo = data.task ?? data;

      if (savedTodo?.id) {
        setTodoList(previous =>
          previous.map(todo =>
            todo.id === id ? savedTodo : todo
          )
        );
      }
    } catch (error) {
      setTodoList(previous =>
        previous.map(todo =>
          todo.id === id ? originalTodo : todo
        )
      );

      setError(`Error completing todo: ${error.message}`);
    }
  }

  async function updateTodo(editedTodo) {
    setError('');

    const originalTodo = todoList.find(
      todo => todo.id === editedTodo.id
    );

    if (!originalTodo) {
      return;
    }

    setTodoList(previous =>
      previous.map(todo =>
        todo.id === editedTodo.id
          ? { ...todo, ...editedTodo }
          : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const data = await response.json();
      const savedTodo = data.task ?? data;

      if (savedTodo?.id) {
        setTodoList(previous =>
          previous.map(todo =>
            todo.id === editedTodo.id ? savedTodo : todo
          )
        );
      }
    } catch (error) {
      setTodoList(previous =>
        previous.map(todo =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );

      setError(`Error updating todo: ${error.message}`);
    }
  }

  return (
    <div>
      {error && (
        <section>
          <p>{error}</p>

          <button
            type="button"
            onClick={() => setError('')}
          >
            Clear Error
          </button>
        </section>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;