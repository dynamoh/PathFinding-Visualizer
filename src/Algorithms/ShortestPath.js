import { AStarSearch } from "./AstarSearch"


export function createGraph(grid, viaNodes, start, finish) {
    let graph = []
    console.log(viaNodes)
    for (let i=0;i<viaNodes.length+1;i++){
        graph.push([])
    }
    graph[0].push(0)
    for(let i=0;i<viaNodes.length;i++) {
        graph[0].push(getDistance(start,viaNodes[i]))
    }
    for(let i=1;i<=viaNodes.length;i++){
        graph[i].push(getDistance(viaNodes[i-1],start))
        for(let j=1;j<=viaNodes.length;j++){
            graph[i].push(getDistance(viaNodes[i-1],viaNodes[j-1]))
        }
    }

    let min_path = getShortestPath(graph, viaNodes, start, finish)
    let ans = getPath(grid, start, finish, min_path, viaNodes)
    return ans
}

function getDistance(node1, node2) {
    const x1 = node1.row
    const x2 = node2.row
    const y1 = node1.col
    const y2 = node2.col

    const hValue = Math.abs(x2-x1) + Math.abs(y2-y1)
    return hValue
}

function getShortestPath(graph, viaNodes, start, finish) {
    let vertex = []
    let s = 0
    for(let i=0;i<viaNodes.length;i++){
        vertex.push(i+1)
    }
    let min_value = 10000
    let min_path = []
    for(let i=0;i<vertex.length;i++){
        min_path.push(vertex[i])
    }
    while(true) {
        let currentPathWeight = 0
        let k = s
        for(let i=0;i<vertex.length;i++){
            currentPathWeight += graph[k][vertex[i]]
            k = vertex[i]
        }
        
        if(currentPathWeight < min_value) {
            console.log(currentPathWeight,min_value,vertex)
            min_value = currentPathWeight
            for(let i=0;i<vertex.length;i++){
                min_path[i] = vertex[i]
            }
        }
        if (!next_permutation(vertex)){
            break
        } 
    }
    console.log(min_path)
    return min_path
}

function next_permutation(vertex) {
    let n = vertex.length
    let i = n-1
    while (i > 0 && vertex[i-1] >= vertex[i]){
        i-=1
    }

    if(i<=0){
        return false
    }

    let j = n-1
    while (vertex[j] <= vertex[i-1]){
        j -= 1
    } 
  
    let temp = vertex[i-1]
    vertex[i-1] = vertex[j]
    vertex[j] = temp
  
    j = n-1
  
    while (i < j) {
        temp = vertex[i];
        vertex[i] = vertex[j];
        vertex[j] = temp;
        i++;
        j--;
    }
    return true
}

function getPath(grid, start, finish, min_path, viaNodes) {
    const final_animations = []
    const final_path = []
    let {animations, path} =  AStarSearch(grid,start,viaNodes[min_path[0]-1])
    for(let i=0;i<animations.length;i++) {
        final_animations.push(animations[i])
    }
    for(let i=0;i<path.length;i++) {
        final_path.push(path[i])
    }

    for(let l=0;l<min_path.length-1;l++) {
        let p =  AStarSearch(grid,viaNodes[min_path[l]-1],viaNodes[min_path[l+1]-1])
        if(p.path.length == 0) {
            if(l==0) {
                p =  AStarSearch(grid,start,viaNodes[min_path[l+1]-1])
            } else {
                p =  AStarSearch(grid,viaNodes[min_path[l-1]-1],viaNodes[min_path[l+1]-1])
            }
        }
        for(let i=0;i<p.animations.length;i++) {
            final_animations.push(p.animations[i])
        }
        for(let i=0;i<p.path.length;i++) {
            final_path.push(p.path[i])
        }
    }
    let p =  AStarSearch(grid,viaNodes[min_path[min_path.length-1]-1],finish)
    if(p.path.length == 0) {
        return {animations:final_animations, path:[]}
    }
    for(let i=0;i<p.animations.length;i++) {
        final_animations.push(p.animations[i])
    }
    for(let i=0;i<p.path.length;i++) {
        final_path.push(p.path[i])
    }
    return {animations:final_animations, path:final_path}
}