import React, { Component } from 'react'
import './SieveOfEratosthenes.css'
import { getPrimesSoe } from './visualizeSoe'
import { Button } from 'semantic-ui-react'

export class SieveOfEratosthenes extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            grid: [],
            gridVal:[],
            size:450
        }
    }

    componentDidMount() {
        this.getGrid()
    }

    getGrid() {
        let p = []
        let q = []
        let cnt = 1
        for(let i=1;i<16;i++){
            let g = []
            let f = []
            for(let j=0;j<30;j++){
                g.push(cnt)
                f.push(true)
                cnt += 1
            }
            p.push(g)
            q.push(f)
        }
        this.setState({grid:p,gridVal:q})
    }

    setPrimes(grid) {
        let p =1
        grid[0][0]=0
        for(let i=0;i<15;i++){
            for(let j=0;j<30;j++){
                if(grid[i][j]){
                    setTimeout(() => {
                        let cell = document.getElementById(`row-${i}-col-${j}`)
                        console.log(i,j)
                        cell.style.backgroundColor = "red"
                        cell.style.color = "white"
                    },p*20)
                    p+=1
                }
            }
        }
    }

    visualizePrimeSoe() {
        const gv = this.state.gridVal
        const {animations,grid} = getPrimesSoe(gv)
        this.setState({gridVal:grid})
        for(let i = 0;i<=animations.length;i++){
            if(i === animations.length) {
                setTimeout(() => {
                    this.setPrimes(grid)
                }, i*30)
                return
            }
            setTimeout(() => {
                let cell = document.getElementById(`row-${animations[i].row}-col-${animations[i].col}`)
                console.log(animations[i].row,animations[i].col)
                cell.style.backgroundColor = "lightgreen"
            }, i*30)
        }
    }

    
    render() {
        const {grid} = this.state
        return (
            <center>
            <div class="soe-grid">
              <Button onClick={() => this.visualizePrimeSoe()}>Visualize SOE</Button>
              {grid.map((row,rowIdx) => {
                    return (
                        <tr key={rowIdx}>
                            {row.map((cell,cellIdx) => {
                                return (
                                    <td className="cell-soe"
                                        id={`row-${rowIdx}-col-${cellIdx}`} 
                                        key={cellIdx}
                                    >
                                    <span>{cell}</span></td>
                                )
                            })}
                        </tr>
                    )
                })}  
            </div>
            </center>
        )
    }
}

export default SieveOfEratosthenes
