import React, { Component } from 'react'
import $ from 'jquery';
import Cells from './Cells';
import { GraphTraversalBFS } from '../Algorithms/graphTraversalBFS';
import { GraphTraversalDFS } from '../Algorithms/graphTraversalDFS';
import { KruskalsMST } from '../Algorithms/kruskalsMST';

export class Test extends Component {

    constructor() {
        super();
        this.state = {
            grid: [],
            edges:[],
            graph:[],
            called:false,
            adjList:{},
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
        this.setState({grid},() => this.createGraph());
    }

    createNode = (col, row) => {
        return {
            col,
            row,
            val:0,
        }
    }

    randomIntFromInterval = (min,max) => {
        return Math.floor(Math.random()*(max-min+1) + min)
    }

    updateEdge(edge) {
        for(let i=0;i<edge.length;i++){
            edge[i].push(this.randomIntFromInterval(-80,90))
        }
    }

    componentDidMount() {
        this.getInitialGrid();
    }

    componentDidUpdate() {
 
    }

    async createGraph() {
        let grid = this.state.grid
        let edge = this.state.edges
        let adjList = new Map()
        
        grid[1][15].val =1; //done
        grid[6][43].val =2; //done
        grid[2][31].val =3; //done
        grid[3][7].val  =4; //done
        grid[7][35].val =5; //done
        grid[8][21].val =6; //done
        grid[10][10].val=7; //done
        grid[10][28].val=8; //done
        grid[10][45].val=9; //done
        grid[13][35].val=10; //done
        grid[15][16].val=11; //done
        grid[17][21].val = 12; //done
        grid[18][47].val = 13; //done
        grid[7][16].val = 14; //done
        grid[11][1].val = 15; //done
        grid[17][2].val = 16; //done
        grid[19][12].val = 17; //done
        grid[16][32].val = 18; //done
        grid[7][25].val = 19; //done
        grid[19][36].val= 20; //done
        grid[16][42].val  = 21; //done
        grid[20][27].val = 22;

        adjList.set('11-1',[grid[3][7],grid[17][2]])
        adjList.set('1-15',[grid[2][31],grid[3][7],grid[8][21],grid[7][16]])
        adjList.set('6-43',[grid[2][31],grid[7][35],grid[10][45]])
        adjList.set('2-31',[grid[1][15],grid[6][43],grid[7][35],grid[10][28],grid[7][25]])
        adjList.set('3-7',[grid[1][15],grid[10][10],grid[11][1]])
        adjList.set('7-35',[grid[6][43],grid[2][31]])
        adjList.set('8-21',[grid[1][15],grid[7][25],grid[15][16],grid[17][21]])
        adjList.set('10-10',[grid[3][7],grid[15][16],grid[17][2]])
        adjList.set('10-28',[grid[2][31],grid[17][21],grid[13][35],grid[16][32]])
        adjList.set('10-45',[grid[6][43],grid[18][47],grid[13][35],grid[16][42]])
        adjList.set('13-35',[grid[10][28],grid[10][45],grid[16][42]])

        adjList.set('15-16',[grid[8][21],grid[10][10],grid[17][21],grid[7][16]])
        adjList.set('17-21',[grid[8][21],grid[10][28],grid[15][16],grid[19][12],grid[20][27]])
        adjList.set('18-47',[grid[10][45],grid[19][36]])
        adjList.set('7-16',[grid[1][15],grid[15][16]])
        adjList.set('17-2',[grid[11][1],grid[19][12]])
        adjList.set('19-12',[grid[17][2],grid[17][21],grid[20][27]])
        adjList.set('16-32',[grid[10][28],grid[19][36],grid[20][27]])
        adjList.set('7-25',[grid[2][31],grid[8][21]])
        adjList.set('19-36',[grid[18][47],grid[16][32],grid[20][27]])
        adjList.set('16-42',[grid[10][45],grid[13][35]])
        adjList.set('20-27',[grid[17][21],grid[19][12],grid[16][32],grid[19][36]])
        
        console.log(adjList)

        edge.push([16, 42, 13, 35]);
        edge.push([19, 12, 20, 27]);
        edge.push([19, 36, 20, 27]);
        edge.push([16, 32, 20, 27]);
        edge.push([17, 21, 20, 27]);
        edge.push([17, 21, 15, 16]);
        edge.push([10, 10, 17, 2]);
        edge.push([19, 36, 16, 32]);
        edge.push([17, 21, 19, 12]);
        edge.push([3, 7, 11, 1]);
        edge.push([17, 2, 11, 1]);
        edge.push([17, 2, 19, 12]);
        edge.push([16, 32, 10, 28]);
        edge.push([7, 25, 8, 21]);
        edge.push([7, 25, 2, 31]);
        edge.push([1, 15, 2, 31]);
        edge.push([1, 15, 8, 21]);
        edge.push([1, 15, 7, 16]);
        edge.push([15, 16, 7, 16]);
        edge.push([1, 15, 3, 7]);
        edge.push([3, 7, 10, 10]);
        edge.push([8, 21, 17, 21]);
        edge.push([2, 31, 10, 28]);
        edge.push([15, 16, 8, 21]);
        edge.push([2, 31, 7, 35]);
        edge.push([6, 43, 7, 35]);
        edge.push([6, 43, 10, 45]);
        edge.push([13, 35, 10, 45]);
        edge.push([17, 21, 10, 28]);
        edge.push([2, 31, 6, 43]);
        edge.push([10, 10, 15, 16]);
        edge.push([13, 35, 10, 28]);
        edge.push([10, 45, 18, 47]);
        edge.push([18, 47, 19, 36]);
        edge.push([10, 45, 16, 42]);

        this.updateEdge(edge)
        
        await this.setState({
            grid:grid,
            edges:edge,
            adjList:adjList,
        },() => {
            this.setState({
                called:true
            })
        })
    }

    animateGraph(animations) {
        for (let i = 0; i < animations.length; i++) {
            setTimeout(() => {
              const node = animations[i];
                if(node.length === 2) {
                        document.getElementById(`tnode-${node[0]}-${node[1]}`).className = 'treeNode node-visited-tree';
                } else {
                    if(document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`) === null) {
                        document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.stroke = 'rgb(0,0,0)';
                        document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.strokeWidth = '2.2px';
                    } else {
                        document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.stroke = 'rgb(0,0,0)';
                        document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.strokeWidth = '2.2px';
                    }
                }
            }, 300 * i);
          }
    }

    animateGraphMST(animations,result) {
        for (let i = 0; i <= animations.length; i++) {
            if(i == animations.length) {
                setTimeout(() => {
                    this.visualizeMST(result)
                }, 300 * i);
                return;
            }
            setTimeout(() => {
              const node = animations[i];
                if(node.length === 2) {
                        document.getElementById(`tnode-${node[0]}-${node[1]}`).className = 'treeNode node-visited-tree';
                } else {
                    if(document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`) === null) {
                        document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.stroke = 'rgb(0,0,0)';
                        document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.strokeWidth = '2.2px';
                    } else {
                        document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.stroke = 'rgb(0,0,0)';
                        document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.strokeWidth = '2.2px';
                    }
                }
            }, 300 * i);
        }
    }

