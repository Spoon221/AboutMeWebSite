import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Hole {
  x: number;
  y: number;
  radius: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'wall' | 'bumper';
}

export default function GolfGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [gameState, setGameState] = useState<'aiming' | 'shooting' | 'complete'>('aiming');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [isCharging, setIsCharging] = useState(false);

  const [ball, setBall] = useState<Ball>({
    x: 100,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 15
  });

  const [hole] = useState<Hole>({
    x: 700,
    y: 300,
    radius: 25
  });

  const [obstacles] = useState<Obstacle[]>([
    { x: 300, y: 200, width: 20, height: 200, type: 'wall' },
    { x: 500, y: 100, width: 200, height: 20, type: 'wall' },
    { x: 400, y: 400, width: 150, height: 20, type: 'wall' },
    { x: 200, y: 350, width: 20, height: 100, type: 'wall' },
    { x: 350, y: 250, width: 30, height: 30, type: 'bumper' },
    { x: 600, y: 350, width: 30, height: 30, type: 'bumper' }
  ]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (gameState !== 'shooting') return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        newBall.x += newBall.vx;
        newBall.y += newBall.vy;
        
        newBall.vx *= 0.98;
        newBall.vy *= 0.98;

        if (newBall.x - newBall.radius <= 0 || newBall.x + newBall.radius >= 800) {
          newBall.vx *= -0.8;
          newBall.x = Math.max(newBall.radius, Math.min(800 - newBall.radius, newBall.x));
        }
        if (newBall.y - newBall.radius <= 0 || newBall.y + newBall.radius >= 600) {
          newBall.vy *= -0.8;
          newBall.y = Math.max(newBall.radius, Math.min(600 - newBall.radius, newBall.y));
        }

        obstacles.forEach(obstacle => {
          if (obstacle.type === 'wall') {
            if (newBall.x + newBall.radius > obstacle.x && 
                newBall.x - newBall.radius < obstacle.x + obstacle.width &&
                newBall.y + newBall.radius > obstacle.y && 
                newBall.y - newBall.radius < obstacle.y + obstacle.height) {
              
              const dx = newBall.x - (obstacle.x + obstacle.width / 2);
              const dy = newBall.y - (obstacle.y + obstacle.height / 2);
              
              if (Math.abs(dx) > Math.abs(dy)) {
                newBall.vx *= -0.8;
                newBall.x = dx > 0 ? obstacle.x + obstacle.width + newBall.radius : obstacle.x - newBall.radius;
              } else {
                newBall.vy *= -0.8;
                newBall.y = dy > 0 ? obstacle.y + obstacle.height + newBall.radius : obstacle.y - newBall.radius;
              }
            }
          } else if (obstacle.type === 'bumper') {
            const dx = newBall.x - (obstacle.x + obstacle.width / 2);
            const dy = newBall.y - (obstacle.y + obstacle.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < newBall.radius + obstacle.width / 2) {
              const angle = Math.atan2(dy, dx);
              newBall.vx = Math.cos(angle) * 8;
              newBall.vy = Math.sin(angle) * 8;
            }
          }
        });

        const holeDistance = Math.sqrt(
          Math.pow(newBall.x - hole.x, 2) + Math.pow(newBall.y - hole.y, 2)
        );
        
        if (holeDistance < hole.radius) {
          setGameState('complete');
          setScore(prev => prev + Math.max(1, 10 - Math.floor(level / 2)));
          return prevBall;
        }

        if (Math.abs(newBall.vx) < 0.1 && Math.abs(newBall.vy) < 0.1) {
          setGameState('aiming');
          newBall.vx = 0;
          newBall.vy = 0;
        }

        return newBall;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, obstacles, hole, level]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 800, 600);

    if (viewMode === '3D') {
      // 3D вид с перспективой
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, '#1e3a8a');
      gradient.addColorStop(0.5, '#3b82f6');
      gradient.addColorStop(1, '#10b981');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      // Рисуем сетку в 3D стиле
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 800; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 20, 600);
        ctx.stroke();
      }
      for (let i = 0; i < 600; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(800, i + 20);
        ctx.stroke();
      }
    } else {
      // 2D вид
      const gradient = ctx.createLinearGradient(0, 0, 0, 600);
      gradient.addColorStop(0, '#87CEEB');
      gradient.addColorStop(1, '#98FB98');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 600);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 800; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 600);
        ctx.stroke();
      }
      for (let i = 0; i < 600; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(800, i);
        ctx.stroke();
      }
    }

    // Рисуем препятствия
    obstacles.forEach(obstacle => {
      if (obstacle.type === 'wall') {
        if (viewMode === '3D') {
          // 3D стены с градиентом
          const wallGradient = ctx.createLinearGradient(
            obstacle.x, obstacle.y, 
            obstacle.x + obstacle.width, obstacle.y + obstacle.height
          );
          wallGradient.addColorStop(0, '#8B4513');
          wallGradient.addColorStop(0.5, '#A0522D');
          wallGradient.addColorStop(1, '#8B4513');
          ctx.fillStyle = wallGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // 3D эффект
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 3;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          ctx.strokeStyle = '#654321';
          ctx.lineWidth = 2;
          ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      } else if (obstacle.type === 'bumper') {
        if (viewMode === '3D') {
          // 3D бампер с объемом
          const bumperGradient = ctx.createRadialGradient(
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 0,
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2
          );
          bumperGradient.addColorStop(0, '#FFD700');
          bumperGradient.addColorStop(0.5, '#FFA500');
          bumperGradient.addColorStop(1, '#FF8C00');
          ctx.fillStyle = bumperGradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
          
          // 3D тень
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(obstacle.x + 3, obstacle.y + 3, obstacle.width, obstacle.height);
        } else {
          const gradient = ctx.createRadialGradient(
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, 0,
            obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2
          );
          gradient.addColorStop(0, '#FFD700');
          gradient.addColorStop(1, '#FFA500');
          ctx.fillStyle = gradient;
          ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
      }
    });

    // Рисуем лунку
    if (viewMode === '3D') {
      // 3D лунка с глубиной
      const holeGradient = ctx.createRadialGradient(hole.x, hole.y, 0, hole.x, hole.y, hole.radius);
      holeGradient.addColorStop(0, '#000');
      holeGradient.addColorStop(0.3, '#333');
      holeGradient.addColorStop(0.7, '#666');
      holeGradient.addColorStop(1, '#000');
      ctx.fillStyle = holeGradient;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 3D ободок
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else {
      const holeGradient = ctx.createRadialGradient(hole.x, hole.y, 0, hole.x, hole.y, hole.radius);
      holeGradient.addColorStop(0, '#000');
      holeGradient.addColorStop(0.7, '#333');
      holeGradient.addColorStop(1, '#000');
      ctx.fillStyle = holeGradient;
      ctx.beginPath();
      ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Рисуем мяч
    if (viewMode === '3D') {
      // 3D мяч с объемом
      const ballGradient = ctx.createRadialGradient(
        ball.x - 8, ball.y - 8, 0, ball.x, ball.y, ball.radius
      );
      ballGradient.addColorStop(0, '#FFF');
      ballGradient.addColorStop(0.2, '#FF6B6B');
      ballGradient.addColorStop(0.6, '#C44569');
      ballGradient.addColorStop(1, '#8B0000');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // 3D блик
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(ball.x - 5, ball.y - 5, ball.radius / 3, 0, Math.PI * 2);
      ctx.fill();
      
      // 3D тень
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(ball.x + 4, ball.y + 4, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const ballGradient = ctx.createRadialGradient(
        ball.x - 5, ball.y - 5, 0, ball.x, ball.y, ball.radius
      );
      ballGradient.addColorStop(0, '#FFF');
      ballGradient.addColorStop(0.3, '#FF6B6B');
      ballGradient.addColorStop(1, '#C44569');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.arc(ball.x + 3, ball.y + 3, ball.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (gameState === 'aiming') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ctx.lineTo(
        ball.x + Math.cos(angle) * (50 + power * 2),
        ball.y + Math.sin(angle) * (50 + power * 2)
      );
      ctx.stroke();
      ctx.setLineDash([]);

      const powerBarWidth = 200;
      const powerBarHeight = 20;
      const powerBarX = 50;
      const powerBarY = 50;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(powerBarX, powerBarY, powerBarWidth, powerBarHeight);
      
      const powerWidth = (power / 100) * powerBarWidth;
      const powerGradient = ctx.createLinearGradient(powerBarX, powerBarY, powerBarX + powerWidth, powerBarY);
      powerGradient.addColorStop(0, '#4CAF50');
      powerGradient.addColorStop(0.5, '#FFC107');
      powerGradient.addColorStop(1, '#F44336');
      ctx.fillStyle = powerGradient;
      ctx.fillRect(powerBarX, powerBarY, powerWidth, powerBarHeight);
      
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(powerBarX, powerBarY, powerBarWidth, powerBarHeight);
      
      ctx.fillStyle = '#000';
      ctx.font = '16px Arial';
      ctx.fillText(`Power: ${Math.round(power)}%`, powerBarX, powerBarY - 10);
    }

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(650, 50, 120, 80);
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.fillText(`Level: ${level}`, 660, 70);
    ctx.fillText(`Score: ${score}`, 660, 90);
    ctx.fillText(`View: ${viewMode}`, 660, 110);

    if (isMobile && gameState === 'aiming') {
      drawJoystick(ctx);
    }

  }, [ball, hole, obstacles, gameState, power, angle, isMobile, joystickPos, level, score, viewMode]);

  const drawJoystick = (ctx: CanvasRenderingContext2D) => {
    const joystickSize = 80;
    const joystickX = 100;
    const joystickY = 500;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.arc(joystickX, joystickY, joystickSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const innerSize = 30;
    const innerX = joystickX + joystickPos.x * (joystickSize - innerSize) / joystickSize;
    const innerY = joystickY + joystickPos.y * (joystickSize - innerSize) / joystickSize;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.arc(innerX, innerY, innerSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'aiming' || isMobile) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const dx = x - ball.x;
    const dy = y - ball.y;
    setAngle(Math.atan2(dy, dx));
  }, [gameState, isMobile, ball]);

  const handleMouseDown = useCallback(() => {
    if (gameState !== 'aiming' || isMobile) return;
    
    setIsCharging(true);
    setPower(0);
    
    const powerInterval = setInterval(() => {
      setPower(prev => {
        if (prev >= 100) {
          clearInterval(powerInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    
    // Сохраняем интервал для очистки при отпускании
    (window as any).powerInterval = powerInterval;
  }, [gameState, isMobile]);

  const handleMouseUp = useCallback(() => {
    if (gameState !== 'aiming' || isMobile || !isCharging) return;
    
    // Очищаем интервал
    if ((window as any).powerInterval) {
      clearInterval((window as any).powerInterval);
      (window as any).powerInterval = null;
    }
    
    setIsCharging(false);
    
    if (power > 0) {
      setBall(prev => ({
        ...prev,
        vx: Math.cos(angle) * (power / 10),
        vy: Math.sin(angle) * (power / 10)
      }));
      setGameState('shooting');
      setPower(0);
    }
  }, [gameState, isMobile, power, angle, isCharging]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile || gameState !== 'aiming') return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const joystickX = 100;
    const joystickY = 500;
    const joystickSize = 80;
    
    if (Math.sqrt(Math.pow(x - joystickX, 2) + Math.pow(y - joystickY, 2)) < joystickSize) {
      setJoystickActive(true);
      updateJoystick(x, y, joystickX, joystickY, joystickSize);
    }
  }, [isMobile, gameState]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !joystickActive || gameState !== 'aiming') return;
    
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const joystickX = 100;
    const joystickY = 500;
    const joystickSize = 80;
    
    updateJoystick(x, y, joystickX, joystickY, joystickSize);
  }, [isMobile, joystickActive, gameState]);

  const handleTouchEnd = useCallback(() => {
    if (!isMobile) return;
    
    if (joystickActive && gameState === 'aiming') {
      const joystickPower = Math.sqrt(joystickPos.x * joystickPos.x + joystickPos.y * joystickPos.y) / 80 * 100;
      const joystickAngle = Math.atan2(joystickPos.y, joystickPos.x);
      
      setBall(prev => ({
        ...prev,
        vx: Math.cos(joystickAngle) * (joystickPower / 10),
        vy: Math.sin(joystickAngle) * (joystickPower / 10)
      }));
      setGameState('shooting');
    }
    
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
  }, [isMobile, joystickActive, gameState, joystickPos]);

  const updateJoystick = (touchX: number, touchY: number, joystickX: number, joystickY: number, joystickSize: number) => {
    const dx = touchX - joystickX;
    const dy = touchY - joystickY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > joystickSize) {
      const angle = Math.atan2(dy, dx);
      setJoystickPos({
        x: Math.cos(angle) * joystickSize,
        y: Math.sin(angle) * joystickSize
      });
    } else {
      setJoystickPos({ x: dx, y: dy });
    }
    
    setAngle(Math.atan2(dy, dx));
  };

  const resetLevel = () => {
    setBall({ x: 100, y: 300, vx: 0, vy: 0, radius: 15 });
    setGameState('aiming');
    setPower(0);
    setAngle(0);
    setJoystickPos({ x: 0, y: 0 });
    setIsCharging(false);
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    resetLevel();
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === '2D' ? '3D' : '2D');
  };

  return (
    <div className="w-full h-[600px] relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      />
      
      {/* Панель управления */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
        <button
          onClick={resetLevel}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          Reset
        </button>
        
        <button
          onClick={toggleViewMode}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        >
          {viewMode === '2D' ? 'Switch to 3D' : 'Switch to 2D'}
        </button>
        
        {gameState === 'complete' && (
          <button
            onClick={nextLevel}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Next Level
          </button>
        )}
      </div>

      <div className="absolute top-4 left-4 bg-black/80 text-white p-3 rounded text-sm max-w-xs">
        <div className="font-bold mb-2">🎯 Golf Game</div>
        {isMobile ? (
          <div>
            <div>📱 Use joystick to aim</div>
            <div>👆 Drag to set power</div>
            <div>🎯 Get ball in hole!</div>
          </div>
        ) : (
          <div>
            <div>🖱️ Move mouse to aim</div>
            <div>🖱️ Click and hold for power</div>
            <div>🖱️ Release to shoot!</div>
            <div>🔄 Toggle 2D/3D view</div>
          </div>
        )}
      </div>

      {gameState === 'complete' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl text-center">
            <h3 className="text-2xl font-bold text-green-600 mb-4">🎉 Hole in One!</h3>
            <p className="text-gray-700 mb-4">Level {level} completed!</p>
            <p className="text-gray-600 mb-4">Score: {score}</p>
            <button
              onClick={nextLevel}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Next Level
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
