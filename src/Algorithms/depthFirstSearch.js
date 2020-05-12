const animations = []

export function depthFirstSearch(grid,start,finish) {
    let Visited = []
    let Parent = []
    for(let i=0;i<21;i++) {
        let k = []
        let p =[]
        for (let j=0;j<54;j++) {
            k.push(false)
            p.push(-1)
        }
        Visited.push(k)
        Parent.push(p)
    }
    let ans = depthFirstSearchUtil(grid,start.row,start.col,Visited,Parent,finish)
    if(ans.row != -1){
        const path = traceShortestPath(start,finish,Parent)
        return {animations:animations,path:path}
    } else {
        return {animations:animations,path:[]}
    }
}

function depthFirstSearchUtil(grid,row,col,visited,parent,finish) {
    animations.push(grid[row][col])
    visited[row][col] = true
    if(row == finish.row && col==finish.col){
        return {row:row,col:col,parent:parent}
    }
    console.log(row,col)
    const psrow = [0,0,1,-1]
    const pscol = [1,-1,0,0]

    for(let i=0;i<4;i++) {
        let a = row + psrow[i]
        let b = col + pscol[i]
        if (isValid(grid,a,b,visited)) {
            parent[a][b] = grid[row][col]
            let k = depthFirstSearchUtil(grid,a,b,visited,parent,finish)
            if(k.row!=-1){
                return k
            }
        }
    }

    return {row:-1,col:-1,parent:-1}
    
}

function isValid(grid,row,col,visited){
    if (row>=0 && row<grid.length && col>=0 && col<grid[0].length && !visited[row][col] && !grid[row][col].isWall) {
        return true
    }
    return false
}

function traceShortestPath(start,finish,parent) {
    console.log(parent)
    const path = []
    let i = finish
    path.push(i)
    while(i.row != start.row || i.col!=start.col) {
        let j = parent[i.row][i.col]
        path.push(j)
        i = j
    }
    path.reverse()
    return path
}