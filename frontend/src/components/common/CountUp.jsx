import { useEffect, useRef, useState } from 'react';

/**
 * Animates a number from 0 up to `end`, then (by default) pauses briefly
 * and loops again — used for stat counters that should keep drawing the eye.
 */
export default function CountUp({
  end,
  duration = 1800,
  pause = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  loop = true,
}) {
  const [value, setValue] = useState(0);
  const frameRef = useRef();
  const timeoutRef = useRef();

  useEffect(() => {
    let startTime = null;

    function tick(timestamp) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic for a natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else if (loop) {
        timeoutRef.current = setTimeout(() => {
          startTime = null;
          setValue(0);
          frameRef.current = requestAnimationFrame(tick);
        }, pause);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [end, duration, pause, loop]);

  return (
    <>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </>
  );
}
