import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendURL } from "../utils/URL";

interface ToDoInterface {
  todoTitle: string;
  todoBody: string;
}

interface DisplayToDoListInterface {
  todo_title: string;
  todo_body: string;
  id: number;
}

export default function MainContent(): JSX.Element {
  const [todoForm, setTodoForm] = useState<ToDoInterface>({
    todoTitle: "",
    todoBody: "",
  });
  const [displayToDoList, setDisplayToDoList] = useState<
    DisplayToDoListInterface[]
  >([]);
  const [toggle, setToggle] = useState<boolean>(true);

  function handleFormChange(
    event:
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;
    setTodoForm((previous) => {
      return { ...previous, [name]: value };
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (todoForm.todoBody === "") {
      window.alert("Cannot have an empty todo");
      return;
    }
    await axios.post(backendURL + "todo", todoForm);

    setTodoForm({
      todoTitle: "",
      todoBody: "",
    });
    setToggle(!toggle);
  };

  const handleDelete = async (id: number) => {
    const response = await axios.delete(backendURL + "todo/" + id);
    console.log(response);
    setToggle(!toggle);
  };

  useEffect(() => {
    const fetchToDo = async () => {
      const response = await axios.get(backendURL + "todo");
      const todos = await response.data;
      setDisplayToDoList(todos);
    };
    fetchToDo();
  }, [toggle]);

  return (
    <>
      <h1>ToDoApp</h1>
      <div className="todo-form">
        <form onSubmit={handleSubmit}>
          <input
            onChange={(event) => handleFormChange(event)}
            type="text"
            className="todo-form--input"
            placeholder="title of todo..."
            name="todoTitle"
            value={todoForm.todoTitle}
            id="todo-form-todoTitle"
          />
          <textarea
            onChange={(event) => handleFormChange(event)}
            className="todo-form--text-area"
            placeholder="type todo here..."
            name="todoBody"
            value={todoForm.todoBody}
            id="todo-form-todoBody"
          />
          <br />
          <button>Submit</button>
        </form>
      </div>

      <div>
        <div>
          {displayToDoList.map((obj) => (
            <div key={obj.id}>
              <h3>{obj.todo_title}</h3>
              <p>{obj.todo_body}</p>
              <button onClick={() => handleDelete(obj.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
