// let recursivePattern = [];
// const startNodeRow = 10, startNodeCol = 15, endNodeRow = 10, endNodeCol = 35; // need to implement a dynamic way
// function borderWalls(recursivePattern) {
// 	const R = 20, C = 53;
// 	for (let i=0; i<53; i++) recursivePattern.push("0:"+i);
// 	for (let i=1; i<53; i++) recursivePattern.push("20:"+i);
// 	for (let i=1; i<20; i++) recursivePattern.push("53:"+i);
// 	for (let i=1; i<20; i++) recursivePattern.push(i+":0");
// }

// function recursiveDivisionMaze(recursivePattern, rowStart, rowEnd, colStart, colEnd, orientation) {
// 	if (orientation == "horizontal"){
// 		let possibleRows = [];
// 		for (let number = rowStart; number <= rowEnd; number += 2) {
// 		  possibleRows.push(number);
// 		}
// 		let possibleCols = [];
// 		for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
// 		  possibleCols.push(number);
// 		}
// 		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
// 		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
// 		let currentRow = possibleRows[randomRowIndex];
// 		let colRandom = possibleCols[randomColIndex];
// 		for(let i=0; i<20; i++) {
// 			for(let j=0; j<53; j++) {
// 				if (i === currentRow && j !== colRandom && j >= colStart - 1 && j <= colEnd + 1) {
// 					if ((i != rowStart && j != colStart) || (i != rowEnd && j != colEnd)) {
// 						recursivePattern.push(i+":"+j);
// 					}        
// 				}
// 			}
// 		}
// 		if (currentRow - 2 - rowStart > colEnd - colStart) {
// 			recursiveDivisionMaze(recursivePattern, rowStart, currentRow - 2, colStart, colEnd, orientation);
// 		} else {
// 			recursiveDivisionMaze(recursivePattern, rowStart, currentRow - 2, colStart, colEnd, "vertical");
// 		}
// 		if (rowEnd - (currentRow + 2) > colEnd - colStart) {
// 			recursiveDivisionMaze(recursivePattern, currentRow + 2, rowEnd, colStart, colEnd, orientation);
// 		} else {
// 			recursiveDivisionMaze(recursivePattern, currentRow + 2, rowEnd, colStart, colEnd, "vertical");
// 		}
// 	}  
// 	else {
// 		let possibleCols = [];
// 		for (let number = colStart; number <= colEnd; number += 2) {
// 		  	possibleCols.push(number);
// 		}
// 		let possibleRows = [];
// 		for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
// 		  	possibleRows.push(number);
// 		}
// 		let randomColIndex = Math.floor(Math.random() * possibleCols.length);
// 		let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
// 		let currentCol = possibleCols[randomColIndex];
// 		let rowRandom = possibleRows[randomRowIndex];
// 		for(let i=0; i<20; i++) {
// 			for(let j=0; j<53; j++) {
// 				if (j === currentCol && i !== rowRandom && i >= rowStart - 1 && i <= rowEnd + 1) {
// 					if ((i != rowStart && j != colStart) || (i != rowEnd && j != colEnd)) {
// 						recursivePattern.push(i+":"+j);
// 					}        
// 				}
// 			}
// 		}
// 		if (rowEnd - rowStart > currentCol - 2 - colStart) {
// 		  recursiveDivisionMaze(recursivePattern, rowStart, rowEnd, colStart, currentCol - 2, "horizontal");
// 		} else {
// 		  recursiveDivisionMaze(recursivePattern, rowStart, rowEnd, colStart, currentCol - 2, orientation);
// 		}
// 		if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
// 		  recursiveDivisionMaze(recursivePattern, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
// 		} else {
// 		  recursiveDivisionMaze(recursivePattern, rowStart, rowEnd, currentCol + 2, colEnd, orientation);
// 		}
// 	}  
// }
// borderWalls(recursivePattern);
// recursiveDivisionMaze(recursivePattern, 0, 20, 0, 53, "vertical");
// export { recursivePattern };