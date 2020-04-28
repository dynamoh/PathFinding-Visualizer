import React, { Component } from 'react'
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/dijkstra';
import {astarsearch} from '../Algorithms/astar'
import './PathFindingVisualizer.css'
import Node from './Node/Node';


class PathFindingVisualizer extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startNodeDragged: false,
            startNodeRow:10,
            startNodeCol:15,
            endNodeRow:8,
            endNodeCol:35,
            endNodeDragged:false,
            stnode:true,
            ednode:true,
        };
    }

    getInitialGrid = () => {
        const grid = [];
        for(let row = 0; row< 21;row++){
            const curr = [];
            for(let col = 0; col< 54;col++){
                curr.push(this.createNode(col, row))
            }
            grid.push(curr)
        }
        return grid
    }

    getMazeGrid = () => {
        const grid = this.state.grid;
        for(let row = 0; row< 21;row++){
            for(let col = 0; col< 54;col++){
                if(row === col){
                    grid[row][col].isWall = true
                    this.setState({grid});
                }
            }    
        }    
    }

    createNode = (col, row) => {
        const str = this.state.startNodeRow;
        const stc = this.state.startNodeCol;
        const edr = this.state.endNodeRow;
        const edc = this.state.endNodeCol;
        return {
            col,
            row,
            isStart: row === str && col === stc,
            isFinish: row === edr && col === edc,
            distance: Infinity,
            isVisited:false,
            isWall:false,
            previousNode:null,
            totalDistance:Infinity,
            heuristicDistance:Infinity,
        }
    }

    getNewGridWithWallToggled = (grid, row, col) => {
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        }
        newGrid[row][col] = newNode;
        return newGrid;
    }

    getToggledStartNode = (grid, row, col,start) => {
        console.log(this.state.startNodeDragged)
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
        }
        if (start)
        {
            newNode.isStart = !node.isStart
        } 
        else 
        {
            newNode.isFinish =  !node.isFinish
        }
        
        if(newNode.isStart===true){
            this.setState({
                startNodeDragged:false,
                stnode:true
            })
        } else if(newNode.isFinish===true) {
            this.setState({
                endNodeDragged:false,
                ednode:true
            })
        } else {
            if (start) {
                this.setState({
                    startNodeDragged:true,
                    stnode:false
                })
            } else {
                this.setState({
                    endNodeDragged:true,
                    ednode:false
                })
            }
        }
        newGrid[row][col] = newNode;
        if(start){
            this.setState({
                startNodeRow:row,
                startNodeCol:col,
            })
        } else {
            this.setState({
                endNodeRow:row,
                endNodeCol:col,
            })
        }
        return newGrid;
    }


    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({grid});
    }

    handleMouseDown(row, col) {
        const ele = document.getElementById(`node-${row}-${col}`).className;
        const k = ele.split(" ");
        if(k[1] === 'node-start' || this.state.startNodeDragged){    
            this.setState( prevNode => ({
                grid: newGrid, 
                startNodeDragged: true,
            }));
            const newGrid = this.getToggledStartNode(this.state.grid, row, col,true);
            return;
        } 
        else if(k[1] === 'node-finish' || this.state.endNodeDragged ) {
            this.setState( prevNode => ({
                grid: newGrid, 
                endNodeDragged: true,
            }));
            const newGrid = this.getToggledStartNode(this.state.grid, row, col,false);
            return;
        }
        else {
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid, mouseIsPressed: true});
        }
    }

    handleMouseEnter(row, col) {
        if (!this.state.mouseIsPressed) return;
        const ele = document.getElementById(`node-${row}-${col}`).className;
        const k = ele.split(" ");
        if(this.state.startNodeDragged){
            const newGrid = this.getToggledStartNode(this.state.grid, row, col,true);
            this.setState({grid: newGrid});
            return;
        } else if(this.state.endNodeDragged){
            const newGrid = this.getToggledStartNode(this.state.grid, row, col,false);
            this.setState({grid: newGrid});
            return;
        }
        else {
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
        }
    }

    handleMouseUp() {
        if (this.state.stnode){
            this.setState({startNodeDragged: false,stnode:true})
        } 
        if (this.state.ednode) {
            this.setState({endNodeDragged: false,ednode:true})
        }
        this.setState({mouseIsPressed: false});
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 100 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            
            document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
          }, 100 * i);
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
          }, 50 * i);
        }
    }
    
    visualizeDijkstra() {
        const {grid} = this.state;
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    visualizeAStar() {
        const {grid} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {path,animation} = astarsearch(grid, startNode, finishNode);
        // console.log(path)
        // console.log(animation)
        if(path === false){
            alert("No Path Exists !!")
            return 
        }
        this.animateDijkstra(animation, path);
    }

    render() {
        const {grid, mouseIsPressed} = this.state;

        return (
            <>
                <button onClick={() => this.visualizeDijkstra()}>
                Visualize Dijkstra's Algorithm
                </button>
                <button onClick={() => this.visualizeAStar()}>
                Visualize a* Algorithm
                </button>
                <button onClick={() => this.getMazeGrid()}>Generate Maze</button>
                <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                    <tr key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {row, col, isFinish, isStart, isWall} = node;
                        return (
                            <td><Node
                            key={nodeIdx}
                            col={col}
                            isFinish={isFinish}
                            isStart={isStart}
                            isWall={isWall}
                            mouseIsPressed={mouseIsPressed}
                            onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                            onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                            onMouseUp={() => this.handleMouseUp()}
                            row={row}
                            totalDistance={Infinity}
                            heuristicDistance={Infinity}></Node></td>
                        );
                        })}
                    </tr>
                    );
                })}
                </div>
            </>
        )
    }
}

export default PathFindingVisualizer
