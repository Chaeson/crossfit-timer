import React, { createContext, useContext, useReducer } from 'react';

const TimerContext = createContext();

const initialState = {
  time: 0,
  isRunning: false,
  isCountdown: false,
  isTargetReached: false,
  targetTime: 0,
  workoutType: 'forTime',
};

function timerReducer(state, action) {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        isCountdown: false,
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        isRunning: false,
      };
    case 'RESET_TIMER':
      return {
        ...initialState,
      };
    case 'SET_TARGET_TIME':
      return {
        ...state,
        targetTime: action.payload,
      };
    case 'SET_WORKOUT_TYPE':
      return {
        ...state,
        workoutType: action.payload,
      };
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