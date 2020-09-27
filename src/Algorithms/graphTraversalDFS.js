const animations = []

export function GraphTraversalDFS(adjList,source,grid) {
    let visited = []
    for(let i=0;i<grid.length;i++) {
        let k = []
        for(let j=0;j<grid[i].length;j++) {
            k.push(false)
        }
        visited.push(k)
    }
    GraphTraversalDFSUtil(adjList,source,grid,visited)
    return animations
}

function GraphTraversalDFSUtil(adjList,source,grid,visited) {

    let node = source
    visited[node.row][node.col] = true
    animations.push([node.row,node.col])
    let ky = node.row.toString() + '-' + node.col.toString()
    let adjNodes = adjList.get(ky)
    for(let i=0;i<adjList.get(ky).length;i++) {
        if(!visited[adjNodes[i].row][adjNodes[i].col]) {
            animations.push([node.row,node.col,adjNodes[i].row,adjNodes[i].col])
            GraphTraversalDFSUtil(adjList,adjNodes[i],grid,visited)
        }
    }

}