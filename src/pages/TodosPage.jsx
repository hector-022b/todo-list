import { useEffect, useReducer } from 'react';
import {
  todoReducer,
  initialTodoState,
  TODO_ACTIONS,
} from '../reducers/todoReducer.js';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import TodoForm from '../features/Todos/TodoForm.jsx';
import SortBy from '../shared/SortBy.jsx';
import FilterInput from '../shared/FilterInput.jsx';
import useDebounce from '../utils/useDebounce.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useSearchParams } from 'react-router';
import StatusFilter from '../shared/StatusFilter.jsx';
import styles from './TodosPage.module.css';

function TodosPage() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const statusFilter = searchParams.get('status') || 'all';

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);

  const handleFilterChange = (newTerm) => {
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    let ignore = false;

    async function fetchTodos() {
      dispatch({
        type: TODO_ACTIONS.FETCH_START,
      });

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
          throw new Error('Unauthorized');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }

        const data = await response.json();

        if (!ignore) {
          dispatch({
            type: TODO_ACTIONS.FETCH_SUCCESS,
            payload: {
              todos: data.tasks,
            },
          });
        }
      } catch (error) {
        if (!ignore) {
          const isFilterError =
            debouncedFilterTerm ||
            sortBy !== 'createdAt' ||
            sortDirection !== 'asc';

          const message =
            error.message === 'Unauthorized'
              ? 'You Are Not Authorized. Please Log In Again.'
              : isFilterError
                ? 'There Was A Problem Filtering Or Sorting Your Todos.'
                : 'There Was A Problem Loading Your Todos.'

          dispatch({
            type: TODO_ACTIONS.FETCH_ERROR,
            payload: {
              message,
              isFilterError: Boolean(isFilterError),
            },
          });
        }
      }
    }

    fetchTodos();

    return () => {
      ignore = true;
    };
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  async function addTodo(todoTitle) {
    const newTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: {
        newTodo,
      },
    });

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempId: newTodo.id,
          savedTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempId: newTodo.id,
          message: 'There Was A Problem Adding Your Todo.',
        },
      });
    }
  }

  async function completeTodo(id) {
    const originalTodo = todoList.find((todo) => todo.id === id);

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: {
        id,
      },
    });

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
        throw new Error('Failed To Complete Todo');
      }

      const data = await response.json();
      const savedTodo = data.task ?? data;

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
        payload: {
          id,
          savedTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          id,
          originalTodo,
          message: 'There Was A Problem Completing Your Todo.',
        },
      });
    }
  }

  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(
      (todo) => todo.id === editedTodo.id
    );

    if (!originalTodo) {
      return;
    }

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: {
        editedTodo,
      },
    });

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
        throw new Error('Failed To Update Todo');
      }

      const data = await response.json();
      const savedTodo = data.task ?? data;

      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
        payload: {
          id: editedTodo.id,
          savedTodo,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          id: editedTodo.id,
          originalTodo,
          message: 'There Was A Problem Updating Your Todo.',
        },
      });
    }
  }

  async function deleteTodo(id) {
    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed To Delete Todo');
      }

      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
        payload: {
          id,
        },
      });
    } catch {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          message: 'There Was A Problem Deleting Your Todo.',
        },
      });
    }
  }


  return (
    <div className={styles.page}>
      <h2 className={styles.title}>My Todos</h2>

      {error && (
        <section className={styles.error}>
          <p>{error}</p>

          <button
            className={styles.errorButton}
            type="button"
            onClick={() =>
              dispatch({
                type: TODO_ACTIONS.CLEAR_ERROR,
              })
            }
          >
            Clear Error
          </button>
        </section>
      )}

      {filterError && (
        <div className={styles.error}>
          <p>{filterError}</p>

          <div className={styles.errorActions}>
            <button
              className={styles.errorButton}
              type="button"
              onClick={() =>
                dispatch({
                  type: TODO_ACTIONS.CLEAR_FILTER_ERROR,
                })
              }
            >
              Clear Filter Error
            </button>

            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() =>
                dispatch({
                  type: TODO_ACTIONS.RESET_FILTERS,
                })
              }
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {isTodoListLoading && (
        <p className={styles.loading}>Loading todos...</p>
      )}

      <div className={styles.controls}>
        <SortBy
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSortByChange={(newSortBy) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy: newSortBy,
                sortDirection,
              },
            })
          }
          onSortDirectionChange={(newSortDirection) =>
            dispatch({
              type: TODO_ACTIONS.SET_SORT,
              payload: {
                sortBy,
                sortDirection: newSortDirection,
              },
            })
          }
        />

        <StatusFilter />

        <FilterInput
          filterTerm={filterTerm}
          onFilterChange={handleFilterChange}
        />
      </div>

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;