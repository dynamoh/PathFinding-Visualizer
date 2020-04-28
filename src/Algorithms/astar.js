let NodesVisitedInorder = []

export function astarsearch(grid,startNode,finishNode){
    let getPath = getDestination(grid,startNode,finishNode)
    return {path:getPath, animation:NodesVisitedInorder}
}


function getDestination(grid,startNode,finishNode) {
    let start_node = {
        parent:null,
        positionRow:startNode.row,
        positionCol:startNode.col,
        f:0.0,
        g:0.0,
        h:0.0,
    }
    let end_node = {
        parent:null,
        positionRow:finishNode.row,
        positionCol:finishNode.col,
        f:0.0,
        g:0.0,
        h:0.0,
    }
    let open_list = []
    let closed_list= []
    NodesVisitedInorder.push(grid[start_node.positionRow][start_node.positionCol])
    open_list.push(start_node)
    while (open_list.length > 0){
        let current_node = open_list[0]
        let current_index = 0
        
        for(let i=0;i<open_list.length;i++){
            if (open_list[i].f < current_node.f){
                current_node = open_list[i]
                current_index = i
            }
        }
        open_list.splice(current_index,1)
        closed_list.push(current_node)
        if (current_node.positionRow === finishNode.row && current_node.positionCol === finishNode.col){
            const path = []
            let current = current_node
            while (current !== null){
                path.push(grid[current.positionRow][current.positionCol])
                current = current.parent
            }
            path.reverse()
            return path
        } 
        let children = []
        let availPos = [[0, -1], [0, 1], [-1, 0], [1, 0]]
        for(let i=0;i<4;i++){
            let nodePosition = [current_node.positionRow + availPos[i][0], current_node.positionCol + availPos[i][1]]
            if (nodePosition[0] > (grid.length - 1) || nodePosition[0] < 0 || nodePosition[1] > (grid[grid.length - 1].length - 1) || nodePosition[1] < 0){
                continue
            }
            if (grid[nodePosition[0]][nodePosition[1]].isWall){
                continue
            }
            children.push({
                parent:current_node,
                positionRow:nodePosition[0],
                positionCol:nodePosition[1],
                f:0.0,
                g:0.0,
                h:0.0,
            })
        }
        for(let i =0;i<children.length;i++){
            let counter = false
            for(let j=0;j<closed_list.length;j++){
                if(children[i].positionRow === closed_list[j].positionRow && children[i].positionCol === closed_list[j].positionCol) {
                    counter = true
                }
            }
            if(counter === true){
                continue
            }
            children[i].g = current_node.g + 1
            children[i].h = ((children[i].positionRow - end_node.positionRow) ** 2) + ((children[i].positionCol - end_node.positionCol) ** 2)
            children[i].f = children[i].g + children[i].h
            
            for(let k = 0;k<open_list.length;k++){
                if (children[i].positionRow === open_list[k].positionRow && children[i].positionCol === open_list[k].positionCol  && children[i].g > open_list[k].g){
                    counter = true
                }
            }
            if(counter === true){
                continue
            }
            NodesVisitedInorder.push(grid[children[i].positionRow][children[i].positionCol])
            open_list.push(children[i])
        }
    }
    return false
}

