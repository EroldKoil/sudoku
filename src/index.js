function solveSudoku(matrix) {
    let cube = createCube(matrix);

    let matrix1 = cubeToArray(loop(cube));
   let il = 0;
    return matrix1;
}

module.exports = solveSudoku;

function createCube(array){
    let cube = {
        all:[],
        gorizontalArray:[[],[],[],[],[],[],[],[],[]],
        verticalArray:[[],[],[],[],[],[],[],[],[]],
        squareArray:[[],[],[],[],[],[],[],[],[]],
    };

    for (let i = 0 ; i<array.length; i++){
        for (let j = 0 ; j<9; j++){
            let block = createBlock(array[i][j],i,j, cube);
            cube.all.push(block);
            cube.gorizontalArray[i].push(block);
            cube.verticalArray[j].push(block);
            cube.squareArray[block.sNumber].push(block);
        }
    }
    addGhostValues(cube);
    return cube;
}


function createBlock(value,i,j,cubeObject) {
    let block = {
        value:value,
        gNumber:i,
        vNumber:j,
        sNumber: Math.trunc(i/3)*3+Math.trunc(j/3),
        ghostValues:[],
        cube:cubeObject,
    };
    return block;
}


function createCubeCopy(cube){
    let cubeCopy = createCube(cubeToArray(cube));
    return cubeCopy;
}


function  loop(cube) {
    let isFinished = false;
    while (!isFinished) {
        let isChanged = false;
        isFinished = true;

        if (checkVolidation(cube)) {
            return null;
        }

        if (checkOneGhostValue(cube))   {
            isChanged = true;
        }

        if (checkLastHero(cube))    {
            isChanged = true;
        }

        cube.all.forEach(function (block) {
            if (block.value == 0) {
                isFinished = false;
            }
        });

        if(isFinished){
           return cube;
        }

        if (isChanged == false) {
            for (let n = 2; n < 9; n++) {
                for (let i = 0; i < cube.all.length; i++) {
                    let block = cube.all[i];
                    if (block.value == 0 && block.ghostValues.length == n) {
                        while (block.ghostValues.length > 0) {
                            let cubeCopy = createCubeCopy(cube);
                            let blockCopy = cubeCopy.all[i];
                            setValue(blockCopy, blockCopy.ghostValues[0]);
                            cubeCopy = loop(cubeCopy);
                            if (cubeCopy != null) {
                                return cubeCopy;
                            } else {
                                deleteGhostValue(cube.all[i], block.ghostValues[0]);
                            }
                        }
                    }
                }
            }
        }
    }
}


//set value if block has only one GV
function checkOneGhostValue( cube) {
    let flag = false;
    cube.all.forEach(function(block ) {
        let value = block.value;
        if(value==0 && block.ghostValues.length==1) {
            setValue(block , block.ghostValues[0]);
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
            if(checkLastHero2(cube.gorizontalArray[nArray],number) ||
                checkLastHero2(cube.verticalArray[nArray],number) ||
                checkLastHero2(cube.squareArray[nArray],number))
            {
                flag = true;
            }
        }
    }
    return flag;
}

function checkLastHero2(array, number) {
    let block = null;
    for(let nB = 0; nB<array.length; nB++) {
        if(array[nB].value == 0 && array[nB].ghostValues.indexOf(number)!=-1) {
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
        setValue(block , number);
        return true;
    }
    return false;
}


function checkVolidation(cube) {

    let flag = false;
    cube.all.forEach(function(block ) {
        if (block.value == 0 && block.ghostValues.length == 0) {
            flag = true;
        }
    });
    return flag;
}

function deleteOneGhostValue(block, value) {
    block.cube.gorizontalArray[block.gNumber].forEach(function(b){
        deleteGhostValue(b, value);
    });
    block.cube.verticalArray[block.vNumber].forEach(function(b){
        deleteGhostValue(b, value);
    });
    block.cube.squareArray[block.sNumber].forEach(function(b){
        deleteGhostValue(b, value);
    });
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

function setValue(block, value) {
    block.value = value;
    block.ghostValues = [];
    deleteOneGhostValue(block, value);
}

function addGhostValues(cube){
    cube.all.forEach(function(block){
        if (block.value == 0) {
            for (let n = 1; n < 10; n++) {
                let g = block.gNumber;
                let v = block.vNumber;
                let s = block.sNumber;

                if (isArrayHaveValue(cube.gorizontalArray[g], n) &&
                    isArrayHaveValue(cube.verticalArray[v], n) &&
                    isArrayHaveValue(cube.squareArray[s], n))
                {
                    block.ghostValues.push(n);
                }
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
    let matrix = [[],[],[],[],[],[],[],[],[]];
    cube.all.forEach(function(block) {
        matrix[block.gNumber].push(block.value);
    });
    return matrix;

}
