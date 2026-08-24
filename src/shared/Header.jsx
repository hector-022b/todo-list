function Header({ email, token, onSetToken, onSetEmail }) {
  function handleLogoff() {
    onSetToken('');
    onSetEmail('');
  }

  return (
    <header>
      <h1>Todo List</h1>

      {token && (
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