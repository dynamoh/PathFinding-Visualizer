let predecessor = []

function breadthFirstSearch(grid, startNode, finishNode) {
    let visited = []
    let animations = []
    for(let i=0;i<grid.length;i++){
        let temp = []
        let pred = []
        for(let j=0;j<grid[i].length;j++){
            temp.push(false)
            pred.push(-1)
        }
        visited.push(temp)
        predecessor.push(pred)
    }
    let queue = []
    queue.push(startNode)
    visited[startNode.row][startNode.col] = true
    while(queue.length>0) {
        let curr = queue.shift()
        animations.push(curr)
        let row = [1,-1,0,0]
        let col = [0,0,1,-1]
        for(let i=0;i<4;i++) {
            if (isValid(grid,curr.row,curr.col,row[i],col[i]) && !visited[curr.row + row[i]][curr.col + col[i]]){
                queue.push(grid[curr.row + row[i]][curr.col + col[i]])
                predecessor[curr.row + row[i]][curr.col + col[i]] = curr
                visited[curr.row + row[i]][curr.col + col[i]] = true
                if(curr.row + row[i] === finishNode.row && curr.col + col[i] === finishNode.col){
                    return {status:true,animations:animations}
                }
            }
        }
    }
    return {status:false,animations:animations}
}

function isValid(grid,x,y,r,c) {
    if(x+r>=0 && x+r<grid.length && y+c>=0 && y+c<grid[0].length){
        if (grid[x+r][y+c].isWall===false){
            return true
        }
    }
    return false
}

export function shortestPathBFS(grid, startNode, finishNode) {
    let ret = breadthFirstSearch(grid, startNode, finishNode)
    if( ret.status === false ){
        return {animations:ret.animations,path:false}
    }

    let path = []
    let crawl = finishNode
    path.push(crawl)
    while(predecessor[crawl.row][crawl.col]!==-1){
        path.push(predecessor[crawl.row][crawl.col])
        crawl = predecessor[crawl.row][crawl.col]
    }
    path.reverse()
    return {animations:ret.animations,path:path}
}