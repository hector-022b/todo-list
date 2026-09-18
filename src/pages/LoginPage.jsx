import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext.jsx';
import styles from './Page.module.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');
    setAuthError('');

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email Is Required.');
      hasError = true;
    } else if (!email.includes('@')) {
      setEmailError('Please Enter A Valid Email Address.');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Password Is Required.');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoggingOn(true);

    const result = await login(email, password);

    if (!result.success) {
      setAuthError(result.error);
    }

    setIsLoggingOn(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          {authError && (
            <p className={styles.error}>{authError}</p>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>

            <input
              className={styles.input}
              id="email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setEmailError('');
              }}
              maxLength={254}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'emailError' : undefined}
              required
            />

            {emailError && (
              <p
                id="emailError"
                className={styles.fieldError}
              >
                {emailError}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>

            <input
              className={styles.input}
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setPasswordError('');
              }}
              maxLength={128}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'passwordError' : undefined}
              required
            />

            {passwordError && (
              <p
                id="passwordError"
                className={styles.fieldError}
              >
                {passwordError}
              </p>
            )}
          </div>

          <button
            className={styles.button}
            type="submit"
            disabled={isLoggingOn}
          >
            {isLoggingOn ? 'Logging in...' : 'Log On'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;