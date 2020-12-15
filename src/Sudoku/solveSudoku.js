const animations = []
let visits = [
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false, false]
]


function find_empty_location(arr,l){
    for (let row =0;row<9;row++){
        for (let col = 0;col<9;col++){
            if(arr[row][col]===0){
                l[0]=row 
                l[1]=col 
                return {status:true,l:l}
            }
        }
    }
    return {status:false,l:l}
}

function used_in_row(arr,row,num){
    for (let i=0;i<9;i++){
        if(arr[row][i]===num) {
            return true
        }
    }
    return false
}


function used_in_col(arr,col,num){
    for (let i=0;i<9;i++){
        if(arr[i][col]===num) {
            return true
        }
    }
    return false
}


function used_in_box(arr,row,col,num){
    for (let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            if(arr[i+row][j+col]===num) {
                return true
            }
        }
    }
    return false
}

function check_location_is_safe(arr,row,col,num) {
    if(used_in_row(arr,row,num) || used_in_col(arr,col,num) || used_in_box(arr,row - row%3,col - col%3,num)){
        return false
    }
    return true
}

function solveSudokuUtil(arr) {
    let l = [0,0]
    let retObj = find_empty_location(arr,l)
    if( retObj.status === false){
        return true
    }
    let row= retObj.l[0] 
    let col= retObj.l[1] 

    for (let num=1;num<10;num++) {
        if(check_location_is_safe(arr,row,col,num)){
            arr[row][col]=num 
            if(visits[row][col]===true){
                animations.push({row:row,col:col,value:num,visited:true,color:"red"})
                animations.push({row:row,col:col,value:num,visited:true,color:"lightgreen"})
            } else {
                visits[row][col] = true
                animations.push({row:row,col:col,value:num,visited:true,color:"lightgreen"})
            }
            if(solveSudokuUtil(arr)){ 
                return true
            }
            arr[row][col] = 0
            animations.push({row:row,col:col,value:0,visited:true,color:"red"})
        }
    }
              
    return false
}

export function solveSudoku (arr) {
    solveSudokuUtil(arr)
    return animations
}