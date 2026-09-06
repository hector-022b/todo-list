import { useAuth } from '../contexts/AuthContext.jsx';
import Navigation from './Navigation.jsx';
import Logoff from '../features/Logoff.jsx';

function Header() {
  const { email, isAuthenticated } = useAuth();

  return (
    <header>
      <h1>Todo List</h1>

      <Navigation />

      {isAuthenticated && (
        <>
          <p>{email}</p>
          <Logoff />
        </>
      )}
    </header>
  );
}

export default Header;