import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const [error, setError] = useState('');

  async function handleLogoff() {
    setIsLoggingOff(true);
    setError('');

    const result = await logout();

    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
      setIsLoggingOff(false);
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}

      <button
        type="button"
        onClick={handleLogoff}
        disabled={isLoggingOff}
      >
        {isLoggingOff ? 'Logging out...' : 'Log Out'}
      </button>
    </div>
  );
}

export default Logoff;