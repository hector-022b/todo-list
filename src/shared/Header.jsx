function Header({ email }) {
  return (
    <header>
      <h1>Todo List</h1>
      {email && <p>Welcome, {email}</p>}
    </header>
  );
}

export default Header;