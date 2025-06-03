import React from 'react';
import styled from 'styled-components';

const CountdownContainer = styled.div`
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 8px 25px;
  border-radius: 20px;
  margin-bottom: 10px;
`;

const CountdownDisplay = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  font-family: monospace;
  color: #ff4444;
  animation: pulse 1s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
`;

export default function Countdown({ 
  time,
  isActive = true 
}) {
  if (!isActive || time === 0) return null;

  return (
    <CountdownContainer>
      <CountdownDisplay>
        {time}
      </CountdownDisplay>
    </CountdownContainer>
  );
} 