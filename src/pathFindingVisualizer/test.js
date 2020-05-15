import React, { Component } from 'react'
import $ from 'jquery';
import Cells from './Cells';

export class Test extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
            edges:[],
            graph:[],
        }
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

    createNode = (col, row) => {
        return {
            col,
            row,
            val:0,
        }
    }

    componentDidMount() {
        const grid = this.getInitialGrid();
        this.setState({grid});
    }

    random(n) {
        return Math.floor(Math.random() * n);
    }
    
    goodRandom(x, y,R,C,grid) {
        let flag = true;
        for (let i=-4; i<5; i++) {
            for (let j=-4; j<5; j++) {
                let r = (x + i) % 19;
                let c = (y + j) % 49;
                
                if (x + i < 0) r *= -1;
                if (y + j < 0) c *= -1;
                if (grid[r][c].val > 0) flag = false;
            }
        }
        return flag;
    }

    createGraph() {
        // let grid = this.state.grid
        // let edges = this.state.edges
        // let graph = this.state.graph
        // grid[0][5].val = 5;
        // grid[1][9].val = 12;
        // grid[3][23].val = 16;
        // grid[1][3].val= -12;

        // grid[10][5].val = 5;
        // grid[13][9].val = 10;
        // grid[6][23].val = 56;
        // grid[8][19].val= -1;
        // edges.push([0,5,1,9])
        // edges.push([1,9,3,23])
        // edges.push([0,5,1,3])
        

        // edges.push([3,23,10,5])
        // edges.push([10,5,0,5])
        // edges.push([10,5,13,9])

        // edges.push([13,9,6,23])
        // edges.push([6,23,8,19])
        // edges.push([8,19,1,9])

        const R = 20;
        const C = 50;
        var grid = this.getInitialGrid();
        var elem = [];
        var edge = [];
        var den = 7; // No of nodes in graph
        var x1 = -1, y1 = -1;

        while(den) {
            let x = this.random(19);
            let y = this.random(49);
            if (this.goodRandom(x, y,R,C,grid)) {
                grid[x][y].val = this.random(19);
                elem.push([x, y]);
                x1 = x;
                y1 = y;
            }
            else {
                console.log("PLUS")
                den++;
            }
            den -=1
            console.log(den)
        }

        let k = 7; // No of edges
        while(k--) {
            let r = Math.floor(Math.random() * elem.length) % 23;
            let c = Math.floor(Math.random() * elem.length) % 23;
            if(r == c)
                k++;
            else { 
                edge.push([elem[r][0], elem[r][1], elem[c][0], elem[c][1]]);
            }
        }
            
        this.setState({
            grid:grid,
            edges:edge
        })
    }

    render() {
        const {grid,edges} = this.state;

        return (
            <div>
                <button onClick={() => this.createGraph()}>Generate graph</button>
                {grid.map((row, rowIdx) => {
                    return (
                    <tr key={rowIdx}>
                        {row.map((node, nodeIdx) => {
                        const {row, col, val} = node;
                        return (
                            <td><Cells 
                            key={nodeIdx}
                            col={col}
                            row={row}
                            val={val}
                            ></Cells></td>
                        );
                        })}
                    </tr>
                    );
                })}

                {edges.map((edge,idx) => {
                    var d1 = $(`#tnode-${edge[0]}-${edge[1]}`)
                    var d2 = $(`#tnode-${edge[2]}-${edge[3]}`)
                    var x1 = d1.offset().left + (d1.width()/2);
                    var y1 = d1.offset().top + (d1.height()/2);
                    var x2 = d2.offset().left + (d2.width()/2);
                    var y2 = d2.offset().top + (d2.height()/2);
                    return (
                        <svg key={idx} className="svg">
                            <line id={`line${idx}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{strokeWidth: "2px", stroke: "rgb(0, 0, 0)"}}></line>
                        </svg>
                    )
                })}

            </div>
        )
    }
}

export default Test
