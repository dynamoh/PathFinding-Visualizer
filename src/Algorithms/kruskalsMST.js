export function KruskalsMST(adjList,source,grid,edges) {
    const animations = []
    edges.sort((a,b) => a[4]-b[4]);
    console.log(edges)

    let parent = new Map()
    let rank = new Map()
    let lstlen = 0;
    for(let key of adjList.keys()) {
        lstlen += 1
        rank.set(key,0)
        parent.set(key,key)
    }
    console.log(parent)
    let e = 0;
    let i = 0 ;
    let result = []
    console.log(e,lstlen)
    while(e < lstlen-1) {
        let smallestEdge = edges[i];
        animations.push([smallestEdge[0],smallestEdge[1]])
        animations.push([smallestEdge[0],smallestEdge[1],smallestEdge[2],smallestEdge[3]])
        animations.push([smallestEdge[2],smallestEdge[3]])
        i = i+1;
        let ky1 = smallestEdge[0].toString() + '-' + smallestEdge[1].toString()
        let ky2 = smallestEdge[2].toString() + '-' + smallestEdge[3].toString()
        let x = FindParent(parent,ky1)
        let y = FindParent(parent,ky2)
        console.log(ky1,x)
        console.log(ky2,y)
        if(x!=y) {
            e += 1
            result.push(smallestEdge)
            UnionParent(parent, rank, x, y)
        }
    }
    return {result:result,animations:animations}
}

function FindParent(parent,key) {
    if(parent.get(key) == key) {
        return key
    } 
    return FindParent(parent,parent.get(key))
}

function UnionParent(parent, rank, x, y) {
    let xroot = FindParent(parent,x)
    let yroot = FindParent(parent,y)
    
    if(rank.get(xroot) > rank.get(yroot)) {
        parent.set(yroot,xroot)
    }
    else if(rank.get(xroot) < rank.get(yroot)) {
        parent.set(xroot,yroot)
    }
    else {
        parent.set(yroot,xroot)
        let prevRank = rank.get(xroot)
        rank.set(xroot,prevRank+1)
    }
}