    visualizeMST(result) {
        const {edges} = this.state
        for (let i = 0; i <= result.length; i++) {
            if(i == result.length) {
                setTimeout(() => {
                    for(let i =0;i < edges.length; i++) {
                        const node = edges[i];
                        if(document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`) === null) {
                            if(document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.strokeWidth !== '3.3px '){
                                document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.stroke = 'rgb(255,255,255)';
                                document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.strokeWidth = '0px';
                                document.getElementById(`text-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.fontSize = '0px';
                            }
                        } else {
                            if(document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.strokeWidth !== '3.3px') {
                                document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.stroke = 'rgb(255,255,255)';
                                document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.strokeWidth = '0px';
                                document.getElementById(`text-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.fontSize = '0px';
                            }
                        }
                    }
                },100*i)
                return;
            }
            setTimeout(() => {
                const node = result[i];
                if(document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`) === null) {
                    document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.stroke = 'rgb(0,255,0)';
                    document.getElementById(`line-${node[2]}-${node[3]}-${node[0]}-${node[1]}`).style.strokeWidth = '3.3px';
                } else {
                    document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.stroke = 'rgb(0,255,0)';
                    document.getElementById(`line-${node[0]}-${node[1]}-${node[2]}-${node[3]}`).style.strokeWidth = '3.3px';
                }
            }, 100 * i);
        }
    }

    visualizeBFSTraversal() {
        const {adjList,grid} = this.state
        const source = grid[11][1]
        const animations = GraphTraversalBFS(adjList,source,grid)
        this.animateGraph(animations)
        console.log(animations)
    }

    visualizeDFSTraversal() {
        const {adjList,grid} = this.state
        const source = grid[11][1]
        const animations = GraphTraversalDFS(adjList,source,grid)
        console.log(animations)
        this.animateGraph(animations)
    }

    visualizeKruskalsMST() {
        const {adjList,grid,edges} = this.state
        const source = grid[11][1]
        const {result,animations} = KruskalsMST(adjList,source,grid,edges)
        console.log(animations)
        this.animateGraphMST(animations,result)
    }

    render() {
        const {grid,edges,called} = this.state;

        return (
            <div>
                {/* <button onClick={() => this.createGraph()}>Generate graph</button> */}
                <button onClick={() => this.visualizeBFSTraversal()}>Visualize BFS traversal</button>
                <button onClick={() => this.visualizeDFSTraversal()}>Visualize DFS traversal</button>
                <button onClick={() => this.visualizeKruskalsMST()}>Visualize Kruskals MST</button>
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

                {called === true ? 
                    edges.map((edge,idx) => {
                        var d1 = $(`#tnode-${edge[0]}-${edge[1]}`)
                        var d2 = $(`#tnode-${edge[2]}-${edge[3]}`)
                        var x1 = d1.offset().left + (d1.width()/2);
                        var y1 = d1.offset().top + (d1.height()/2);
                        var x2 = d2.offset().left + (d2.width()/2);
                        var y2 = d2.offset().top + (d2.height()/2);
                        var x3 = (x1+x2)/2 + 2*(d1.width()/3)
                        var y3 = (y1+y2)/2 - (d1.width()/2)
                        return (
                            <svg key={idx} className="svg">
                                <line className="svg-line" text="20" id={`line-${edge[0]}-${edge[1]}-${edge[2]}-${edge[3]}`} style={{strokeWidth:"0.5px",stroke:"red"}} x1={x1} y1={y1} x2={x2} y2={y2}></line>
                                <text x={x3} y={y3} id={`text-${edge[0]}-${edge[1]}-${edge[2]}-${edge[3]}`} font-family="sans-serif"  font-size="12px" fill="black">{edge[4]}</text>
                            </svg>
                        )
                    })
                :
                    <svg className="svg"></svg>
                }

            </div>
        )
    }
}

export default Test
