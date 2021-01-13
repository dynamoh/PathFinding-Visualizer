import React, { Component } from 'react'
import './create-graph.css'

export class CreateGraph extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
            nodes: []
        }
    }

    componentDidMount() {

    }
    
    createNode(x,y) {
        var newNode = {
            x:x,
            y:y
        }
        var nodes = this.state.node;
        nodes.push(nodes);
        this.setState({
            nodes:nodes
        });
    }

    addNode(e) {
        console.log(e.clientX, e.clientY);
        var sp = `<span className="node">hgg</span>`;
    }

    render() {
        const nodes = this.state;
        return (
            <div className="create-graph-container">
                <button>Add Node</button>
                <div onClick={(e) => this.addNode(e)} className="draw-graph">
                    
                </div>
            </div>
        )
    }
}

export default CreateGraph
