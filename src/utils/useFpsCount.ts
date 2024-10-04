import { useCallback, useRef, useState } from "react";

export default function useFpsCount(): { fps: number; tick: () => void } {
  const [fps, setFps] = useState(0);
  const startTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  const tick = useCallback(() => {
    frameCountRef.current += 1;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;

    if (elapsed >= 1000) {
      setFps(Math.round((frameCountRef.current / elapsed) * 1000));
      frameCountRef.current = 0;
      startTimeRef.current = now;
    }
  }, []);

  return { fps, tick };
}
