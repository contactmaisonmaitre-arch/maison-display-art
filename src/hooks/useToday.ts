import { useEffect, useState } from "react";

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

const CHECK_MS = 60_000;

// Re-renders only when the calendar day changes — cheap proxy for "current date".
export const useToday = () => {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => {
    let last = dayKey(date);
    const id = setInterval(() => {
      const now = new Date();
      const k = dayKey(now);
      if (k !== last) {
        last = k;
        setDate(now);
      }
    }, CHECK_MS);
    return () => clearInterval(id);
  }, [date]);
  return date;
};
