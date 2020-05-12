const animations = []

export function AStarSearch(grid,start,finish){
    let path = AStarUtil(grid,start,finish)
    return {animations:animations,path:path}
}

function AStarUtil(grid,start,finish) {
    let openList = []
    let closedList = []

    for(let i=0;i<grid.length;i++){
        let kk = []
        for(let j=0;j<grid[i].length;j++){
            kk.push(false)
        }
        closedList.push(kk)
    }

    let start_node = {
        parent:null,
        positionRow:start.row,
        positionCol:start.col,
        f:0.0,
        g:0.0,
        h:0.0,
    }
    let end_node = {
        parent:null,
        positionRow:finish.row,
        positionCol:finish.col,
        f:0.0,
        g:0.0,
        h:0.0,
    }

    openList.push(start_node)
    while( openList.length>0) {
        let curr = openList[0]
        let currIndex = 0
        for(let i=0;i<openList.length;i++){
            if (openList[i].f<curr.f) {
                curr = openList[i]
                currIndex = i
            }
        }
        openList.splice(currIndex,1)
        closedList[curr.positionRow][curr.positionCol] = true
        animations.push(grid[curr.positionRow][curr.positionCol])
        let row = [0,0,1,-1]
        let col = [1,-1,0,0]
        for (let i=0;i<4;i++){
            let node = {
                parent:curr,
                positionRow:curr.positionRow+row[i],
                positionCol:curr.positionCol+col[i],
                f:0.0,
                g:0.0,
                h:0.0,
            }
            if(isValid(node,grid)) {
                
                if(checkDestination(node,end_node)){
                    console.log(node)
                    animations.push(grid[node.positionRow][node.positionCol])
                    let path = tracePath(grid,node,start)
                    return path
                }

                if(closedList[node.positionRow][node.positionCol] === false) {
                    node.g = curr.g + 1.0
                    node.h = getHeuristicValue(node,end_node)
                    node.f = node.g + node.h
                    let nodeFound = false
                    for(let p=0;p<openList.length;p++){
                        if(openList[p].positionRow === node.positionRow && openList[p].positionCol === node.positionCol){
                            nodeFound = true
                            if(openList[p].f>node.f) {
                                openList[p] = node
                            }
                        }
                    }
                    if(!nodeFound){
                        openList.push(node)
                    }
                }

            }
        }

    }
    console.log("not found")
    return []
}

function getHeuristicValue(node1,node2) {
    const x1 = node1.positionRow
    const x2 = node2.positionRow
    const y1 = node1.positionCol
    const y2 = node2.positionCol

    const hValue = Math.abs(x2-x1) + Math.abs(y2-y1)
    return hValue
}

function checkDestination(curr,finish) {
    if(curr.positionRow === finish.positionRow && curr.positionCol === finish.positionCol) {
        return true
    }
    return false
}

function isValid(curr,grid) {
    if(curr.positionRow>=0 && curr.positionRow<grid.length && curr.positionCol>=0 && curr.positionCol<grid[0].length && !grid[curr.positionRow][curr.positionCol].isWall) {
        return true
    }
    return false
}

function tracePath(grid,endNode,start) {
    let path = []
    let curr = endNode
    while(start.row !== curr.positionRow || start.col !== curr.positionCol) {
        path.push(grid[curr.positionRow][curr.positionCol])
        curr = curr.parent
    }
    path.push(grid[curr.positionRow][curr.positionCol])
    path.reverse()
    return path
}