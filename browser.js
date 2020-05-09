const NUM_GRIDS = 16;
const GRID_SIZE = 31;

const runBtn = document.getElementById("run");
const codeArea = document.getElementById("code-input");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
ctx.translate(0.5, 0.5);

const generateGrids = (size) => {
  const leftContainer = document.getElementById("left-container");
  for (let i = 0; i < size; i++) {
    const row = document.createElement("DIV");
    row.className = "row";
    leftContainer.appendChild(row);

    for (let j = 0; j < size; j++) {
      const cell = document.createElement("DIV");
      cell.className = "cell";

      if (i < size - 1 && j < size - 1) {
        const dot = document.createElement("DIV");
        dot.className = "dot bottom right";
        cell.appendChild(dot);
      }

      row.appendChild(cell);
    }
  }
};

const parseCoords = (arr) => {
  return arr.map((val) => parseInt(val) * GRID_SIZE);
};

const move = (args) => {
  const [x, y] = parseCoords(args);
  ctx.moveTo(x, y);
};

const line = (args) => {
  const [x, y] = parseCoords(args);

  ctx.lineTo(x, y);
};

const parseAndExec = (text) => {
  const textLines = text.split("\n");

  ctx.clearRect(0, 0, 496, 496);
  ctx.beginPath();

  textLines.forEach((textLine) => {
    const [funcName, ...funcArgs] = textLine.split(" ");
    switch (funcName) {
      case "move":
        move(funcArgs);
        break;
      case "line":
        line(funcArgs);
        break;
    }
  });

  ctx.strokeStyle = "white";
  ctx.stroke();
};

const runCode = () => {
  const codeToRun = codeArea.value;
  parseAndExec(codeToRun);
};

generateGrids(NUM_GRIDS);
runBtn.addEventListener("click", runCode);
