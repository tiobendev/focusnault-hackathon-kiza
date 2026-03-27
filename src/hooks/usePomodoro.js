import { useEffect, useRef, useState } from "react";

const MODES = {
  FOCUS: "FOCUS",
  BREAK: "BREAK",
};

const STEP = 10;
const MAX_TIME = 120 * 60;

const DEFAULT_FOCUS = 25 * 60;
const DEFAULT_BREAK = 5 * 60;

export function usePomodoro() {
  const [mode, setMode] = useState(MODES.FOCUS);
  const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_FOCUS);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (mode === MODES.FOCUS) {
            setMode(MODES.BREAK);
            return breakTime;
          } else {
            setMode(MODES.FOCUS);
            return focusTime;
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode, focusTime, breakTime]);

  function play() {
    setIsRunning(true);
  }

  function pause() {
    setIsRunning(false);
  }

  function stop() {
    setIsRunning(false);
    setMode(MODES.FOCUS);
    setTimeLeft(focusTime);
  }

  function increaseTime() {
    if (isRunning) return;

    if (mode === MODES.FOCUS) {
      setFocusTime((prev) => {
        const newTime = Math.min(prev + STEP, MAX_TIME);
        setTimeLeft(newTime);
        return newTime;
      });
    } else {
      setBreakTime((prev) => {
        const newTime = Math.min(prev + STEP, MAX_TIME);
        setTimeLeft(newTime);
        return newTime;
      });
    }
  }

  function decreaseTime() {
    if (isRunning) return;

    if (mode === MODES.FOCUS) {
      setFocusTime((prev) => {
        const newTime = Math.max(prev - STEP, 0);
        setTimeLeft(newTime);
        return newTime;
      });
    } else {
      setBreakTime((prev) => {
        const newTime = Math.max(prev - STEP, 0);
        setTimeLeft(newTime);
        return newTime;
      });
    }
  }

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const sec = (seconds % 60).toString().padStart(2, "0");

    return `${min}:${sec}`;
  }

  return {
    mode,
    isRunning,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    focusTime,
    breakTime,

    play,
    pause,
    stop,

    increaseTime,
    decreaseTime,

    setFocusTime,
    setBreakTime,
    setTimeLeft,
  };
}