function solveSudoku(matrix) {


    let cube = createCube(matrix);
    addGhostValues(cube);

    return cubeToArray(loop(cube));
}

module.exports = solveSudoku;

function createCube(array){
    var cube = {
        all:new Array(81),
        gorizontalArray:[[],[],[],[],[],[],[],[],[]],
        verticalArray:[[],[],[],[],[],[],[],[],[]],
        squareArray:[[],[],[],[],[],[],[],[],[]],
    };

    array.forEach(function(ar,i) {
        ar.forEach(function (value, j) {
            var block = createBlock(value,i,j, cube);
            cube.all.push(block);
            cube.gorizontalArray[i].push(block);
            cube.verticalArray[j].push(block);
            cube.squareArray[block.sNumber].push(block);
        });
    });
    return cube;
}

function createBlock(value,i,j,cubeObject) {

    var block = {
        value:value,
        gNumber:i,
        vNumber:j,
        sNumber: Math.trunc(i/3)*3+Math.trunc(j/3),
        ghostValues:new Array(9),
        cube:cubeObject,
    };
    return block;
}


function  loop(cube) {
    let isFinished = false;
    while (!isFinished) {
       var isChanged = false;
        isFinished = true;

       cube.all.forEach(function (block) {
           if (block.value==0){
               isFinished = false;
               return cube;
           }
       })

        if (checkOneGhostValue(cube)) 	{		isChanged = true;		}

        if (deleteGhostValues(cube)) 	{		isChanged = true;		}

        if (checkLastHero(cube)) 		{		isChanged = true;		}

        if(isChanged == true) {
            continue;
        }


        if(isChanged == false) {

            for(let n =2; n<9;n++) {
                for(let i =0; i<cube.all.length;i++) {
                    let block = cube.all[i];
                    if(block.value == 0 && block.ghostValues.length == n) {
                        while(block.ghostValues.length > 0) {
                            let cubeCopy = createCube(cubeToArray(cube));
                            addGhostValues(cubeCopy);
                            let blockCopy = cubeCopy.all[i];
                            setValue(blockCopy, blockCopy.ghostValues[0]);
                            cubeCopy = loop(cubeCopy);
                            if(cubeCopy != null) {
                                cube = cubeCopy;
                                return cube;
                            }
                            else {
                                deleteGhostValue(cube.all[i], cube.all[i].ghostValues[0]);

                            }

                        }
                    }
                }
            }
        }
        if(checkVolidation(cube)){
            return null;
        }


    }
}



//set value if block has only one GV
function checkOneGhostValue( cube) {
    let flag = false;
    cube.all.forEach(function(block ) {
        let value = block.value;
        if(value==0 && block.ghostValues.length==1) {
            block.value = block.ghostValues[0];
            block.ghostValues = [];
            flag = true;
        }
    });
    return flag;
}


//set value if only one block has this number
function checkLastHero( cube) {
    let flag = false;
    for (let number = 1; number<10; number++) {
        for(let nArray = 0; nArray<9; nArray++) {
            if(checkLastHero2(cube.gorizontalArray[nArray],number)) {
                flag = true;
            }
            if(checkLastHero2(cube.verticalArray[nArray],number)) {
                flag = true;
            }
            if(checkLastHero2(cube.squareArray[nArray],number)) {
                flag = true;
            }
        }
    }

    return flag;
}

function checkLastHero2(array, number) {
    let block = null;
    for(let nB = 0; nB<array.length; nB++) {
        if(array[nB].ghostValues.indexOf(number)!=-1) {
            if(block == null) {
                block = array[nB];
            }
            else {
                block = null;
                break;
            }
        }
    }
    if(block!=null) {
        block.value = number;
        return true;
    }
    return false;
}




//volidation
function checkVolidation(cube) {
    let flag = false;
    cube.all.forEach(function(block ) {
        if (block.value == 0 && block.ghostValues.length == 0) {
            flag = true;
        }
    });
    return flag;
}

//delete if there are no this number in GVK
	function deleteGhostValues(cube) {
		let flag = false;
        cube.all.forEach(function(block ) {
			if(block.value==0) {
				let gValues = block.ghostValues;
				for(let j=gValues.length-1;j>=0;j--) {
					if (isArrayHaveValue(cube.gorizontalArray[block.gNumber] , gValues[j]) ||
                        isArrayHaveValue(cube.verticalArray[block.vNumber] , gValues[j]) ||
                        isArrayHaveValue(cube.squareArray[block.sNumber] , gValues[j] ))
					{
						deleteGhostValue(block, gValues[j]);
						flag = true;
					}
				}
			}

		});
		return flag;
	}

function setValue(block, value) {
    block.value = value;
    block.ghostValues = [];
}

function deleteGhostValue(block, gv) {
    for (let i=0; i <block.ghostValues.length;) {
        if (block.ghostValues[i] == gv){
            block.ghostValues.splice(i,1) ;
        }
        else{
            i++;
        }
    }
}









    function addGhostValues(cube){
        cube.all.forEach(function(block){
            for(let n=1;n<10;n++){
                let g = block.gNumber;
                let v = block.vNumber;
                let s = block.sNumber;
                if(isArrayHaveValue(block.cube.gorizontalArray[g],n) &&
                    isArrayHaveValue(block.cube.verticalArray[v],n) &&
                    isArrayHaveValue(block.cube.squareArray[s],n))
                {
                    block.ghostValues.push(n);
                }
            }
        });
    }

    function isArrayHaveValue(array, n){
        let flag = true;
        array.forEach(function(block){
            if(block.value == n){
                flag = false;
            }
        });
        return flag;
    }

    function cubeToArray(cube){
        let matrix = [];
        let j = 0;
        let k = 0;
        cube.all.forEach(function(block) {
            if (j < 9) {
                j++;
            }
            else{
                j=0;
                k++;
            }
            matrix[k].push(block.value);
        });
        console.log("hello");
        return matrix;

    }



