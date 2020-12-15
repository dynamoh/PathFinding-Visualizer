import React, { Component } from 'react'
import './Node.css'

export default class Node extends Component {
    render() {
      const {
        col,
        isFinish,
        isStart,
        isWall,
        isVia,
        onMouseDown,
        onMouseEnter,
        onMouseUp,
        row,
        totalDistance,
        heuristicDistance,
      } = this.props;
      const extraClassName = isFinish
        ? 'node-finish'
        : isStart
        ? 'node-start'
        : isWall
        ? 'node-wall'
        : isVia 
        ? 'node-via' 
        : ''
  
      return (
        <div
          id={`node-${row}-${col}`}
          className={`node ${extraClassName}`}
          onMouseDown={() => onMouseDown(row, col)}
          onMouseEnter={() => onMouseEnter(row, col)}
          onMouseUp={() => onMouseUp()}></div>
      );
    }
}
