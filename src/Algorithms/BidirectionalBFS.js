const animations = []

function isValid(grid,row,col,visited){
    if (row>=0 && row<grid.length && col>=0 && col<grid[0].length && !visited[row][col] && !grid[row][col].isWall) {
        return true
    }
    return false
}

function getNeighbours(grid,queue,visited,parent) {
    let current = queue.shift()
    animations.push(current)
    let row = [0,0,1,-1]
    let col = [-1,1,0,0]
    for(let i=0;i<4;i++){
        let a = current.row + row[i]
        let b = current.col + col[i]
        if(isValid(grid,a,b,visited)){
            queue.push(grid[a][b])
            visited[a][b] = true
            parent[a][b] = current
        }
    }
}

function checkIntersection(sVisited,tVisited) {
    for (let i=0;i<21;i++) {
        for (let j=0;j<54;j++) {
            if(sVisited[i][j] === true && tVisited[i][j] === true){
                return {row:i,col:j}
            }
        }
    }
    return {row:-1,col:-1}
}


export function BidirectionalSearch (grid,start,finish) {
    let sVisited = []
    let tVisited = []
    let sParent = []
    let tParent = []
    for(let i=0;i<21;i++) {
        let k = []
        let p = []
        let ss = []
        let ee = []
        for (let j=0;j<54;j++) {
            k.push(false)
            ss.push(false)
            p.push(-1)
            ee.push(-1)
        }
        sVisited.push(k)
        tVisited.push(ss)
        sParent.push(p)
        tParent.push(ee)
    }

    let sQueue = []
    let tQueue = []

    sVisited[start.row][start.col] = true
    tVisited[finish.row][finish.col] = true
    sQueue.push(start)
    tQueue.push(finish)

    while(sQueue.length > 0 && tQueue.length > 0) {

        getNeighbours(grid,sQueue,sVisited,sParent)
        getNeighbours(grid,tQueue,tVisited,tParent)
        let itn = checkIntersection(sVisited,tVisited)
        if (itn.row!=-1 && itn.col!=-1) {
            animations.push(grid[itn.row][itn.col])
            return getShortestPath(grid,start,finish,sParent,tParent,itn) 
        }
    }
    return {animations:animations,path:[]}
}

function getShortestPath(grid,start,finish,sParent,tParent,intersection) {
    let path = []
    let i = intersection
    path.push(grid[i.row][i.col])
    while(i.row!=start.row || i.col!=start.col) {
        let a = sParent[i.row][i.col]
        path.push(grid[a.row][a.col])
        i = a
    }
    path.reverse()
    i = intersection
    console.log(tParent,i)
    while(i.row!=finish.row || i.col!=finish.col) {
        let a = tParent[i.row][i.col]
        path.push(grid[a.row][a.col])
        i = a
    }
    return {animations:animations,path:path}
}