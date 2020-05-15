import React, { Component } from 'react'
import './Cells.css'

export default class Cells extends Component {
    render() {
      const {
        col,
        row,
        val
      } = this.props;
      
      return (
        <>
        {val === 0 ?
        <div
          id={`tnode-${row}-${col}`}
          className={`tnode`}
          ></div> :
          <div
          id={`tnode-${row}-${col}`}
          className={`treeNode`}
          >{val}</div>
        }
        </>
      );
    }
}
