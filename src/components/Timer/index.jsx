import React from 'react';
import styled from 'styled-components';
import { useTimer } from '../../hooks/useTimer';
import Countdown from '../Countdown';

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
`;

const WorkoutTypeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const WorkoutTypeButton = styled.button`
  padding: 8px 16px;
  font-size: 1rem;
  border: 2px solid ${props => props['data-active'] ? '#4CAF50' : '#ccc'};
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props['data-active'] ? '#4CAF50' : 'white'};
  color: ${props => props['data-active'] ? 'white' : '#333'};
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props['data-active'] ? '#45a049' : '#f0f0f0'};
  }
`;

const TimerSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const CircularProgress = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 20px 0;
`;

const Circle = styled.svg`
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const CircleBackground = styled.circle`
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 8;
`;

const CircleProgress = styled.circle`
  fill: none;
  stroke: ${props => {
    if (props['data-target-reached']) return '#ff4444';
    if (props['data-rest']) return '#ff9800';
    return '#4CAF50';
  }};
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
`;

const TimeDisplay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2.5rem;
  font-weight: bold;
  font-family: monospace;
  color: ${props => props['data-target-reached'] ? '#ff4444' : 'inherit'};
  transition: color 0.3s ease;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${props => props['data-primary'] ? '#4CAF50' : '#f0f0f0'};
  color: ${props => props['data-primary'] ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props['data-primary'] ? '#45a049' : '#e0e0e0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TargetTimeInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  width: 100px;
  text-align: center;
`;

const TargetTimeLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const RoundDisplay = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
`;

const TimeInputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
`;

const TimeInput = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 80px;
  text-align: center;
`;

const TimeLabel = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
`;

const RestTimeDisplay = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-top: 5px;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
`;

export default function Timer() {
  const {
    formattedTime,
    isRunning,
    isTargetReached,
    isCountdown,
    countdownTime,
    startTimer,
    pauseTimer,
    resetTimer,
    setTargetTime,
    targetTime,
    time,
    workoutType,
    setWorkoutType,
    formatTime,
    currentRound,
    totalRounds,
    setTotalRounds,
    emomTime,
    workTime,
    restTime,
    setWorkTime,
    isRest,
  } = useTimer();

  const handleTargetTimeChange = (e) => {
    const minutes = parseInt(e.target.value) || 0;
    setTargetTime(minutes);
  };

  const handleRoundChange = (e) => {
    const rounds = parseInt(e.target.value) || 0;
    setTotalRounds(rounds);
  };

  const handleWorkTimeChange = (e) => {
    const seconds = parseInt(e.target.value) || 0;
    if (seconds > 60) {
      alert('수행 시간은 60초를 초과할 수 없습니다.');
      return;
    }
    setWorkTime(seconds);
  };

  // 원형 프로그레스 바 계산
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = workoutType === 'emom' 
    ? (emomTime / (isRest ? restTime : workTime)) * circumference
    : targetTime > 0 
      ? (time / (targetTime * 60)) * circumference
      : 0;
  const strokeDashoffset = circumference - progress;

  return (
    <TimerContainer>
      <WorkoutTypeSelector>
        <WorkoutTypeButton
          data-active={workoutType === 'forTime'}
          onClick={() => setWorkoutType('forTime')}
          disabled={isRunning || isCountdown}
        >
          For Time
        </WorkoutTypeButton>
        <WorkoutTypeButton
          data-active={workoutType === 'amrap'}
          onClick={() => setWorkoutType('amrap')}
          disabled={isRunning || isCountdown}
        >
          AMRAP
        </WorkoutTypeButton>
        <WorkoutTypeButton
          data-active={workoutType === 'emom'}
          onClick={() => setWorkoutType('emom')}
          disabled={isRunning || isCountdown}
        >
          EMOM
        </WorkoutTypeButton>
      </WorkoutTypeSelector>

      {workoutType === 'emom' ? (
        <>
          <TimeLabel>라운드 수</TimeLabel>
          <TargetTimeInput
            type="number"
            placeholder="라운드"
            onChange={handleRoundChange}
            disabled={isRunning || isCountdown}
          />
        </>
      ) : (
        <>
          <TargetTimeLabel>목표 시간 (분)</TargetTimeLabel>
          <TargetTimeInput
            type="number"
            placeholder="분"
            value={targetTime}
            onChange={handleTargetTimeChange}
            disabled={isRunning || isCountdown}
          />
        </>
      )}

      <TimerSection>
        {isCountdown && (
          <Countdown 
            isActive={isCountdown}
            time={countdownTime}
          />
        )}
        <CircularProgress>
          <Circle viewBox="0 0 200 200">
            <CircleBackground cx="100" cy="100" r={radius} />
            <CircleProgress
              cx="100"
              cy="100"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              data-target-reached={isTargetReached}
              data-rest={isRest}
            />
          </Circle>
          <TimeDisplay data-target-reached={isTargetReached}>
            {workoutType === 'amrap' 
              ? formatTime(targetTime * 60 - time) 
              : workoutType === 'emom'
              ? formatTime(isRest ? restTime - emomTime : workTime - emomTime)
              : formattedTime}
          </TimeDisplay>
        </CircularProgress>
        {isRunning && workoutType === 'emom' && (
          <RoundDisplay>
            Round {currentRound} / {totalRounds} {isRest ? '(휴식)' : '(수행)'}
          </RoundDisplay>
        )}
      </TimerSection>

      <ControlsContainer>
        {!isRunning && !isCountdown ? (
          <Button 
            data-primary
            onClick={startTimer}
            disabled={isTargetReached || (workoutType === 'emom' && (totalRounds <= 0 || workTime < 1 || workTime > 60))}
          >
            시작
          </Button>
        ) : (
          <Button onClick={pauseTimer}>
            일시정지
          </Button>
        )}
        <Button onClick={resetTimer}>
          리셋
        </Button>
      </ControlsContainer>

      {workoutType === 'emom' && (
        <SettingsContainer>
          <TimeLabel>수행 시간 설정 (초)</TimeLabel>
          <TimeInputContainer>
            <TimeInput
              type="number"
              placeholder="수행"
              value={workTime}
              onChange={handleWorkTimeChange}
              disabled={isRunning || isCountdown}
            />
            <span>초</span>
          </TimeInputContainer>
          <RestTimeDisplay>
            휴식 시간: {restTime}초
          </RestTimeDisplay>
        </SettingsContainer>
      )}
    </TimerContainer>
  );
} 