# Todo List

A responsive Todo List application built with React and Vite as part of the Code the Dream React curriculum.

The application allows authenticated users to create, edit, complete, search, filter, and sort todos. It also includes protected routes, profile statistics, responsive styling, client-side validation, and user-friendly error handling.

## Live Demo

[View the Live Demo](VERCEL-URL-HERE)

## Features

- User authentication and logout
- Protected routes for authenticated users
- Create new todos
- Edit existing todos
- Mark todos as completed
- View all, active, or completed todos
- Search todos by title
- Sort todos by creation date or title
- Sort todos in ascending or descending order
- View todo statistics on the Profile page
- Responsive design for desktop, tablet, and mobile
- Loading, error, and empty states
- Client-side form validation
- Maximum-length validation for text inputs
- Keyboard focus states and accessible form labels
- Custom 404 page

## Technologies Used

- React
- React Router
- Vite
- JavaScript
- HTML
- CSS
- CSS Modules
- REST API
- Git
- GitHub

## Screenshots

### Desktop

Add desktop screenshot here.

### Mobile

Add mobile screenshot here.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/hector-022b/todo-list.git
```

2. Navigate to the project folder:

```bash
cd todo-list
```

3. Install the project dependencies:

```bash
npm install
```

## Running the Development Server

Start the Vite development server with:

```bash
npm run dev
```

Then open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Build

```bash
npm run build
```

Creates a production build of the application.

### Preview

```bash
npm run preview
```

Runs the production build locally for testing.

### Lint

```bash
npm run lint
```

Checks the project for linting and code-quality issues.

## Design Decisions

### CSS Modules

CSS Modules are used to keep component styles organized and prevent styles from affecting unrelated components.

The application uses a navy and sky-blue color palette with consistent styling for navigation, buttons, forms, cards, error messages, loading states, and todo items.

### Component Organization

The project separates pages, shared components, feature-specific components, hooks, utilities, reducers, and authentication context into their own directories.

### State Management

Todo state is managed with React's `useReducer` hook. This keeps the application's different todo actions and state updates organized.

### Routing

React Router is used to navigate between pages. Protected routes prevent unauthenticated users from accessing the Todo and Profile pages.

### Validation and Security

User input is validated before submission.

Todo titles cannot be empty and have a maximum length. Other text inputs also use maximum-length limits where appropriate.

User-facing error messages are kept general so unnecessary API or system details are not exposed.

Authenticated API requests use the provided CSRF token.

## Project Structure

```text
src/
├── components/
├── contexts/
├── features/
│   └── Todos/
├── hooks/
├── pages/
├── reducers/
├── shared/
└── utils/
```

## Future Improvements

- Add the ability to delete todos
- Improve todo statistics
- Add due dates
- Add priority levels
- Add categories or tags
- Continue improving accessibility

## License

This project was created for educational purposes as part of the Code the Dream React curriculum and is not currently licensed for reuse.

## Author

**Hector Barahona**

GitHub: [hector-022b](https://github.com/hector-022b)
