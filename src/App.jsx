import { Component, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import React from "react";
import Canvas from "./components/Canvas";
import game from "./game";
function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Canvas />
    </>
  );
}

export default App;
