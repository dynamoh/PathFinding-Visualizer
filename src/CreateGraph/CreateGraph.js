import React, { Component } from 'react'
import './create-graph.css'
import { Form, Radio, Popup } from 'semantic-ui-react'
import { Graph } from '@dagrejs/graphlib';
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
            for (let col = 0; col < 49; col++) {
                curr.push(this.createNode(row, col))
            }
            nodes.push(curr)
        }
        return nodes
    }

    componentDidMount() {
        const nodes = this.getInitialNodes();
        this.setState({ nodes });
    }

    randomIntFromInterval = (min, max) => {
        let rand_val = Math.floor(Math.random() * (max - min + 1) + min)
        return (rand_val === 0 ? 10 : rand_val)
    }

    createNode(row, col) {
        var newNode = {
            row: row,
            col: col,
            val: 0,
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
        if (e.target.value > 99 || e.target.value < -99 || e.target.value === 0)
            return;
        nodes[node.row][node.col].val = e.target.value
        this.setState({ nodes })
    }

    handleClick(val) {
        let [row, col] = [(parseInt(val.split('-')[0])), (parseInt(val.split('-')[1]))]
        let nodes = this.state.nodes
        let graph = this.state.graph
        let fromNode = this.state.fromNode
        let fromNode_tmp = fromNode
        const nodeElement = document.getElementById(val);

        if (this.state.value === 'addNode') {
            if (nodeElement.className === 'graph-node graph-node-visible')
                return;
            graph.setNode(val, val);
            nodes[row][col].val = this.randomIntFromInterval(-99, 99)
            this.setState({ nodes })
            nodeElement.className += " graph-node-visible";
        }

        else if (this.state.value === 'delNode') {
            fromNode = ''
            this.setState({ fromNode })
            graph.removeNode(val)
            nodes[row][col].val = 0
            nodeElement.className -= " graph-node-visible";
        }

        else if (this.state.value === 'addEdge') {
            const graphArea = document.getElementsByClassName("draw-graph")[0]
            if (graph._nodeCount <= 1) {
                alert('Atleast 2 nodes are needed to create an edge')
                return;
            }
            if (!graph.hasNode(val))
                return;
            if (fromNode !== '') {
                graph.setEdge(fromNode, val);
                // nodeElement.style.backgroundColor='green';
                // setTimeout(() => {
                //     document.getElementById(fromNode_tmp).style.animation = 'bg-fade-anim 2s ease-in';
                //     nodeElement.style.animation=' bg-fade-anim 2s ease-in';
                //     document.getElementById(fromNode_tmp).style.backgroundColor = 'rgb(55, 212, 55)';
                //     nodeElement.style.backgroundColor=' rgb(55, 212, 55)';
                // }, 2000);
                fromNode = ''
                this.setState({ fromNode })
            }
            else {
                fromNode = val
                this.setState({ fromNode })
                // nodeElement.style.backgroundColor='green';
            }

        }
        else
            return;
    }

    handleChange = (e, { value }) => {
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
                                    onChange={this.handleChange}
                                    checked={this.state.value === 'addNode'}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Radio slider
                                    label='Delete Node'
                                    name='radioGroup'
                                    value='delNode'
                                    onChange={this.handleChange}
                                    checked={this.state.value === 'delNode'}
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
                                                <Popup
                                                    on="click"
                                                    positionFixed
                                                    position='bottom'
                                                    trigger={
                                                        <td
                                                            id={`${n.row}-${n.col}`}
                                                            className={n.val === 0 ? 'graph-node' : 'graph-node graph-node-visible'}
                                                            onClick={() => this.handleClick(`${n.row}-${n.col}`)}
                                                        >
                                                            {n.val === 0 ? '' : n.val}  
                                                        </td>
                                                    }
                                                    disabled={n.val === 0 || this.state.value !== 'addNode'}
                                                >
                                                    <input
                                                        id={`inp-${n.row}-${n.col}`}
                                                        className="graph-node-input"
                                                        type="text"
                                                        value={n.val === 0 ? '' : n.val}
                                                        onChange={(e) => this.handleValueChange(e, n)}
                                                        autoFocus
                                                    >
                                                    </input>
                                                </Popup>
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
                    let x1 = d1.offset().left + (d1.width() / 2);
                    let y1 = d1.offset().top + (d1.height() / 2);
                    let x2 = d2.offset().left + (d2.width() / 2);
                    let y2 = d2.offset().top + (d2.height() / 2);
                    return (
                        <svg key={idx} className="svg">
                            <line className="svg-line" text="20" id={`line-${edge.v}-${edge.w}`} style={{ strokeWidth: "1.5px", stroke: "red" }} x1={x1} y1={y1} x2={x2} y2={y2}></line>
                            {/* <text x={x3} y={y3} id={`text-${edge[0]}-${edge[1]}-${edge[2]}-${edge[3]}`} font-family="sans-serif"  font-size="12px" fill="black">{edge[4]}</text> */}
                        </svg>
                    )
                })}
            </>
        )
    }
}

export default CreateGraph
