export function PrimsMST(adjList,source,grid,edges) {
    const animations=[]
   
    let V = adjList.size
    let parent = new Array(V)
    let result = []
    let matrix = new Array(V)
    let key = new Array(V)
    let mstSet = new Array(V)
    let coord = new Array(V)
    coord[1]    = [1,15];
    coord[2]    = [6,43];
    coord[3]    = [2,31];
    coord[4]    = [3,7];
    coord[5]    = [7,35];
    coord[6]    = [8,21];
    coord[7]    = [10,10];
    coord[8]    = [10,28];
    coord[9]    = [10,45];
    coord[10]   = [13,35];
    coord[11]   = [15,16];
    coord[12]   = [17,21];
    coord[13]   = [18,47];
    coord[14]   = [7,16];
    coord[15]   = [11,1];
    coord[16]   = [17,2];
    coord[17]   = [19,12];
    coord[18]   = [16,32];
    coord[19]   = [7,25];
    coord[20]   = [19,36];
    coord[21]   = [16,42];
    coord[22]   = [20,27];
    for(let i=0; i<V; i++) {
        matrix[i] = new Array(V)
        for(let j=0; j<V; j++)
            matrix[i][j] = 0
    }
    for(let i=0; i<edges.length; i++) {
        let x1 = edges[i][0];
        let y1 = edges[i][1];
        let X = grid[x1][y1].val;
        let x2 = edges[i][2];
        let y2 = edges[i][3];
        let Y = grid[x2][y2].val;
        let w = edges[i][4];
        matrix[X-1][Y-1] = w;
        let t = [[x2,y2,x1,y1,w]]
        matrix[Y-1][X-1] = w;
    }
    for(let i=0; i<V; i++) {
        key[i] = 9999;
        mstSet[i] = false;
    }
    key[0] = 0;
    parent[0] = -1;
    for(let count = 0; count<V-1; count++) {
        let u = minKey(key, mstSet, V);
        mstSet[u] = true;
        for(let v=0; v<V; v++) {
            if(matrix[u][v] !== 0 && mstSet[v] === false && matrix[u][v] < key[v]){
                animations.push(coord[u+1])
                animations.push([coord[u+1][0], coord[u+1][1], coord[v+1][0], coord[v+1][1]])
                animations.push(coord[v+1])
                parent[v] = u;
                key[v] = matrix[u][v];
            }
        }
    }
    console.log(parent)
    for(let i=1; i<V; i++) {
        result.push([ coord[parent[i]+1][0], coord[parent[i]+1][1], coord[i+1][0], coord[i+1][1],  matrix[i][parent[i]] ])
    }
    return {result:result,animations:animations}
}

// MinKey 
    function minKey(key, mstSet, V) {
        let min = 9999;
        let min_index=0;
        for(let v=0; v<V; v++) {
            if(mstSet[v] === false && key[v] < min){
                min = key[v];
                min_index=v;
            }
        }
        return min_index;
    }