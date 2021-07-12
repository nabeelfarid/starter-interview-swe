import React from "react";
import logo from "./logo.gif";
import { Note } from "./components/Note";
import "./App.css";
import { Login } from "./components/Login";
import { useAppSelector } from "./app/hooks";
import { LoginStatus, selectAuth } from "./components/Login/authslice";

function App() {
  const auth = useAppSelector(selectAuth);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Login />
      {auth.status === LoginStatus.LOGGED_IN && <Note />}
    </div>
  );
}

export default App;
