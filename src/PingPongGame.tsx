import React, { useRef, useEffect, useState } from 'react';
import { Gamepad2, MousePointer, ArrowUp, ArrowDown } from 'lucide-react';
import { translations } from './translation';

type Language = 'en' | 'ru'; // Add other languages as needed

const PingPongGame: React.FC<{ language: Language }> = ({ language }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const winningScore = 5;

  // Game objects - stored in refs to avoid re-renders
  const ballRef = useRef({
    x: 0,
    y: 0,
    radius: 10,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: '#FFFFFF'
  });

  const playerPaddleRef = useRef({
    x: 0,
    y: 0,
    width: 10,
    height: 100,
    speed: 8,
    color: '#FFFFFF'
  });

  const aiPaddleRef = useRef({
    x: 0,
    y: 0,
    width: 10,
    height: 100,
    speed: 5.5,
    color: '#FFFFFF'
  });

  const animationFrameIdRef = useRef<number | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const initializeGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctxRef.current = canvas.getContext('2d');

    resetGame();
  };

  const resetGame = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ball = ballRef.current;
    const playerPaddle = playerPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    // Position ball in center
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Reset ball velocity (randomize direction)
    ball.velocityX = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.velocityY = (Math.random() * 2 - 1) * ball.speed;

    // Reset ball speed
    ball.speed = isMobile ? 3 : 5; // Уменьшаем скорость на мобильных устройствах

    // Position paddles
    playerPaddle.x = 20;
    playerPaddle.y = canvas.height / 2 - playerPaddle.height / 2;

    aiPaddle.x = canvas.width - 20 - aiPaddle.width;
    aiPaddle.y = canvas.height / 2 - aiPaddle.height / 2;
  };

  const startGame = () => {
    setPlayerScore(0); // Обнуляем счет
    setAiScore(0); // Обнуляем счет
    setGameOver(false);
    setWinner(null);
    setGameRunning(true);
    resetGame();

    if (!animationFrameIdRef.current) {
      gameLoop();
    }
  };

  const handleReset = () => {
    resetGame();
    setGameRunning(false);
    setGameOver(false);
    setPlayerScore(0);
    setAiScore(0);
  };

  const stopGame = () => {
    setGameRunning(false);
    setGameOver(false);
    setPlayerScore(0);
    setAiScore(0);
    clearCanvas(); // Очищаем канвас
  };

  const clearCanvas = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас
  };

  const checkGameOver = () => {
    if (playerScore >= winningScore) {
      setGameOver(true);
      setWinner('player');
      setGameRunning(false);
      return true;
    } else if (aiScore >= winningScore) {
      setGameOver(true);
      setWinner('ai');
      setGameRunning(false);
      return true;
    }
    return false;
  };

  const draw = () => {
    if (!canvasRef.current || !ctxRef.current) return;

    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const ball = ballRef.current;
    const playerPaddle = playerPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([5, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = playerPaddle.color;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);

    ctx.fillStyle = aiPaddle.color;
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);
  };

  const update = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ball = ballRef.current;
    const playerPaddle = playerPaddleRef.current;
    const aiPaddle = aiPaddleRef.current;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
      ball.velocityY = -ball.velocityY;
    }

    const playerSide = ball.x < canvas.width / 2;
    const paddle = playerSide ? playerPaddle : aiPaddle;

    if (
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.x + ball.radius > paddle.x &&
      ball.y > paddle.y &&
      ball.y < paddle.y + paddle.height
    ) {
      const collidePoint = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
      const angleRad = collidePoint * (Math.PI / 4);
      const direction = playerSide ? 1 : -1;

      ball.velocityX = direction * ball.speed * Math.cos(angleRad);
      ball.velocityY = ball.speed * Math.sin(angleRad);

      ball.speed += 0.2;
    }

    // Check if ball passed paddles (scoring)
    if (ball.x - ball.radius < 0) {
      // AI scores
      setAiScore(prev => prev + 1);
      resetGame();
    } else if (ball.x + ball.radius > canvas.width) {
      // Player scores
      setPlayerScore(prev => prev + 1);
      resetGame();
    }

    const aiPaddleCenter = aiPaddle.y + aiPaddle.height / 2;

    if (ball.velocityX > 0) {
      if (aiPaddleCenter < ball.y - 10) {
        aiPaddle.y += aiPaddle.speed;
      } else if (aiPaddleCenter > ball.y + 10) {
        aiPaddle.y -= aiPaddle.speed;
      }
    } else {
      if (aiPaddleCenter < canvas.height / 2 - 30) {
        aiPaddle.y += aiPaddle.speed / 2;
      } else if (aiPaddleCenter > canvas.height / 2 + 30) {
        aiPaddle.y -= aiPaddle.speed / 2;
      }
    }

    if (aiPaddle.y < 0) {
      aiPaddle.y = 0;
    } else if (aiPaddle.y + aiPaddle.height > canvas.height) {
      aiPaddle.y = canvas.height - aiPaddle.height;
    }
  };

  const gameLoop = () => {
    if (!gameRunning) {
      animationFrameIdRef.current = null;
      return;
    }

    update();
    draw();

    const isGameOver = checkGameOver();
    if (!isGameOver) {
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const movePaddle = (clientY: number) => {
    if (!gameRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const playerPaddle = playerPaddleRef.current;

    const rect = canvas.getBoundingClientRect();
    const yPos = clientY - rect.top;

    playerPaddle.y = yPos - playerPaddle.height / 2;

    if (playerPaddle.y < 0) {
      playerPaddle.y = 0;
    } else if (playerPaddle.y + playerPaddle.height > canvas.height) {
      playerPaddle.y = canvas.height - playerPaddle.height;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    movePaddle(e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();

    if (e.touches.length > 0) {
      movePaddle(e.touches[0].clientY);
    }
  };

  const touchUpIntervalRef = useRef<number | null>(null);
  const touchDownIntervalRef = useRef<number | null>(null);
  const handleTouchUp = () => {
    if (!gameRunning || !canvasRef.current) return;
    const playerPaddle = playerPaddleRef.current;

    playerPaddle.y -= playerPaddle.speed * 4;
    if (playerPaddle.y < 0) {
      playerPaddle.y = 0;
    }
  };

  const startTouchUp = () => {
    if (touchUpIntervalRef.current) return;
    handleTouchUp();
    touchUpIntervalRef.current = window.setInterval(handleTouchUp, 50);
  };

  const handleTouchDown = () => {
    if (!gameRunning || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const playerPaddle = playerPaddleRef.current;

    playerPaddle.y += playerPaddle.speed * 4;
    if (playerPaddle.y + playerPaddle.height > canvas.height) {
      playerPaddle.y = canvas.height - playerPaddle.height;
    }
  };

  const startTouchDown = () => {
    if (touchDownIntervalRef.current) return;
    handleTouchDown();
    touchDownIntervalRef.current = window.setInterval(handleTouchDown, 50);
  };

  const stopTouchMovement = () => {
    if (touchUpIntervalRef.current) {
      clearInterval(touchUpIntervalRef.current);
      touchUpIntervalRef.current = null;
    }
    if (touchDownIntervalRef.current) {
      clearInterval(touchDownIntervalRef.current);
      touchDownIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning || !canvasRef.current) return;

      const playerPaddle = playerPaddleRef.current;
      const canvas = canvasRef.current;
      if (e.key === 'ArrowUp') {
        playerPaddle.y -= playerPaddle.speed * 2;
        if (playerPaddle.y < 0) {
          playerPaddle.y = 0;
        }
      } else if (e.key === 'ArrowDown') {
        playerPaddle.y += playerPaddle.speed * 2;
        if (playerPaddle.y + playerPaddle.height > canvas.height) {
          playerPaddle.y = canvas.height - playerPaddle.height;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameRunning]);

  useEffect(() => {
    initializeGame();

    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || ('ontouchstart' in window));
    };

    const handleResize = () => {
      initializeGame();
      checkMobile();
      if (gameRunning) {
        draw();
      }
    };

    checkMobile();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      stopTouchMovement();
    };
  }, []);

  useEffect(() => {
    checkGameOver();
  }, [playerScore, aiScore]);

  useEffect(() => {
    if (gameRunning && !animationFrameIdRef.current) {
      gameLoop();
    }
  }, [gameRunning]);

  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Gamepad2 className="w-6 h-6" />
          <h2 className="text-3xl font-bold">{translations["pingpong_title"][language]}</h2>
        </div>

        <div className="mb-4 text-gray-700">
          <p className="text-center text-lg md:text-base">
            {translations["pingpong_challenge"][language]}
            {isMobile
              ? translations["pingpong_touch_control"][language]
              : translations["pingpong_mouse_control"][language]}
          </p>
        </div>

        <div className="relative">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-h-[600px]">
            <canvas
              ref={canvasRef}
              id="pingpong"
              className="w-full h-full"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
            />

            {!gameRunning && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-center">{translations["pingpong_challenge"][language]}</h3>
                <p className="mb-6 text-center max-w-md text-sm md:text-base">
                  {isMobile
                    ? translations["pingpong_touch_instruction"][language]
                    : translations["pingpong_mouse_instruction"][language]}
                  <br />
                  {translations["pingpong_first_to"][language]} {winningScore} {translations["pingpong_points"][language]}!
                </p>
                <button
                  onClick={startGame}
                  className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {translations["start_game"][language]}
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center text-white">
                <h3 className="text-3xl font-bold mb-2">
                  {winner === 'player' ? translations["you_win"][language] : translations["ai_wins"][language]}
                </h3>
                <p className="text-xl mb-8">{translations["score"][language]}: {playerScore} - {aiScore}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  {translations["play_again"][language]}
                </button>
              </div>
            )}

            {gameRunning && (
              <div className="absolute top-4 left-0 right-0 flex justify-center text-white text-2xl font-bold">
                <span>{playerScore}</span>
                <span className="mx-2">-</span>
                <span>{aiScore}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-4 justify-center md:justify-between items-center">
            {isMobile ? (
              <div className="w-full flex justify-center mt-2">
                <div className="flex gap-3">
                  <button
                    onTouchStart={startTouchUp}
                    onMouseDown={startTouchUp}
                    onTouchEnd={stopTouchMovement}
                    onMouseUp={stopTouchMovement}
                    onMouseLeave={stopTouchMovement}
                    disabled={!gameRunning}
                    className={`p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600 active:bg-gray-500 transition-colors ${!gameRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ArrowUp className="w-8 h-8" />
                  </button>
                  <button
                    onTouchStart={startTouchDown}
                    onMouseDown={startTouchDown}
                    onTouchEnd={stopTouchMovement}
                    onMouseUp={stopTouchMovement}
                    onMouseLeave={stopTouchMovement}
                    disabled={!gameRunning}
                    className={`p-4 bg-gray-700 text-white rounded-full hover:bg-gray-600 active:bg-gray-500 transition-colors ${!gameRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <ArrowDown className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600">
                <span><MousePointer className="w-4 h-4 inline" /> {translations["or"][language]} </span>
                <span>
                  <ArrowUp className="w-4 h-4 inline" />
                  <ArrowDown className="w-4 h-4 inline" /> {translations["to_move"][language]}
                </span>
              </div>
            )}
          </div>

          {gameRunning && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={stopGame}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors"
              >
                {translations["turn_off_game"][language]}
              </button>
            </div>
          )}
        </div>
      </div>
    </section >
  );
};

export default PingPongGame;