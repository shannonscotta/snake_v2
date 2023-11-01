function game(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    canvas.style.backgroundColor = "black";

    const gridSize: number = 25; // Size of each grid cell
    const snakeBody: { x: number; y: number }[] = [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
    ];

    let dx: number = 1; // Initial direction (right)
    let dy: number = 0;

    let frameDelay: number = 100;
    let lastFrameTime: number = 0;

    let food: { x: number; y: number } = {
        x: 5,
        y: 5,
    };

    let isGameOver: boolean = false;

    function drawSnake(): void {
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

    function clearScreen(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update(): void {
        if (isGameOver) return;

        const currentTime: number = Date.now();
        const elapsed: number = currentTime - lastFrameTime;

        if (elapsed < frameDelay) {
            requestAnimationFrame(update);
            return;
        }

        lastFrameTime = currentTime;

        const newHead: { x: number; y: number } = {
            x: snakeBody[0].x + dx,
            y: snakeBody[0].y + dy,
        };
        snakeBody.unshift(newHead);

        // Check for collision with food ------------------------------------------------------------
        if (newHead.x === food.x && newHead.y === food.y) {
            spawnFood();

            frameDelay -= 5;
        } else {
            snakeBody.pop();
        }

        // Check for collision with walls or body-------------------------------------------------
        if (
            newHead.x < 0 ||
            newHead.x >= canvas.width / gridSize ||
            newHead.y < 0 ||
            newHead.y >= canvas.height / gridSize ||
            isSnakeCollidingWithItself(newHead)
        ) {
            isGameOver = true;
        }
    }
    //create food location
    function spawnFood(): void {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }
    //^^ drawing the food in based on location
    function drawFood(): void {
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function isSnakeCollidingWithItself(head: {
        x: number;
        y: number;
    }): boolean {
        for (let i = 1; i < snakeBody.length; i++) {
            if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
                return true;
            }
        }
        return false;
    }
    //game loop running everything
    function loop(): void {
        clearScreen();
        drawSnake();
        drawFood();
        update();

        if (!isGameOver) {
            requestAnimationFrame(loop);
        } else {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);
        }
    }

    loop();
    // movement events ------------------------------------------
    document.addEventListener("keydown", function (event) {
        if (isGameOver) return;

        switch (event.key) {
            case "ArrowUp":
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case "ArrowDown":
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case "ArrowLeft":
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case "ArrowRight":
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    });
}
export default game;
