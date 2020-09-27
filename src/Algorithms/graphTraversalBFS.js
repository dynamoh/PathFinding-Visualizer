export function GraphTraversalBFS(adjList,source,grid) {
    let q = []
    let visited = []
    for(let i=0;i<grid.length;i++) {
        let k = []
        for(let j=0;j<grid[i].length;j++) {
            k.push(false)
        }
        visited.push(k)
    }

    let animations = []

    q.push(source)
    while(q.length > 0) {
        let curr = q.shift()
        animations.push([curr.row,curr.col])
        let ky = curr.row.toString() + '-' + curr.col.toString()
        // console.log(ky,adjList,adjList.get("11-1"))
        for(let i=0;i<adjList.get(ky).length;i++) {
            let node = adjList.get(ky)
            if(!visited[node[i].row][node[i].col]) {
                q.push(node[i])
                animations.push([curr.row,curr.col,node[i].row,node[i].col])
                animations.push([node[i].row,node[i].col])
                visited[node[i].row][node[i].col] = true
            }
        }
    }

    return animations

}