import React, { Component } from 'react'
import {solveSudoku} from './solveSudoku'
import './sudoku.css'
import {Button} from 'semantic-ui-react'

const GRID_SIZE = 9;
const ROW = GRID_SIZE;
const DIFFICULTY_VALUE = 90;
const COL = GRID_SIZE;
let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0]
]

export class Sudoku extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            sudoku:[
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0]
            ]
        }
    }

    componentDidMount() {
        this.fill3By3(grid)
    }

    isSafe(row, col, val){
        //Check in row and col
        for(let i=0, j=0; i<COL,j<ROW; i++, j++){
            if( (grid[row][i] === val && i !== col) || (grid[j][col] === val && j !== row) )
                return false;
        }
        //Check in the 3x3 grid
        var r = row - row % 3;
        var c = col - col % 3;
        for(let i=0; i<3; i++){
            for(let j=0; j<3; j++){
                if (grid[r + i][c + j] === val)
                    return false;
            }
        }
        return true;
    }

    fill3By3(grid) {
        for(let k=0; k<3; k++){
            let r=k*3, c=k*3; 
            for(let i=0; i<3; i++){
                for(let j=0; j<3; j++){
                    do{
                        var num = Math.floor(Math.random() * 10);
                    } while(!this.isSafe(r+i, c+j, num));
                    grid[r+i][c+j] = num;
                }
            }
        } 
        this.solveSudoku()
        this.removeRandomElement()      
    }

    solveSudoku(){
        for(let k=0; k<ROW; k++){
            for(let j=0; j<COL; j++){
                if(grid[k][j] === 0){
                    for(let i=1; i<=GRID_SIZE; i++){
                        if(this.isSafe(k, j, i)){
                            grid[k][j] = i;
                            if(this.solveSudoku(grid))
                                return true;
                            else
                                grid[k][j] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    removeRandomElement(){
        var k = DIFFICULTY_VALUE;
        for(let i=0; i<k; i++){
            var r = Math.floor(Math.random() * 9) % 10;
            var c = Math.floor(Math.random() * 9) % 10;
            grid[r][c] = 0;
        }
        this.setState({sudoku:grid})
    }

    visualizeSudoku() {
        let auxillaryGrid = grid
        let animations = solveSudoku(auxillaryGrid)
        console.log(animations)
        for (let i=0;i<=animations.length;i++){
            if (i===animations.length){
                setTimeout(() => {
                    this.animateSudoku();
                  }, 120 * i);
                  return;
            }
            let p = document.getElementById(`row-${animations[i].row}-col-${animations[i].col}`)
            setTimeout(() => {
                p.innerHTML = animations[i].value
                p.style.backgroundColor = `${animations[i].color}`
                }, i * 120);
        }
    }

    animateSudoku () {
        let cells = document.getElementsByClassName("sudoku-cell")
        for (let i=0;i<cells.length;i++){
            let k = cells[i].className += ' completed'
        }
    }
    

    render() {
        return (
            <div className="sudoku-grid">
                <Button onClick={() => this.visualizeSudoku()} >Visualize Sudoku Solver</Button>
                {grid.map((row,rowIdx) => {
                    return (
                        <tr key={rowIdx}>
                            {row.map((cell,cellIdx) => {
                                return (
                                    <td 
                                        className = {
                                            rowIdx%3===0 ? 
                                            (
                                                cellIdx%3===0 ? 
                                                    "sudoku-cell rowcell" 
                                                : 
                                                    (cellIdx+1)%3===0 ? "sudoku-cell rowright" : "sudoku-cell row"
                                            )
                                            : 
                                            (
                                                cellIdx%3===0 ?
                                                (
                                                    (rowIdx+1)%3===0 ? 
                                                        "sudoku-cell bottomcell" 
                                                    : 
                                                        rowIdx%3===0 ? "sudoku-cell crcc" : "sudoku-cell cell"
                                                )
                                                :
                                                ( 
                                                    (cellIdx+1)%3===0 ? 
                                                        (rowIdx+1)%3===0 ? "sudoku-cell crcc" : "sudoku-cell cc"
                                                    : 
                                                        (rowIdx+1)%3===0 ? "sudoku-cell cr" : "sudoku-cell"
                                                )
                                            )
                                        }
                                        id={`row-${rowIdx}-col-${cellIdx}`} 
                                        key={cellIdx}
                                    >
                                    {cell>0?cell:<span style={{opacity:"0"}}>{cell}</span>}</td>
                                )
                            })}
                        </tr>
                    )
                })}
            </div>
        )
    }
}

export default Sudoku
