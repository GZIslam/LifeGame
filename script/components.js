const configView = () => {
    let config = document.createElement("div");
    let tableSizeField = document.createElement("input");
    let applyButton = document.createElement("button");
    let tableSize = document.createElement("label");
    
    tableSize.innerText = "Введите размер поля NxN";
    tableSizeField.type = "number";
    tableSizeField.value = 55;
    applyButton.innerText = "Создать";

    tableSize.append(tableSizeField);
    config.append(tableSize);
    config.append(applyButton);

    config.setButtonAction = action => {
        applyButton.addEventListener("click", action);
    };
    config.getValue = () => tableSizeField.value;

    return config;
};

const tableView = (size) => {
    let data = [];
    let table = document.createElement("div");
    table.data = data;

    let mousedown = false;
    let prevCell = undefined;

    document.addEventListener("mousedown", () => {
        mousedown = true;
    });

    document.addEventListener("mouseup", () => {
        mousedown = false;
    });

    for(let i = 0; i < size; i++) {
        let row = [];
        let rowEl = document.createElement("div");
        rowEl.classList.add("row");
        for(let j = 0; j < size; j++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.draggable = false;

            cell.addEventListener("mousemove", () => {
                if(mousedown) {
                    if(prevCell !== cell) {
                        data[i][j].state? data[i][j].state = 0 : data[i][j].state = 1;
                        cell.classList.toggle("is-active");
                        prevCell = cell;
                    }
                }
            });
            cell.addEventListener("click", () => {
                data[i][j].state? data[i][j].state = 0 : data[i][j].state = 1;
                cell.classList.toggle("is-active");
            });

            rowEl.append(cell);
            row.push({state: 0, element: cell});
        }
        table.append(rowEl);
        data.push(row);
    }

    table.changeCell = (dataElement) => {
        dataElement.state? dataElement.state = 0 : dataElement.state = 1;
        dataElement.element.classList.toggle("is-active");
    };

    let possibilityCheck = val => {
        if(val < 0) { 
            return data.length-1;
        } else if(val == data.length) {
            return 0;
        } else {
            return val;
        }
    };

    table.checkRow = (x, y, dir) => {
        let counter = 0;

        let startLeftPos = possibilityCheck(x-1);
        let startTopPos;

        if(dir) {
            startTopPos = possibilityCheck(y+1);
        } else {
            startTopPos = possibilityCheck(y-1);
        }

        for(let i = 0; i < 3; i++) {
            if(data[startLeftPos][startTopPos].state) counter++;
            startLeftPos = possibilityCheck(startLeftPos+1);
        }

        return counter;
    };

    table.checkAround = (x, y) => {
        let counter = 0;

        let centerLeft = possibilityCheck(x-1);
        let centerRight = possibilityCheck(x+1);

        if(data[centerLeft][y].state) counter++;
        if(data[centerRight][y].state) counter++;

        counter += table.checkRow(x, y, true);
        counter += table.checkRow(x, y, false);

        return counter;
    };

    return table;
};

const controllerView = (table, size) => {
    let startButton = document.createElement("button");
    let stopButton = document.createElement("button");
    let clearButton = document.createElement("button");
    let speedIndexInput = document.createElement("input");
    let speedIndex = document.createElement("label");

    clearButton.innerText = "Очистить";
    clearButton.style.backgroundColor = "#c8d637";
    startButton.style.backgroundColor = "#37d656";
    stopButton.style.backgroundColor = "#d63749";
    speedIndex.innerText = "Скорость в секундах";
    speedIndexInput.type = "number";
    startButton.innerText = "Старт";
    stopButton.innerText = "Стоп";
    speedIndexInput.value = 0.1;
    let controller = document.createElement("div");
    speedIndex.append(speedIndexInput)
    controller.append(startButton);
    controller.append(stopButton);
    controller.append(clearButton);
    controller.append(speedIndex)

    let newLifeCell = [];
    let newDieCell = [];

    let prevLive = [];
    let prevDeath = [];
    let prevLiveCombination = false;
    let prevDeathCombination = false;

    let createLife = () => {
        newLifeCell = [];
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++) {
                let count = table.checkAround(j, i);
                if(count == 3 && !table.data[j][i].state) {
                    newLifeCell.push(table.data[j][i]);
                }
            }
        }
        if(JSON.stringify(prevLive) == JSON.stringify(newLifeCell)) prevLiveCombination = true;
        prevLive = newLifeCell.slice(0);
    };

    let killLoners = () => {
        newDieCell = [];
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++) {
                let count = table.checkAround(j, i);
                if(count > 3 || count < 2) {
                    if(table.data[j][i].state) newDieCell.push(table.data[j][i]);
                }
            }
        }
        if(JSON.stringify(prevDeath) == JSON.stringify(newDieCell)) prevDeathCombination = true;
        prevDeath = newDieCell.slice(0);
    };

    let updateTable = () => {
        createLife();
        killLoners();
        if(newLifeCell.length > 0) {
            newLifeCell.forEach(cell => {
                table.changeCell(cell);
            });
        }
        if(newDieCell.length > 0) {
            newDieCell.forEach(cell => {
                table.changeCell(cell);
            });
        } 
        if(prevLiveCombination == true && prevDeathCombination == true) {
            alert("Game over");
            clearInterval(updateSpeed);
            updateSpeed = undefined;
        }
    }

    let updateSpeed;

    startButton.addEventListener("click", () => {
        prevLiveCombination = false;
        prevDeathCombination = false;
        if(!updateSpeed) updateSpeed = setInterval(updateTable, speedIndexInput.value*1000);
    });

    stopButton.addEventListener("click", () => {
        clearInterval(updateSpeed);
        updateSpeed = undefined;
    });

    clearButton.addEventListener("click", () => {
        for(let i = 0; i < size; i++){
            for(let j = 0; j < size; j++) {
                if(table.data[j][i].state) {
                   table.changeCell(table.data[j][i]);
                }
            }
        }
        clearInterval(updateSpeed);
        updateSpeed = undefined;
    });

    return controller;
};