export const MAX_TODO_TITLE_LENGTH = 100;

export function isValidTodoTitle(title) {
    const trimmedTitle = title.trim();

    return (
        trimmedTitle !== '' &&
        trimmedTitle.length <= MAX_TODO_TITLE_LENGTH
    );
}