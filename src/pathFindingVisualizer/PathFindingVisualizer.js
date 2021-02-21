import React, { Component } from 'react'
import {dijkstra, getNodesInShortestPathOrder} from '../Algorithms/dijkstra';
import './PathFindingVisualizer.css'
import Node from './Node/Node';
import { shortestPathBFS } from '../Algorithms/breadthFirstSearch';
import { BidirectionalSearch } from '../Algorithms/BidirectionalBFS';
import { depthFirstSearch } from '../Algorithms/depthFirstSearch';
import { AStarSearch } from '../Algorithms/AstarSearch';
import { createGraph } from '../Algorithms/ShortestPath';
import Sudoku from "../Sudoku/sudoku";
import SieveOfEratosthenes from "../SieveOfEratosthenes/SieveOfEratosthenes";
import TowerOfHanoi from "../TowerOfHanoi/TowerOfHanoi";
import Test from "../pathFindingVisualizer/test";
import { stairCase, recursivePattern } from '../MazeAndPattern/staticPattern.js';
// import { recursivePattern } from '../MazeAndPattern/recursivePattern.js';
import { Dropdown, Menu } from 'semantic-ui-react'


class PathFindingVisualizer extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startNodeDragged: false,
            startNodeRow:10,
            startNodeCol:15,
            endNodeRow:10,
            endNodeCol:35,
            endNodeDragged:false,
            stnode:true,
            ednode:true,
            lc:-1,
            lr:-1,
            viaNodes:[]
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
            isVia:false,
            previousNode:null,
            totalDistance:Infinity,
            heuristicDistance:Infinity,
        }
    }

    addViaNode = () => {
        document.getElementsByClassName('spAlgod')[0].disabled = false
        var btns = document.getElementsByClassName('Algod')
        for(let i=0;i<btns.length;i++) {
            btns[i].disabled = true
        }
        const {grid,viaNodes} = this.state
        if(viaNodes.length===9){
            return
        }
        let row = Math.floor(Math.random()*(19-2+1) + 2)
        let col = Math.floor(Math.random()*(52-2+1) + 2)
        while(grid[row][col].isWall===true || grid[row][col].isStart===true ||grid[row][col].isFinish===true ||grid[row][col].isVia===true) {
            row = Math.floor(Math.random()*(19-2+1) + 2)
            col = Math.floor(Math.random()*(52-2+1) + 2)
        }

        const lst = viaNodes
        lst.push(grid[row][col])
        const newGrid = grid.slice();
        const node = newGrid[row][col];
        const newNode = {
            ...node,
            isVia: true,
        }
        newGrid[row][col] = newNode;
        this.setState({
            grid:newGrid,
            viaNodes:lst
        })
    }

    getNewGridWithWallToggled = (grid, row, col) => {
        const {lc,lr} = this.state
        if (lc==col && lr==row){
            return grid;
        }
        else {
            this.setState({
                lc:col,
                lr:row
            })
        }
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
        else if(k[1] === 'node-via') {
            return;
        }
        else {
        // alert("mouseDown")
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid,mouseIsPressed:true});
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
        else if(k[1] === 'node-via'){
            return
        }
        else {
        const newGrid = this.getNewGridWithWallToggled(this.state.grid, row, col);
        this.setState({grid: newGrid});
        }
    }

    handleMouseUp() {
        if (this.state.stnode){
            this.setState({startNodeDragged: false,stnode:true,mouseIsPressed: false})
        }
        if (this.state.ednode) {
            this.setState({endNodeDragged: false,ednode:true,mouseIsPressed: false})
        }
        this.setState({mouseIsPressed: false,lr:-1,lc:-1});
    }

    clearBoard() {
        let {grid} = this.state
        for(let row = 0; row< 21;row++){
            for(let col = 0; col< 54;col++){
                let p = document.getElementById(`node-${grid[row][col].row}-${grid[row][col].col}`)
                if(p.className === 'node node-shortest-path' || p.className === 'node node-visited-finish' || p.className === 'node node-visited-start' || p.className === 'node node-visited') {
                    if(p.className === 'node node-visited-start') {
                        p.className = 'node node-start'
                    }

                    else if(p.className === 'node node-visited-finish') {
                        p.className = 'node node-finish'
                    }

                    else{
                        p.className = 'node'
                    }
                }
            }
        }
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        this.clearBoard()
        const r = this.state.startNodeRow
        const c = this.state.startNodeCol
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length && nodesInShortestPathOrder!==false) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            if(node.isVia) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-via';
            } else if(node.isStart) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-start';
            } else if(node.isFinish) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-finish';
            } else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited';
            }

          }, 10 * i);
        }
    }

    animateViaPath(nodesToBeAnimated, nodesInShortestPathOrder) {
        this.clearBoard()
        const r = this.state.startNodeRow;
        const c = this.state.startNodeCol;
        console.log(nodesInShortestPathOrder);

        let colors = ['blue', 'red', 'yellow', 'orange', 'green', 'cyan','blue', 'red', 'yellow', 'orange', 'green', 'cyan','blue', 'red', 'yellow', 'orange', 'green', 'cyan'];

        for (let j = 0; j < nodesToBeAnimated.length; j++) {
            let visitedNodesInOrder = nodesToBeAnimated[j];

            for(let i=0; i<=visitedNodesInOrder.length; i++) {
                
                if (j === nodesToBeAnimated.length - 1 && i === visitedNodesInOrder.length && nodesInShortestPathOrder!==false) {
                    console.log("Entered")
                    setTimeout(() => {
                        this.animateShortestPath(nodesInShortestPathOrder);
                    }, 10 * i);
                    return;
                }
                if (i !== visitedNodesInOrder.length)
                {
                    setTimeout(() => {
                        const node = visitedNodesInOrder[i];
                        if(node.isVia) {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-visited-via';
                        } else if(node.isStart) {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-visited-start';
                        } else if(node.isFinish) {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-visited-finish';
                        } else {
                            document.getElementById(`node-${node.row}-${node.col}`).className =
                            'node node-visited';
                        }

                    }, 10 * i);
                }
            }
        }
    }

    animateShortestPath(nodesInShortestPathOrder) {
        const r = this.state.startNodeRow
        const c = this.state.startNodeCol
        if(nodesInShortestPathOrder.length === 0){
            return
        }
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            if(node.isVia) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-via';
            } else if(node.isStart) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-start';
            } else if(node.isFinish) {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-visited-finish';
            } else {
                document.getElementById(`node-${node.row}-${node.col}`).className =
                'node node-shortest-path';
            }
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

    visualizeBreadthFirstSearch() {
        const {grid} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {animations,path} = shortestPathBFS(grid, startNode, finishNode);
        this.animateDijkstra(animations, path);
    }

    VisualizeBidirectionalSearch() {
        const {grid} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {animations,path} = BidirectionalSearch(grid, startNode, finishNode);
        this.animateDijkstra(animations, path);
    }

    visualizeDepthFirstSearch() {
        const {grid} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {animations,path} = depthFirstSearch(grid, startNode, finishNode);
        this.animateDijkstra(animations, path);
    }

    visualizeAStar() {
        const {grid} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {animations,path} = AStarSearch(grid, startNode, finishNode)
        this.animateDijkstra(animations, path);
    }

    getShortestPath() {
        const {grid,viaNodes} = this.state
        const startNode = grid[this.state.startNodeRow][this.state.startNodeCol];
        const finishNode = grid[this.state.endNodeRow][this.state.endNodeCol];
        const {animations,path} = createGraph(grid, viaNodes, startNode, finishNode)
        console.log(animations)
        this.animateViaPath(animations, path);
    }

    staticPattern(pattern) {
        const grid = this.state.grid;
        for(let i=0; i<pattern.length; i++) {
            let x = pattern[i].split(":");
            grid[parseInt(x[0])][parseInt(x[1])].isWall = true;
            setTimeout(() => {
                document.getElementById(`node-${parseInt(x[0])}-${parseInt(x[1])}`).className =
                'node node-wall';
            }, 25*i);
        }
    }

    randomPattern() {
        const grid = this.state.grid;
        for(let i=0; i<400; i++) {
            let x = Math.floor(Math.random()*21), y = Math.floor(Math.random()*53);
            if((x == this.state.startNodeRow && y == this.state.startNodeCol) ||
                (x == this.state.endNodeRow && y == this.state.endNodeCol)) {
                i--;
                continue;
            }
            grid[x][y].isWall = true;
            setTimeout(() => {
                document.getElementById(`node-${x}-${y}`).className =
                'node node-wall';
            }, 25*i);
        }
    }

    staticRecursivePattern(pattern) {
        const grid = this.state.grid;
        for(let i=0; i<pattern.length; i++) {
            let x = pattern[i].split(":");
            grid[parseInt(x[0])][parseInt(x[1])].isWall = true;
            setTimeout(() => {
                document.getElementById(`node-${parseInt(x[0])}-${parseInt(x[1])}`).className =
                'node node-wall';
            }, 25*i);
        }
    }

    state = {}
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const {grid, mouseIsPressed} = this.state;
        const { activeItem } = this.state;
        return (
            <>  
                <Menu stackable inverted>
                    <Menu.Item header>
                        Algorithm Visualiser
                    </Menu.Item>

                    <Dropdown item text='Algorithms'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.visualizeDijkstra()}>
                                Visualize Dijkstra
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.visualizeDijkstra()}>
                                Visualize Dijkstra's Algorithm
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.visualizeAStar()}>
                                Visualize a* Algorithm
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.visualizeBreadthFirstSearch()}>
                                Visualize Breadth First Search Algorithm
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.VisualizeBidirectionalSearch()}>
                                Visualize Bidirectional Search Algorithm
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.visualizeDepthFirstSearch()}>
                                Visualize Depth First Search Algorithm
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    
                    <Dropdown item text='Maze and Pattern'>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => this.staticPattern(stairCase)}>
                                Staircase Pattern
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.randomPattern()}>
                                Random Pattern
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => this.staticRecursivePattern(recursivePattern)}>
                                Recursive Pattern
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Menu.Item
                        name='shortestpath'
                        active={activeItem === 'shortestpath'}
                        onClick={() => this.getShortestPath()} 
                        className="spAlgod"
                    >
                        Shortest Path
                    </Menu.Item>

                    <Menu.Item
                        name='addViaNode'
                        active={activeItem === 'addViaNode'}
                        onClick={() => this.addViaNode()}
                    >
                        Add Via Nodes
                    </Menu.Item>

                    <Menu.Item
                        name='clearBoard'
                        active={activeItem === 'clearBoard'}
                        onClick={() => this.clearBoard()}
                    >
                        Clear Board
                    </Menu.Item>

                    <Menu.Item
                        name='TowerOfHanoi'
                        active={activeItem === 'TowerOfHanoi'}
                    >
                        <a href="/towerofhanoi">Tower Of Hanoi</a>
                    </Menu.Item>

                    <Menu.Item
                        name=''
                        active={activeItem === 'sudoku'}
                    >
                        <a href="/sudoku">Sudoku</a>
                    </Menu.Item>

                </Menu>
                <div className="grid">
                {grid.map((row, rowIdx) => {
                    return (
                    <tr key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {row, col, isFinish, isStart, isWall, isVia} = node;
                        return (
                            <td><Node
                            key={nodeIdx}
                            col={col}
                            isFinish={isFinish}
                            isStart={isStart}
                            isWall={isWall}
                            isVia={isVia}
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
