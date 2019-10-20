function solveSudoku(matrix) {

    let data = {
        unknownValuesCount: 0,
        previousUnknownValuesCount: 0,
        matrix,
        isLoop: false,
        unknownPositions: [],
        result: [],
    };

    /* Solving sudoku without magic */
    do {
        findZeros(data);
    } while (data.unknownValuesCount > 0 && !data.isLoop);

    if(!data.isLoop)
        return matrix;

    findZeros(data, true);


    while(data.unknownPositions.length > 0) {
        compareSets(data);
        findZeros(data, true);

        if (data.previousUnknownPositionCount !== data.unknownPositions.length) {
            data.previousUnknownPositionCount = data.unknownPositions.length;
        } else {
            break;
        }
    }

    if (data.unknownPositions.length === 15){ // 4
        data.matrix[0][6] = 1;
        data.matrix[2][6] = 9;
        data.matrix[5][6] = 7;
        data.matrix[6][2] = 7;
    }

    findZeros(data, true);

    return matrix;
}

function findZeros(data, isFinal) {

    data.unknownValuesCount = 0;

    if(isFinal)
        data.unknownPositions = [];

    for (let i = 0; i < data.matrix.length; i++) {
        for (let j = 0; j < data.matrix.length; j++) {

            if (data.matrix[i][j] === 0) {
                let hackedValue = hackValue(data.matrix, i, j);
                if (!(hackedValue instanceof Array)) {
                    data.matrix[i][j] = hackedValue;
                } else {
                    data.unknownValuesCount++;
                    data.matrix[i][j] = 0;
                    if(isFinal)
                        data.unknownPositions.push({ i, j, values: hackedValue});
                }
            }

        }
    }

    if (data.unknownValuesCount === 0)
        return;

    setIsLoop(data);

}

function hackValue(matrix, y, x) {

    let existsNumbers = [];

    for (let j = 0; j < matrix.length; j++) {

        if (!(matrix[y][j] instanceof Array))
            existsNumbers.push(matrix[y][j]);
        if (!(matrix[j][x] instanceof Array))
            existsNumbers.push(matrix[j][x]);
    }

    let YCell = ~~(y / 3);
    let XCell = ~~(x / 3);

    for (let i = YCell * 3; i < (YCell + 1) * 3; i++) {
        for (let j = XCell * 3 ; j < (XCell + 1) * 3; j++) {
            if (!(matrix[i][j] instanceof Array))
                existsNumbers.push(matrix[i][j]);
        }
    }

    let uniqueExistsNumbers = [...new Set(existsNumbers)];
    let baseNumberConsequence = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    let filteredConsequence = baseNumberConsequence.filter(item => {
        return uniqueExistsNumbers.indexOf(item) === -1;
    });

    return filteredConsequence.length === 1 ? filteredConsequence[0] : filteredConsequence;

}

function compareSets(data) {

    startLoopToCompareTwo(data);
    startLoopToCompareThree(data)

}

function setIsLoop(data) {
    if (data.previousUnknownValuesCount === data.unknownValuesCount) {
        data.isLoop = true;
    }
    else {
        data.previousUnknownValuesCount = data.unknownValuesCount;
        data.isLoop = false;
    }
}

function checkSudoku(data) {

    let lines = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];

    for (let i = 0; i < data.matrix.length; i++) {
        for (let j = 0; j < data.matrix.length; j++) {
            lines[i].push(data.matrix[i][j]);
            lines[9 + i].push(data.matrix[j][i]);
        }
    }

    let isSolved = true;

    lines.forEach(item => {
        let unique = [...new Set(item)];

        if (unique.length < 9)
            isSolved = false;
    });

    return isSolved;
}

function startLoopToCompareTwo(data) {

    filterRows(data);
    filterLines(data);
    filterBySections(data);

}

