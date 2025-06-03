import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTimerContext } from '../contexts/TimerContext';
import beepSound from '../assets/sounds/beep.mp3';

export function useTimer() {
  const { dispatch } = useTimerContext();
  const [time, setTime] = useState(0);
  const [targetTime, setTargetTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownTime, setCountdownTime] = useState(10);
  const [workoutType, setWorkoutType] = useState('forTime');
  const [totalRounds, setTotalRounds] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [emomTime, setEmomTime] = useState(0);
  const [workTime, setWorkTime] = useState(60);
  const [isRest, setIsRest] = useState(false);
  const audioRef = useRef(new Audio(beepSound));
  const intervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const lastMinuteRef = useRef(0);

  // 휴식 시간은 항상 60초에서 수행 시간을 뺀 값
  const restTime = 60 - workTime;

  const formatTime = useCallback((seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  const formattedTime = formatTime(time);

  const isTargetReached = useMemo(() => {
    if (workoutType === 'forTime' || workoutType === 'amrap') {
      return targetTime > 0 && time >= targetTime * 60;
    }
    return totalRounds > 0 && currentRound >= totalRounds && emomTime >= (isRest ? restTime : workTime);
  }, [workoutType, targetTime, time, totalRounds, currentRound, emomTime, isRest, restTime, workTime]);

  useEffect(() => {
    if (!isCountdown) return;

    countdownIntervalRef.current = setInterval(() => {
      setCountdownTime(prev => {
        if (prev <= 1) {
          clearInterval(countdownIntervalRef.current);
          setIsCountdown(false);
          setIsRunning(true);
          dispatch({ type: 'START_TIMER' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [isCountdown, dispatch]);

  useEffect(() => {
    if (!isRunning || isTargetReached) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      if (workoutType === 'emom') {
        setEmomTime(prev => {
          const newTime = prev + 1;
          const currentPhaseTime = isRest ? restTime : workTime;
          
          if (newTime >= currentPhaseTime) {
            if (isRest) {
              // 휴식 시간이 끝나면 다음 라운드로
              const nextRound = currentRound + 1;
              setCurrentRound(nextRound);
              setIsRest(false);
              audioRef.current.play();
              
              if (nextRound >= totalRounds) {
                setIsRunning(false);
                dispatch({ type: 'PAUSE_TIMER' });
              }
            } else {
              // 수행 시간이 끝나면 휴식으로
              setIsRest(true);
              audioRef.current.play();
            }
            return 0;
          }
          return newTime;
        });
      }
      setTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isTargetReached, workoutType, currentRound, totalRounds, dispatch, isRest, workTime, restTime]);

  useEffect(() => {
    if (isTargetReached && isRunning) {
      setIsRunning(false);
      dispatch({ type: 'PAUSE_TIMER' });
      audioRef.current.play();
    }
  }, [isTargetReached, isRunning, dispatch]);

  const startTimer = useCallback(() => {
    if (workoutType === 'emom') {
      if (totalRounds <= 0) {
        alert('라운드 수를 설정해주세요.');
        return;
      }
      if (workTime < 1 || workTime > 60) {
        alert('수행 시간은 1초에서 60초 사이여야 합니다.');
        return;
      }
    } else if (workoutType === 'forTime' || workoutType === 'amrap') {
      if (targetTime <= 0) {
        alert('목표 시간을 설정해주세요.');
        return;
      }
    }
    setCountdownTime(10);
    setIsCountdown(true);
    setCurrentRound(0);
    setEmomTime(0);
    setIsRest(false);
    lastMinuteRef.current = 0;
  }, [targetTime, totalRounds, workoutType, workTime]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    dispatch({ type: 'PAUSE_TIMER' });
  }, [dispatch]);

  const resetTimer = useCallback(() => {
    setTime(0);
    setIsRunning(false);
    setIsCountdown(false);
    setCountdownTime(10);
    setCurrentRound(0);
    setEmomTime(0);
    setIsRest(false);
    lastMinuteRef.current = 0;
    dispatch({ type: 'RESET_TIMER' });
  }, [dispatch]);

  const updateTargetTime = useCallback((seconds) => {
    setTargetTime(seconds);
    dispatch({ type: 'SET_TARGET_TIME', payload: seconds });
  }, [dispatch]);

  const updateWorkoutType = useCallback((type) => {
    setWorkoutType(type);
    dispatch({ type: 'SET_WORKOUT_TYPE', payload: type });
    resetTimer();
  }, [dispatch, resetTimer]);

  return {
    time,
    formattedTime,
    isRunning,
    isTargetReached,
    isCountdown,
    countdownTime,
    targetTime,
    setTargetTime: updateTargetTime,
    startTimer,
    pauseTimer,
    resetTimer,
    workoutType,
    setWorkoutType: updateWorkoutType,
    formatTime,
    currentRound,
    totalRounds,
    setTotalRounds,
    emomTime,
    workTime,
    restTime,
    setWorkTime,
    isRest,
  };
} 