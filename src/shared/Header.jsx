import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Header() {
  const { email, isAuthenticated, logout } = useAuth();
  const [logoutError, setLogoutError] = useState('');

  async function handleLogoff() {
    setLogoutError('');

    const result = await logout();

    if (!result.success) {
      setLogoutError(result.error);
    }
  }

  return (
    <header>
      <h1>Todo List</h1>

      {logoutError && <p>{logoutError}</p>}

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