import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";


function Input(props) {
  const [todo, setTodo] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:5000/todos', {
            method: 'POST',
            headers: {
              // Кажемо бекенду, що відправляємо JSON 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${props.token}`
            },
            // Передаємо наш текст
            body: JSON.stringify({ text: todo })
          });
          // Отримуємо збережену задачу з бази (вона вже має _id)
          const newTodo = await response.json();
          // Додаємо цю нову задачу в наш список на екрані
          props.setTodos((prevTodos) => [...prevTodos, newTodo]);
          setTodo(""); // Очищаємо поле вводу
        } catch (error) {
          console.error("Помилка створення:", error);
        }
      }}>
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button className="btn-add" type="submit">
        Add
      </button>
    </form>
  );
}

function EditInput(props) {
  const [todo, setTodo] = useState(props.todo.text);
  function handleCancle() {
    props.setIsEdit(false);
  }
  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            const response = await fetch(`http://localhost:5000/todos/${props.todo._id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${props.token}`
              },
              body: JSON.stringify({ text: todo })
            });
            const updatedTodo = await response.json();
            props.setTodos((prevTodos) =>
              prevTodos.map((item) => {
                if (item._id === props.todo._id) {
                  return { ...item, text: todo };
                }
                return item;
              }),
            );
            setTodo("");
            props.setIsEdit(false);
          } catch (error) {
            console.error(" Error update todo: ", error);
          }
        }}
      >
        <input
          type="text"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button className="btn-save" type="submit"> Save </button>
      </form>
      <button className="btn-cansel" onClick={handleCancle}> Cancel </button>
    </>
  );
}

function TodoItem(props) {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div
      className={["sub-todo-item", props.todo.done && "done"]
        .filter(Boolean)
        .join(" ")}
    >
      {isEdit ? (
        <EditInput
          className="editing-input"
          setTodos={props.setTodos}
          todo={props.todo}
          setIsEdit={setIsEdit}
          token={props.token}
        />
      ) : (
        props.todo.text
      )}{" "}
      <button className="btn-edit" onClick={() => setIsEdit(true)}>
        Edit
      </button>
    </div>
  );
}

export default function TodoApp() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    if (!token) return;
    // Робимо GET-запит на наш бекенд (переконайся, що бекенд запущений на порту 5000)
    fetch('http://localhost:5000/todos', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.json())
      .then(data => {
        // Зберігаємо отримані з бази задачі в наш стан
        if (Array.isArray(data)) {
          setTodos(data);
        }
      })
      .catch(error => console.error("Помилка завантаження:", error));
  }, [token]);
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
  }
  const done = todos.filter((todo) => todo.done).length;
  if (!token) return <Login setToken={setToken} />;

  return (
    <div className="todo-app-project">
      <div className="todo-card">
        <button className="btn-logout" onClick={handleLogout}> Logout </button>
        <Input setTodos={setTodos} token={token} />
        <p>
          Done{done}/{todos.length}
        </p>
        <ul>
          {todos.map((todo) => (
            <li key={todo._id} className="todo-item">
              <input
                type="checkbox"
                value={todo.done}
                onChange={async (e) => {
                  try {
                    // Зберігаємо новий статус (true або false)
                    const newStatus = !todo.done;
                    // Відправляємо PUT-запит на бекенд
                    await fetch(`http://localhost:5000/todos/${todo._id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      // Передаємо тільки нове значення done
                      body: JSON.stringify({ done: newStatus })
                    });
                    // Якщо все пройшло успішно на сервері, оновлюємо екран
                    setTodos((prevTodos) =>
                      prevTodos.map((item) => {
                        if (item._id === todo._id) {
                          return { ...item, done: newStatus };
                        }
                        return item;
                      }),
                    );
                  } catch (error) {
                    console.error("Помилка оновлення статусу:", error);
                  }
                }}
              />
              <TodoItem todo={todo} setTodos={setTodos} token={token} />
              <button
                className="btn-delete"
                onClick={async () => {
                  try {
                    // Спочатку відправляємо запит на видалення до бази даних
                    await fetch(`http://localhost:5000/todos/${todo._id}`, {
                      method: 'DELETE',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                    });
                    // Якщо бекенд успішно видалив, тоді видаляємо задачу з екрану (з нашого стейту)
                    setTodos((prevTodos) =>
                      prevTodos.filter((item) => item._id !== todo._id),
                    );
                  } catch (error) {
                    console.error("Помилка видалення:", error);
                  }
                }}

              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
