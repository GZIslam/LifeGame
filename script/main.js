const root = document.getElementById("root");

const gameContainer = document.createElement("div");

let configEl = configView();

root.append(configEl);
root.append(gameContainer);

let initTable = () => {
    let size =configEl.getValue();
    if(size > 4) {
        gameContainer.innerHTML = "";
        let table = tableView(size);
        gameContainer.append(table);
        gameContainer.append(controllerView(table, size));
    } else {
        alert("Размер поля очень мал")
    }
};

configEl.setButtonAction(initTable);