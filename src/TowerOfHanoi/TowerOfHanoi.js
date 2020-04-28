import React, { Component } from 'react'

const styles = {
    post: {
      fill: 'none',
      stroke: 'black',
      strokeWidth: 10,
    },
};


export class TowerOfHanoi extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             numberOfDisks:8
        }
    }

    // solveTowerOfHanoi(n, source, destination, auxillary, animations){
    //     if(n == 0){
    //         return ;
    //     }
    //     else {
    //         solveTowerOfHanoi(n-1, source, auxillary, destination);
    //         animations.push({disk:n,source:source,destination:destination,auxillary:auxillary})
    //         // document.write("Move " + n + " from " + source + " to " + destination + " using " +  auxillary + "</br>");
    //         solveTowerOfHanoi(n-1, auxillary, destination, source);
    //     }
    // }
    
    render() {
        return (
            <div>
                
            </div>
        )
    }
}

export default TowerOfHanoi
