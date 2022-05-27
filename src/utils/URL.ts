export const backendURL =
  process.env.NODE_ENV === "production"
    ? "https://christians-todo-app.herokuapp.com/"
    : "http://localhost:4000/";

export const frontendURL: string =
  process.env.NODE_ENV === "production"
    ? "https://christians-todo-app.netlify.app/"
    : "http://localhost:3000/";