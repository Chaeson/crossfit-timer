import React, { createContext, useContext, useReducer } from 'react';

const TimerContext = createContext();

const initialState = {
  isRunning: false,
  time: 0,
  workoutType: 'forTime',
  targetTime: 0, // in seconds
  isTargetReached: false,
  isCountdown: false,
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'START_TIMER':
      return { ...state, isRunning: true, isCountdown: false };
    case 'PAUSE_TIMER':
      return { ...state, isRunning: false };
    case 'RESET_TIMER':
      return { 
        ...state, 
        time: 0, 
        isRunning: false, 
        isTargetReached: false,
        isCountdown: false,
      };
    case 'TICK':
      return { 
        ...state, 
        time: state.time + 1,
        isTargetReached: state.targetTime > 0 && state.time + 1 >= state.targetTime
      };
    case 'SET_TARGET_TIME':
      return { ...state, targetTime: action.payload, isTargetReached: false };
    case 'START_COUNTDOWN':
      return { ...state, isCountdown: true };
    default:
      return state;
  }
}

export function TimerProvider({ children }) {
  const [state, dispatch] = useReducer(timerReducer, initialState);

  return (
    <TimerContext.Provider value={{ state, dispatch }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimerContext() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
} 