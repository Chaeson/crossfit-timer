// src/App.js
import React from 'react';
import './App.css';
import { TimerProvider } from './contexts/TimerContext';
import Timer from './components/Timer';

function App() {
  return (
    <TimerProvider>
      <div className="App">
        <header className="App-header">
          <h1>W.O.D. 타이머</h1>
        </header>
        <main>
          <Timer />
        </main>
      </div>
    </TimerProvider>
  );
}

export default App;
