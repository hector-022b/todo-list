import { useCallback, useEffect, useState } from 'react';
import TodoList from './TodoList/TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import SortBy from '../../shared/SortBy.jsx';
import FilterInput from '../../shared/FilterInput.jsx';
import useDebounce from '../../utils/useDebounce.js';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);

  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };

  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  useEffect(() => {
  if (!token) {
    return;
  }

  let ignore = false;

  async function fetchTodos() {
    setIsTodoListLoading(true);
    setError('');

    try {
      const paramsObject = {
        sortBy,
        sortDirection,
        limit: 100,
      };
      
      if (debouncedFilterTerm) {
        paramsObject.find = debouncedFilterTerm;
      }
      
      const params = new URLSearchParams(paramsObject);

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

      if (!ignore) {
        setTodoList(data.tasks);
        setFilterError('');
      }
    } catch (error) {
      if (!ignore) {
        if (
          debouncedFilterTerm ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'desc'
        ) {
          setFilterError(
            `Error filtering/sorting todos: ${error.message}`
          );
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      }
} finally {
      if (!ignore) {
        setIsTodoListLoading(false);
      }
    }
  }

  fetchTodos();

  return () => {
    ignore = true;
  };
}, [token, sortBy, sortDirection, debouncedFilterTerm]);

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
      invalidateCache();
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
      invalidateCache();
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
      invalidateCache();
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
          <p>
            {error === 'unauthorized' ? 'You are not authorized. Please log in again.'
              : error}
          </p>
          
          <button
            type="button"
            onClick={() => setError('')}
          >
            Clear Error
          </button>
        </section>
      )}

      {filterError && (
        <div>
          <p>{filterError}</p>
          
          <button
            type="button"
            onClick={() => setFilterError('')}
          >
            Clear Filter Error
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFilterTerm('');
              setSortBy('createdAt');
              setSortDirection('desc');
              setFilterError('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}

      {isTodoListLoading && <p>Loading todos...</p>}
      
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage; 