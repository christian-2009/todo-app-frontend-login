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
  grey: boolean;
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

  useEffect(() => {
    const fetchToDo = async () => {
      const response = await axios.get(backendURL + "todo");
      const todos = await response.data;
      setDisplayToDoList(todos);
    };
    fetchToDo();
  }, [toggle]);

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

  console.log("todolist", displayToDoList);
  const handleClickToDo = (id: number) => {
    for (const obj of displayToDoList) {
      if (obj.id === id && obj.grey === true) {
        obj.grey = false;
      } else if (obj.id === id) {
        obj.grey = true;
      }
    }

    setDisplayToDoList([...displayToDoList]);
    console.log("display to do list inside func", displayToDoList);
  };

  return (
    <>
      <h1 className="title">ToDoApp</h1>
      <div className="todo-page">
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
            <button className="todo-form--button">Submit</button>
          </form>
        </div>
        {console.log("hiya")}
        <div>
          <div className="todo-list">
            {displayToDoList.map((obj) => (
              <div className={"todo-list--todo-container"} key={obj.id}>
                {console.log("wheter it will be turned grey", obj.grey)}
                <h3
                  onClick={() => handleClickToDo(obj.id)}
                  className={`todo${obj.grey ? "-grey" : ""} todo-title`}
                >
                  {obj.todo_title}
                </h3>
                <p
                  onClick={() => handleClickToDo(obj.id)}
                  className={`todo${obj.grey ? "-grey" : ""} todo-body`}
                >
                  {obj.todo_body}
                </p>
                <button
                  className="todo-list--button"
                  onClick={() => handleDelete(obj.id)}
                >
                  Done
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
