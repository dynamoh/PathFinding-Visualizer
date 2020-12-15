export function getPrimesSoe(grid) {
    let animations = []
    let i = 2
    while(i*i <= 450) {
        if(grid[parseInt((i-1)/30)][(i-1)%30] === true){
            for(let j=i*i;j<=450;j+=i){
                animations.push({row:parseInt((j-1)/30),col:(j-1)%30})
                grid[parseInt((j-1)/30)][(j-1)%30] = false
            }
        }
        i+=1
    }
    return {animations:animations,grid:grid}
}