export interface Todo {
    _id: string;
    text: string;
    done: boolean;
}

export interface InputProps {
    token: string;
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export interface EditInputProps {
    todo: Todo;
    token: string;
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
}

export interface TodoItemProps {
    todo: Todo;
    token: string;
    setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
}

export interface LoginProps {

    setToken: React.Dispatch<React.SetStateAction<string | null>>
    setUsername: React.Dispatch<React.SetStateAction<string>>
}