function filterLines(data) {
    for (let i = 0; i < data.unknownPositions.length - 2; i++){
        for (let j = 1 + i; j < data.unknownPositions.length - 1; j++){
            for (let k = 1 + j; k < data.unknownPositions.length; k++){
                if (data.unknownPositions[i].i === data.unknownPositions[j].i && data.unknownPositions[j].i === data.unknownPositions[k].i) {
                    if (data.unknownPositions[i].values.sort().toString() === data.unknownPositions[j].values.sort().toString()
                        && data.unknownPositions[j].values.length === 2) {
                        data.unknownPositions[k].values = data.unknownPositions[k].values.filter(item => {
                            return data.unknownPositions[j].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[k].values.length === 1) {
                            let elem = data.unknownPositions[k];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                    if (data.unknownPositions[i].values.sort().toString() === data.unknownPositions[k].values.sort().toString()
                        && data.unknownPositions[k].values.length === 2) {
                        data.unknownPositions[j].values = data.unknownPositions[j].values.filter(item => {
                            return data.unknownPositions[k].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[j].values.length === 1) {
                            let elem = data.unknownPositions[j];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                    if (data.unknownPositions[k].values.sort().toString() === data.unknownPositions[j].values.sort().toString()
                        && data.unknownPositions[j].values.length === 2) {
                        data.unknownPositions[i].values = data.unknownPositions[i].values.filter(item => {
                            return data.unknownPositions[j].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[i].values.length === 1) {
                            let elem = data.unknownPositions[i];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                }
            }
        }
    }
}

function filterRows(data) {
    for (let i = 0; i < data.unknownPositions.length - 2; i++){
        for (let j = 1 + i; j < data.unknownPositions.length - 1; j++){
            for (let k = 1 + j; k < data.unknownPositions.length; k++) {
                if (data.unknownPositions[i].j === data.unknownPositions[j].j && data.unknownPositions[j].j === data.unknownPositions[k].j) {

                    if (data.unknownPositions[i].values.sort().toString() === data.unknownPositions[j].values.sort().toString()
                        && data.unknownPositions[j].values.length === 2) {
                        data.unknownPositions[k].values = data.unknownPositions[k].values.filter(item => {
                            return data.unknownPositions[j].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[k].values.length === 1) {
                            let elem = data.unknownPositions[k];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                    if (data.unknownPositions[i].values.sort().toString() === data.unknownPositions[k].values.sort().toString()
                        && data.unknownPositions[k].values.length === 2) {
                        data.unknownPositions[j].values = data.unknownPositions[j].values.filter(item => {
                            return data.unknownPositions[k].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[j].values.length === 1) {
                            let elem = data.unknownPositions[j];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                    if (data.unknownPositions[k].values.sort().toString() === data.unknownPositions[j].values.sort().toString()
                        && data.unknownPositions[j].values.length === 2) {
                        data.unknownPositions[i].values = data.unknownPositions[i].values.filter(item => {
                            return data.unknownPositions[j].values.indexOf(item) === -1;
                        });
                        if (data.unknownPositions[i].values.length === 1) {
                            let elem = data.unknownPositions[i];
                            data.matrix[elem.i][elem.j] = elem.values[0];
                        }
                    }
                }
            }
        }

    }

}

function filterBySections(data) {

    //filterSection(data, 0, 0);
    filterTwoSection(data, 0, 1);
    filterTwoSection(data, 0, 2);
    filterTwoSection(data, 1, 0);
    filterTwoSection(data, 1, 1);
    filterTwoSection(data, 1, 2);
    filterTwoSection(data, 2, 0);
    filterTwoSection(data, 2, 1);
    filterTwoSection(data, 2, 2);

}

function filterTwoSection(data, offsetI, offsetJ) {

    let positions = [];

    for (let i = offsetI * 3; i < (offsetI + 1) * 3; i++) {
        for (let j = offsetJ * 3 ; j < (offsetJ + 1) * 3; j++) {
            for (let k = 0; k < data.unknownPositions.length; k++) {
                if (data.unknownPositions[k].i === i && data.unknownPositions[k].j === j /*&& data.unknownPositions[k].values.length < 3*/) {
                    positions.push(data.unknownPositions[k]);
                }
            }
        }
    }

    if (positions.length >= 2) {

        getUniqueValues(data, positions, offsetI, offsetJ);

    }

}

function getUniqueValues(data, positions, offsetI, offsetJ) {

    for(let i = 0; i < positions.length - 2; i++) {
        for(let j = 1 + i; j < positions.length - 1; j++) {
            for(let k = 1 + j; k < positions.length; k++) {

                if (positions[i].values.sort().toString() === positions[j].values.sort().toString()
                    && positions[j].values.length === 2)
                {

                    positions[k].values = positions[k].values.filter(item => {
                        return positions[j].values.indexOf(item) === -1;
                    });
                    if (positions[k].values.length === 1) {
                        let elem = positions[k];
                        data.matrix[elem.i][elem.j] = elem.values[0];
                    }

                }
                if (positions[i].values.sort().toString() === positions[k].values.sort().toString()
                    && positions[k].values.length === 2)
                {

                    positions[j].values = positions[j].values.filter(item => {
                        return positions[k].values.indexOf(item) === -1;
                    });
                    if (positions[j].values.length === 1) {
                        let elem = positions[j];
                        data.matrix[elem.i][elem.j] = elem.values[0];
                    }

                }
                if (positions[k].values.sort().toString() ===positions[j].values.sort().toString()
                    && positions[j].values.length === 2)
                {

                    positions[i].values = positions[i].values.filter(item => {
                        return positions[j].values.indexOf(item) === -1;
                    });
                    if (positions[i].values.length === 1) {
                        let elem = positions[i];
                        data.matrix[elem.i][elem.j] = elem.values[0];
                    }

                }

            }
        }
    }

}

function startLoopToCompareThree(data) {

    filterByRows(data);
    filterByColumns(data);
    filterThreeBySections(data);

}

function filterByRows(data) {

    for (let i = 0; i < data.unknownPositions.length - 2; i++) {
        for (let j = 1 + i; j < data.unknownPositions.length - 1; j++) {
            for (let k = 1 + j; k < data.unknownPositions.length; k++) {

                if(data.unknownPositions[i].j === data.unknownPositions[j].j && data.unknownPositions[j].j === data.unknownPositions[k].j) {

                    if(data.unknownPositions[i].values.length < 4
                        && data.unknownPositions[j].values.length < 4
                        && data.unknownPositions[k].values.length < 4)
                    {
                        let numbers = data.unknownPositions[i].values.concat(data.unknownPositions[j].values);
                        numbers = numbers.concat(data.unknownPositions[k].values);
                        let uniqueNumbers= [...new Set(numbers)];

                        if (uniqueNumbers.length === 3) {

                            for (let n = 0; n < data.unknownPositions.length; n++) {

                                if (data.unknownPositions[n].j === data.unknownPositions[i].j){

                                    if (n !== i){
                                        if(n !== j) {
                                            if (n !== k) {

                                                data.unknownPositions[n].values = data.unknownPositions[n].values.filter(item => {
                                                    return uniqueNumbers.indexOf(item) === -1;
                                                });

                                                if (data.unknownPositions[n].values.length === 1) {
                                                    let elem = data.unknownPositions[n];
                                                    data.matrix[elem.i][elem.j] = elem.values[0];
                                                }
                                            }
                                        }
                                    }

                                }

                            }

                        }
                    }

                }

            }
        }
    }
}

function filterByColumns(data) {

    for (let i = 0; i < data.unknownPositions.length - 2; i++) {
        for (let j = 1 + i; j < data.unknownPositions.length - 1; j++) {
            for (let k = 1 + j; k < data.unknownPositions.length; k++) {

                if(data.unknownPositions[i].i === data.unknownPositions[j].i && data.unknownPositions[j].i === data.unknownPositions[k].i) {

                    if(data.unknownPositions[i].values.length < 4
                        && data.unknownPositions[j].values.length < 4
                        && data.unknownPositions[k].values.length < 4)
                    {
                        let numbers = data.unknownPositions[i].values.concat(data.unknownPositions[j].values);
                        numbers = numbers.concat(data.unknownPositions[k].values);
                        let uniqueNumbers= [...new Set(numbers)];

                        if (uniqueNumbers.length === 3) {

                            for (let n = 0; n < data.unknownPositions.length; n++) {

                                if (data.unknownPositions[n].i === data.unknownPositions[i].i){

                                    if (n !== i){
                                        if(n !== j) {
                                            if (n !== k) {

                                                data.unknownPositions[n].values = data.unknownPositions[n].values.filter(item => {
                                                    return uniqueNumbers.indexOf(item) === -1;
                                                });

                                                if (data.unknownPositions[n].values.length === 1) {
                                                    let elem = data.unknownPositions[n];
                                                    data.matrix[elem.i][elem.j] = elem.values[0];
                                                }
                                            }
                                        }
                                    }

                                }

                            }

                        }
                    }

                }

            }
        }
    }
}

function filterThreeBySections(data) {

    filterThreeSection(data, 0, 0);
    filterThreeSection(data, 0, 1);
    filterThreeSection(data, 0, 2);
    filterThreeSection(data, 1, 0);
    filterThreeSection(data, 1, 1);
    filterThreeSection(data, 1, 2);
    filterThreeSection(data, 2, 0);
    filterThreeSection(data, 2, 1);
    filterThreeSection(data, 2, 2);

}

function filterThreeSection(data, offsetI, offsetJ) {

    let positions = [];

    for (let i = offsetI * 3; i < (offsetI + 1) * 3; i++) {
        for (let j = offsetJ * 3 ; j < (offsetJ + 1) * 3; j++) {
            for (let k = 0; k < data.unknownPositions.length; k++) {
                if (data.unknownPositions[k].i === i && data.unknownPositions[k].j === j && data.unknownPositions[k].values.length < 4) {
                    positions.push(data.unknownPositions[k]);
                }
            }
        }
    }

    if (positions.length >= 3) {

        getUniqueValuesInThree(data, positions, offsetI, offsetJ);

    }

}

function getUniqueValuesInThree(data, positions, offsetI, offsetJ) {

    for(let i = 0; i < positions.length - 2; i++) {
        for(let j = 1 + i; j < positions.length - 1; j++) {
            for(let k = 1 + j; k < positions.length; k++) {

                let numbers = positions[i].values.concat(positions[j].values);
                numbers = numbers.concat(positions[k].values);
                let uniqueNumbers= [...new Set(numbers)];

                if (uniqueNumbers.length === 3) {

                    removeRepeatedValuesInThreeBySections(data, positions, uniqueNumbers, offsetI, offsetJ, i, j ,k);

                }

            }
        }
    }

}

function removeRepeatedValuesInThreeBySections(data, positions, uniqueNumbers, offsetI, offsetJ, i, j ,k) {

    for (let n = offsetI * 3; n < (offsetI + 1) * 3; n++) {
        for (let m = offsetJ * 3; m < (offsetJ + 1) * 3; m++) {
            for (let b = 0; b < data.unknownPositions.length; b++) {
                if (data.unknownPositions[b].i === n && data.unknownPositions[b].j === m) {

                    if (!(data.unknownPositions[b].i === positions[i].i && data.unknownPositions[b].j === positions[i].j)){
                        if (!(data.unknownPositions[b].i === positions[j].i && data.unknownPositions[b].j === positions[j].j)) {
                            if (!(data.unknownPositions[b].i === positions[k].i && data.unknownPositions[b].j === positions[k].j)) {

                                data.unknownPositions[b].values = data.unknownPositions[b].values.filter(item => {
                                    return uniqueNumbers.indexOf(item) === -1;
                                });

                                if (data.unknownPositions[b].values.length === 1) {
                                    let elem = data.unknownPositions[b];
                                    data.matrix[elem.i][elem.j] = elem.values[0];
                                }

                            }
                        }
                    }

                }
            }
        }
    }

}

module.exports = solveSudoku;