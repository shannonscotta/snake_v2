import React, { useState, useEffect, useRef } from "react";

const Canvas = () => {
  const gridSize = 25;
  const [snakeBody, setSnakeBody] = useState([
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]);

  const [dx, setDx] = useState(1);
  const [dy, setDy] = useState(0);

  const canvasRef = useRef(null);
  const [frameDelay, setFrameDelay] = useState(100);
  const [lastFrameTime, setLastFrameTime] = useState(0);

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  let snakeCanvas;
  let ctx;
  useEffect(() => {
    snakeCanvas = canvasRef.current;
    ctx = snakeCanvas.getContext("2d");
  }, []);

  function drawSnake() {
    ctx.fillStyle = "green";
    for (let segment of snakeBody) {
      ctx.fillRect(
        segment.x * gridSize,
        segment.y * gridSize,
        gridSize,
        gridSize
      );
    }
  }

  function clearScreen() {
    ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
  }

  function update() {
    console.log("hit");
    if (isGameOver) return;

    const currentTime = Date.now();
    const elapsed = currentTime - lastFrameTime;

    if (elapsed < frameDelay) {
      requestAnimationFrame(update);
      return;
    }

    setLastFrameTime(currentTime);

    const newHead = { x: snakeBody[0].x + dx, y: snakeBody[0].y + dy };
    setSnakeBody([newHead, ...snakeBody]);

    // Check for collision with food ------------------------------------------------------------
    if (newHead.x === food.x && newHead.y === food.y) {
      spawnFood();
      setFrameDelay(frameDelay - 20);
    } else {
      setSnakeBody(snakeBody.slice(0, -1));
    }

    // Check for collision with walls or body-------------------------------------------------
    if (
      newHead.x < 0 ||
      newHead.x >= snakeCanvas.width / gridSize ||
      newHead.y < 0 ||
      newHead.y >= snakeCanvas.height / gridSize ||
      isSnakeCollidingWithItself(newHead)
    ) {
      setIsGameOver(true);
    }
  }

  //create food location
  function spawnFood() {
    setFood({
      x: Math.floor(Math.random() * (snakeCanvas.width / gridSize)),
      y: Math.floor(Math.random() * (snakeCanvas.height / gridSize)),
    });
  }

  //^^ drawing the food in based on location
  function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
  }

  function isSnakeCollidingWithItself(head) {
    for (let i = 1; i < snakeBody.length; i++) {
      if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    // game loop running everything
    function loop() {
      clearScreen();
      drawSnake();
      drawFood();
      update();

      if (!isGameOver) {
        requestAnimationFrame(loop);
      } else {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText(
          "Game Over",
          snakeCanvas.width / 2 - 80,
          snakeCanvas.height / 2
        );
      }
    }

    loop();
  }, []);

  useEffect(() => {
    // movement events ------------------------------------------
    function handleKeyDown(event) {
      if (isGameOver) return;

      switch (event.key) {
        case "ArrowUp":
          console.log("got here");
          if (dy !== 1) {
            setDx(0);
            setDy(-1);
          }
          break;
        case "ArrowDown":
          if (dy !== -1) {
            setDx(0);
            setDy(1);
          }
          break;
        case "ArrowLeft":
          if (dx !== 1) {
            setDx(-1);
            setDy(0);
          }
          break;
        case "ArrowRight":
          if (dx !== -1) {
            setDx(1);
            setDy(0);
          }
          break;
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="canvas"
        height="450"
        width="900"
        style={{ background: "black" }}
      ></canvas>
    </div>
  );
};

export default Canvas;
