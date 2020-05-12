import React from 'react';
import './App.css';
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from './routes';

function App() {
  return (
    <div className="App">
      <Router>
        <BaseRouter />
      </Router>
    </div>
  );
}

export default App;
