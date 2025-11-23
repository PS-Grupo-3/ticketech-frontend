import { useEffect, useRef, useState } from "react";

export function useCartTimer(
  eventId: string | undefined,
  onExpire: () => Promise<void> | void
) {
  const TIMER_KEY = eventId ? `timer_${eventId}` : null;
  const [timeLeft, setTimeLeft] = useState(0);
  const expireRef = useRef(onExpire);

  expireRef.current = onExpire;

  useEffect(() => {
    if (!TIMER_KEY) return;
    const raw = localStorage.getItem(TIMER_KEY);
    if (raw) {
      const parsed = parseInt(raw);
      if (!isNaN(parsed) && parsed > 0) {
        setTimeLeft(parsed);
      }
    }
  }, [TIMER_KEY]);

  useEffect(() => {
    if (!TIMER_KEY) return;
    if (timeLeft > 0) {
      localStorage.setItem(TIMER_KEY, timeLeft.toString());
    } else {
      localStorage.removeItem(TIMER_KEY);
    }
  }, [timeLeft, TIMER_KEY]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          Promise.resolve(expireRef.current());
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft]);

  const resetTimer = () => {
    setTimeLeft(40); // ETIQUETA: CAMBIO TIMER
  };

  const stopTimer = () => {
    setTimeLeft(0);
  };

  return {
    timeLeft,
    resetTimer,
    stopTimer,
  };
}
