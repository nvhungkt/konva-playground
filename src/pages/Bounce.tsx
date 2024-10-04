import { useEffect, useState } from "react";
import { Ellipse, Layer, Rect, Stage, Text } from "react-konva";
import useFpsCount from "../utils/useFpsCount";

type BallConfig = {
  key: number;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  color: string;
  vx: number;
  vy: number;
};

const CANVAS_WIDTH = window.innerWidth;
const CANVAS_HEIGHT = window.innerHeight;

const DEFAULT_VELOCITY = 10;
const RANDOM_DIFF = 5;

const DEFAULT_RADIUS = 25;
const MIN_RADIUS = 15;

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createBall(index: number): BallConfig {
  const vx = Math.random() * DEFAULT_VELOCITY * 2 - DEFAULT_VELOCITY;
  const vy = Math.sqrt(DEFAULT_VELOCITY ** 2 - vx ** 2) * (Math.random() > 0 ? 1 : -1);

  return {
    key: index,
    x: Math.random() * (CANVAS_WIDTH - DEFAULT_RADIUS * 2) + DEFAULT_RADIUS,
    y: Math.random() * (CANVAS_HEIGHT - DEFAULT_RADIUS * 2) + DEFAULT_RADIUS,
    radiusX: DEFAULT_RADIUS,
    radiusY: DEFAULT_RADIUS,
    color: getRandomColor(),
    vx,
    vy,
  };
}

function updateBall(ball: BallConfig): BallConfig {
  let { x, y, radiusX, radiusY, vx, vy } = ball;
  x += vx;
  y += vy;

  if (x - radiusX < 0 || x + radiusX > CANVAS_WIDTH) {
    if (x - MIN_RADIUS < 0 || x + MIN_RADIUS > CANVAS_WIDTH) {
      const delta = (Math.random() - 0.5) * RANDOM_DIFF;
      if (vy + delta > DEFAULT_VELOCITY || vy + delta < -DEFAULT_VELOCITY) {
        vy -= delta;
      } else {
        vy += delta;
      }
      vx = Math.sqrt(DEFAULT_VELOCITY ** 2 - vy ** 2) * (vx < 0 ? 1 : -1);
    }
  }
  if (y - radiusY < 0 || y + radiusY > CANVAS_HEIGHT) {
    if (y - MIN_RADIUS < 0 || y + MIN_RADIUS > CANVAS_HEIGHT) {
      const delta = (Math.random() - 0.5) * RANDOM_DIFF;
      if (vx + delta > DEFAULT_VELOCITY || vx + delta < -DEFAULT_VELOCITY) {
        vx -= delta;
      } else {
        vx += delta;
      }
      vy = Math.sqrt(DEFAULT_VELOCITY ** 2 - vx ** 2) * (vy < 0 ? 1 : -1);
    }
  }

  radiusX = Math.min(x, CANVAS_WIDTH - x, DEFAULT_RADIUS);
  radiusY = Math.min(y, CANVAS_HEIGHT - y, DEFAULT_RADIUS);

  return { ...ball, x, y, vx, vy, radiusX, radiusY };
}

const defaultBalls = new Array(100).fill(0).map((_, index) => createBall(index));

export default function Bounce() {
  const [balls, setBalls] = useState(defaultBalls);
  const { fps, tick } = useFpsCount();

  useEffect(() => {
    function update(ballsToUpdate: BallConfig[]) {
      const newBalls = ballsToUpdate.map(updateBall);

      setBalls(newBalls);
      tick();

      requestAnimationFrame(() => update(newBalls));
    }

    update(balls);
  }, []);

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
      <Layer>
        <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="black" />
      </Layer>
      <Layer>
        {balls.map((ball) => (
          <Ellipse
            key={ball.key}
            x={ball.x}
            y={ball.y}
            radiusX={ball.radiusX}
            radiusY={ball.radiusY}
            fill={ball.color}
          />
        ))}
      </Layer>
      <Layer>
        <Rect x={0} y={0} width={150} height={50} fill="#ffffffcc" />
        <Text text={`FPS: ${fps}`} x={10} y={10} fill="black" fontSize={32} />
      </Layer>
    </Stage>
  );
}
