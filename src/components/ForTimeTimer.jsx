// src/components/ForTimeTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from 'use-timer';

const ForTimeTimer = () => {
  const [timeInput, setTimeInput] = useState('');
  const [initialTime, setInitialTime] = useState(0);
  const [isConfigured, setIsConfigured] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const countdownRef = useRef(null);
  
  // use-timer 훅 사용
  const { time, start, pause, reset, status } = useTimer({
    initialTime: initialTime,
    endTime: 0,
    timerType: 'DECREMENTAL',
    autostart: false,
  });
  
  // 시간 입력 처리 (hh:mm 형식)
  const handleTimeInput = () => {
    if (!timeInput) return;
    
    // 입력된 값을 분과 초로 변환
    let minutes = 0;
    let seconds = 0;
    
    if (timeInput.length <= 2) {
      // 60초 미만이면 초로 처리
      seconds = parseInt(timeInput);
    } else if (timeInput.length <= 4) {
      // 4자리 이하면 앞 부분은 분, 뒤 부분은 초로 처리
      minutes = parseInt(timeInput.slice(0, -2));
      seconds = parseInt(timeInput.slice(-2));
    } else {
      // 그 이상은 앞 부분은 분, 뒤 부분은 초로 처리 (최대 99분 59초)
      minutes = parseInt(timeInput.slice(0, -2));
      seconds = parseInt(timeInput.slice(-2));
      
      if (minutes > 99) minutes = 99;
      if (seconds > 59) seconds = 59;
    }
    
    const totalSeconds = minutes * 60 + seconds;
    
    // 타이머 설정
    setInitialTime(totalSeconds);
    reset();
    
    // 설정 완료 상태로 변경
    setIsConfigured(true);
    setTimeInput('');
  };
  
  // 타이머 시작 (10초 카운트다운 후)
  const startTimer = () => {
    setCountdown(10);
    
    // 카운트다운 시작
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          // 카운트다운이 끝나면 타이머 시작
          start();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // 타이머 리셋
  const resetAll = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setIsConfigured(false);
    setCountdown(0);
    setInitialTime(0);
    reset();
  };
  
  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);
  
  // 시간 포맷팅 유틸리티
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="for-time-timer">
      <h2>For Time 타이머</h2>
      
      {!isConfigured ? (
        <div className="timer-setup">
          <div className="input-group">
            <label>시간 입력 (예: 2000 → 20:00)</label>
            <input
              type="number"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              placeholder="숫자만 입력 (예: 2000)"
            />
            <button onClick={handleTimeInput}>시간 설정</button>
          </div>
        </div>
      ) : (
        <div className="timer-display">
          {countdown > 0 ? (
            <>
              <div className="time countdown">{countdown}</div>
              <div className="status">시작 준비</div>
            </>
          ) : (
            <>
              <div className="time">{formatTime(time)}</div>
              <div className="status">
                {status === 'RUNNING' ? 'FOR TIME' : 
                 status === 'PAUSED' ? '일시정지' : 
                 time === 0 ? '완료' : '준비'}
              </div>
            </>
          )}
          
          <div className="controls">
            {status !== 'RUNNING' && time > 0 && countdown === 0 && (
              <button onClick={startTimer}>시작</button>
            )}
            {status === 'RUNNING' && (
              <button onClick={pause}>일시정지</button>
            )}
            {status === 'PAUSED' && (
              <button onClick={start}>재개</button>
            )}
            <button onClick={resetAll}>리셋</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForTimeTimer;
