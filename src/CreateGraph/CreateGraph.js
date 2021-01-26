import React, { Component } from 'react'
import './create-graph.css'
import {Form, Radio, Segment} from 'semantic-ui-react'
import {Graph} from '@dagrejs/graphlib';
import $ from 'jquery';

export class CreateGraph extends Component {

    constructor(props) {
        super();
        this.state = {
            nodes: [],
            addNode: false,
            value: 'addNode',
            graph: new Graph(),
            fromNode: '',
            toNode: '',
        };
    }

    getInitialNodes = () => {
        let nodes = [];
        for (let row = 0; row < 25; row++) {
        let curr = [];
            for (let col = 0; col < 60; col++) {
                curr.push(this.createNode(row, col))
            }
            nodes.push(curr)
        }
        return nodes
    }

    componentDidMount() {
        const nodes = this.getInitialNodes();
        this.setState({nodes});
    }
    
    randomIntFromInterval = (min,max) => {
        return Math.floor(Math.random()*(max-min+1) + min)
    }

    createNode(row,col) {
        var newNode = {
            row:row,
            col:col,
            val:0,
        }
        // var nodes = this.state.node;
        // nodes.push(nodes);
        // this.setState({
        //     nodes:nodes
        // });
        return newNode
    }
    
    toggleAddNode() {
        this.setState(
           (prevState) => ({
               addNode: !prevState.addNode
           
           })
        )
    }

    handleValueChange(e, node) {
        let nodes = this.state.nodes
        if (e.target.value > 99 || e.target.value < -99)
            return ;
        nodes[node.row][node.col].val = e.target.value
        this.setState({nodes})
    }

    handleClick(val) {
        let [row, col] = [(parseInt(val.split('-')[0])), (parseInt(val.split('-')[1]))]
        let nodes = this.state.nodes
        let graph = this.state.graph
        let fromNode = this.state.fromNode
        let toNode = this.state.toNode
        const inputElement = document.getElementById("inp-"+val);
        const nodeElement = document.getElementById(val);

        if (this.state.value === 'addNode') {
            if (nodeElement.className === 'graph-node graph-node-visible')
                return ;
            graph.setNode(val, val);
            nodes[row][col].val = this.randomIntFromInterval(-99, 99)
            this.setState({nodes})
            nodeElement.className += " graph-node-visible";
            inputElement.disabled = false;
        }
        else if (this.state.value === 'delNode') {
            fromNode = ''
            this.setState({fromNode})
            graph.removeNode(val)
            nodes[row][col].val = 0
            inputElement.disabled=true
            nodeElement.className -= " graph-node-visible";    
        }
        else if (this.state.value === 'addEdge') {
            const graphArea = document.getElementsByClassName("draw-graph")[0]
            graphArea.style.cursor = "pointer";
            inputElement.style.color = "red";
            if (graph._nodeCount <= 1) {
                alert('Atleast 2 nodes are needed to create an edge')
                return ;
            }
            if (!graph.hasNode(val)) 
                return ;
            if (fromNode !== '') {
                nodeElement.style.opacity=1;
                graph.setEdge(fromNode, val);
                fromNode = ''
                console.log(graph.edges())
                this.setState({fromNode})
            }
            else {
                nodeElement.style.opacity=1;
                fromNode = val
                this.setState({fromNode})
                console.log(fromNode)
            }

        }   
        else 
            return ;
    }

    handleChange = (e, { value }) => {
        let element = $('.graph-node-visible');
        if (value === 'addEdge') {
            for(let i=0; i<element.length; i++) {
                setTimeout(() => {
                    element[i].style.opacity = 0.65;
                }, 100 * i);
            }

        }
        else {
            for(let i=0; i<element.length; i++) {
                element[i].style.opacity = 1;
            }
        }
        this.setState({ value })
    }
    addNode(e) {
        console.log(e.clientX, e.clientY);
    }
    state = {}
    render() {
        const nodes = this.state.nodes;
        const graph = this.state.graph;
        return (
            <>
                <div className="create-graph-container">
                    <Form>
                        <div className="controls">
                            <Form.Field>
                                <Radio slider
                                    label='Add Nodes'
                                    name='radioGroup'
                                    value='addNode'

                                    checked={this.state.value === 'addNode'}
                                    onChange={this.handleChange}
                                />    
                            </Form.Field>
                            <Form.Field>
                                <Radio slider
                                    label='Delete Node'
                                    name='radioGroup'
                                    value='delNode'

                                    checked={this.state.value === 'delNode'}
                                    onChange={this.handleChange}
                                />    
                            </Form.Field>
                            <Form.Field>
                                <Radio slider
                                    label='Add Edges'
                                    name='radioGroup'
                                    value='addEdge'
                                    checked={this.state.value === 'addEdge'}
                                    onChange={this.handleChange}
                                />    
                            </Form.Field>
                            <Form.Field>
                                <Radio slider
                                    label='Animate'
                                    name='radioGroup'
                                    value='animate'
                                    checked={this.state.value === 'animate'}
                                    onChange={this.handleChange}
                                />    
                            </Form.Field>
                        </div>
                    </Form>
                    <div onClick={(e) => this.addNode(e)} className="draw-graph display-flex">
                        <tbody>
                        {nodes.map(node => {
                            return (
                                <tr>
                                    {node.map(n => {
                                        return (
                                            <td
                                                id={`${n.row}-${n.col}`}
                                                className="graph-node"
                                                onClick={() => this.handleClick(`${n.row}-${n.col}`)}
                                            >
                                                <input 
                                                    id={`inp-${n.row}-${n.col}`} 
                                                    className="graph-node-input" 
                                                    type="text" 
                                                    disabled="true" 
                                                    value={n.val === 0 ? '' : n.val}
                                                    onChange={(e) => this.handleValueChange(e, n)}
                                                >
                                                </input>
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                        </tbody>
                    </div>
                </div>
                    {graph.edges().map((edge, idx) => {
                        let d1 = $(`#${edge.v}`)
                        let d2 = $(`#${edge.w}`)
                        console.log(d1)
                        let x1 = d1.offset().left + (d1.width()/2);
                        let y1 = d1.offset().top + (d1.height()/2);
                        let x2 = d2.offset().left + (d2.width()/2);
                        let y2 = d2.offset().top + (d2.height()/2);
                        return (
                            <svg key={idx} className="svg">
                                <line className="svg-line" text="20" id={`line-${edge.v}-${edge.w}`} style={{strokeWidth:"1.5px",stroke:"red"}} x1={x1} y1={y1} x2={x2} y2={y2}></line>
                                {/* <text x={x3} y={y3} id={`text-${edge[0]}-${edge[1]}-${edge[2]}-${edge[3]}`} font-family="sans-serif"  font-size="12px" fill="black">{edge[4]}</text> */}
                            </svg>
                        )
                    })}
            </>
        )
    }
}

export default CreateGraph
