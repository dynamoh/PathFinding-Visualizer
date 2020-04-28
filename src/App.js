import React from 'react';
import './App.css';
import PathFindingVisualizer from './pathFindingVisualizer/PathFindingVisualizer';
import Sudoku from './Sudoku/sudoku';
import TowerOfHanoi from './TowerOfHanoi/TowerOfHanoi';

function App() {
  return (
    <div className="App">
      <PathFindingVisualizer />
      <Sudoku />
      <TowerOfHanoi />
    </div>
  );
}

export default App;
