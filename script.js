let tower = document.querySelectorAll(".tower");
let reset = document.getElementById("reset");
let noOfDisk = document.getElementById("no-of-disk");
let totalDisk = parseInt(noOfDisk.innerText);
let increaseDisk = document.getElementById("increase");
let decreaseDisk = document.getElementById("decrease");
let solution = document.getElementById("showSolution");
let isGameOver = false;
let topDisk = null;
let isDiskLifted = false;
let move = 0;
let minMove;
let diskArray = [
    { id: "1", color: "#FF5733" },
    { id: "2", color: "#FFC300" },
    { id: "3", color: "#DAF7A6" },
    { id: "4", color: "#33FF57" },
    { id: "5", color: "#33FFF3" },
    { id: "6", color: "#335CFF" },
    { id: "7", color: "#7D33FF" },
    { id: "8", color: "#FF33A8" }
];
let tower1 = document.getElementById("Tower1");
let tower2 = document.getElementById("Tower2");
let tower3 = document.getElementById("Tower3");
let Tower1 = [];
let Tower2 = [];
let Tower3 = [];
let initialTower1 = [];

increaseDisk.addEventListener("click", () => {
    if (totalDisk < 8) {
        noOfDisk.innerText = `${++totalDisk}`;
    }
    initializeGame();
});

decreaseDisk.addEventListener("click", () => {
    if (totalDisk > 3) {
        noOfDisk.innerText = `${--totalDisk}`;
    }
    initializeGame();
});

reset.addEventListener("click", () => {
    isGameOver = false;
    totalDisk = 3;
    noOfDisk.innerText = `${totalDisk}`;
    initializeGame();
});

window.onload = function () {
    initializeGame();
};

function calculateMinMoves(disks) {
    return Math.pow(2, disks) - 1;
}

function initializeGame() {
    Tower1 = [];
    Tower2 = [];
    Tower3 = [];
    let width = 26;
    let bottom = -1;
    diskArray.forEach((element) => {
        if (element.id > totalDisk) return;
        let size = {
            id: `disk${element.id}`,
            width: `${width - 2}`,
            bottom: `${parseInt(bottom) + 3}`,
            color: element.color
        };
        width = size.width;
        bottom = size.bottom;
        Tower1.push(size);
    });
    initialTower1 = [...Tower1];
    changeDisk(Tower1, tower1);
    changeDisk(Tower2, tower2);
    changeDisk(Tower3, tower3);
    topDisk = null;
    isDiskLifted = false;
    move = 0;
    minMove = calculateMinMoves(totalDisk);
    document.getElementById("min-move").innerText = `Minimum Move : ${minMove}`;
    document.getElementById("your-move").innerText = `Your Move : ${move}`;
}

function changeDisk(towerArr, tower) {
    tower.innerHTML = `<div class="base"></div>`;
    towerArr.forEach((element) => {
        let disk = document.createElement("div");
        disk.className = "disk";
        disk.id = `${element.id}`;
        disk.style.width = element.width + "vw";
        disk.style.bottom = element.bottom + "vh";
        disk.style.backgroundColor = element.color;
        tower.appendChild(disk);
    });
}

function checkWin() {
    if ((Tower3.length === totalDisk && JSON.stringify(Tower3) === JSON.stringify(initialTower1)) || (Tower2.length === totalDisk && JSON.stringify(Tower2) === JSON.stringify(initialTower1))) {
        if (!isGameOver) {
            setTimeout(() => {
                alert("You Win!");
                isGameOver = true;
            }, 250);
        }
    }
}

tower.forEach((element) => {
    element.addEventListener("click", function () {
        let currentArray;
        if (element.id === "Tower1") {
            currentArray = Tower1;
        } else if (element.id === "Tower2") {
            currentArray = Tower2;
        } else if (element.id === "Tower3") {
            currentArray = Tower3;
        }
        if (!isDiskLifted) {
            if (currentArray.length > 0) {
                topDisk = currentArray.pop();
                let disk = document.getElementById(`${topDisk.id}`);
                if (disk) {
                    topDisk.previousBottom = topDisk.bottom;
                    disk.style.bottom = "34vh";
                    isDiskLifted = true;
                }
            }
        } else {
            if (
                currentArray.length === 0 ||
                parseFloat(topDisk.width) < parseFloat(currentArray[currentArray.length - 1].width)
            ) {
                let newBottom = currentArray.length > 0
                    ? parseFloat(currentArray[currentArray.length - 1].bottom) + 3 : 2;
                topDisk.bottom = newBottom;
                currentArray.push(topDisk);

                let disk = document.getElementById(`${topDisk.id}`);
                if (disk) {
                    disk.style.bottom = `${newBottom}vh`;
                }
                topDisk = null;
                isDiskLifted = false;
                move++;
                document.getElementById("your-move").innerText = `Your Move : ${move}`;
                setTimeout(checkWin, 250);
                changeDisk(Tower1, tower1);
                changeDisk(Tower2, tower2);
                changeDisk(Tower3, tower3);
            } else if (currentArray === (Tower1.includes(topDisk) ? Tower1 : Tower2.includes(topDisk) ? Tower2 : Tower3)) {
                currentArray.push(topDisk);
                let disk = document.getElementById(`${topDisk.id}`);
                if (disk) {
                    disk.style.bottom = `${topDisk.previousBottom}vh`;
                }
                topDisk = null;
                isDiskLifted = false;
            } else {
                alert("Invalid move: Can't place a larger disk on a smaller one.");
            }
        }
    });
});

function solveHanoi(n, fromTower, toTower, auxTower, solution, step) {
    if (n === 1) {
        solution.push(`Step: ${step[0]} Move disk 1 from ${fromTower} to ${toTower}`);
        step[0]++;
        return;
    }
    solveHanoi(n - 1, fromTower, auxTower, toTower, solution, step);
    solution.push(`Step: ${step[0]} Move disk ${n} from ${fromTower} to ${toTower}`);
    step[0]++;
    solveHanoi(n - 1, auxTower, toTower, fromTower, solution, step);
}

function displaySolution() {
    const noOfDiskElement = document.getElementById("no-of-disk");
    let totalDisk = parseInt(noOfDiskElement.innerText);
    if (totalDisk >= 3 && totalDisk <= 8) {
        let solution = [];
        let step = [1];
        solveHanoi(totalDisk, 'Tower 1', 'Tower 3', 'Tower 2', solution, step);
        let solutionText = solution.join('<br>');
        document.getElementById("solution").innerHTML = solutionText;
    } else {
        alert("Please select a number of disks between 3 and 8.");
    }
}

solution.addEventListener("click", () => {
    if (solution.innerText === "Show Solution") {
        solution.innerText = "Hide Solution";
        displaySolution();
    } else {
        solution.innerText = "Show Solution";
        document.getElementById("solution").innerHTML = "";
    }

});
