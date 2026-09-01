import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { email, isAuthenticated, logout } = useAuth();

  async function handleLogoff() {
    await logout();
  }

  return (
    <header>
      <h1>Todo List</h1>

      {isAuthenticated && (
        <>
          <p>{email}</p>
          <button type="button" onClick={handleLogoff}>
            Log Out
          </button>
        </>
      )}
    </header>
  );
}

export default Header;