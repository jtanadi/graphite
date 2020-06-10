const NUM_GRIDS = 16;
const GRID_SIZE = 31;
const CANVAS_SIZE = 504;

const START = {
  x: 0,
  y: 496,
};
let POINT = [START.x, START.y];
let SHOW_CURSOR = true;
let SHOW_GRID = true;

const runBtn = document.getElementById("run");
const clearBtn = document.getElementById("clear");
const codeArea = document.getElementById("code-area");
const outputArea = document.getElementById("output-area");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Shift canvas so lines along edges don't get cut off
ctx.translate(4, 4);

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

const clearGrid = () => {
  const gridRows = document.querySelectorAll(".row")
  gridRows.forEach(row => {
    row.parentNode.removeChild(row)
  })
}

const parseCoords = (coords) => {
  const [x, y] = coords.map((coord) => parseInt(coord) * GRID_SIZE);

  // Flip y-axis so canvas works more like a graph
  return [x, -y];
};

const move = (args) => {
  if (args.length !== 2) {
    return logError("move requires 2 arguments: x y");
  }

  const [x1, y1] = POINT;
  const [x2, y2] = parseCoords(args);

  if (Number.isNaN(x2) || Number.isNaN(y2)) {
    return logError(
      "move's arguments should have the following types: number number"
    );
  }

  const [x, y] = [x1 + x2, y1 + y2];
  POINT = [x, y];

  ctx.moveTo(x, y);
};

const line = (args) => {
  if (args.length !== 2) {
    return logError("line requires 2 arguments: x y");
  }

  const [x1, y1] = POINT;
  const [x2, y2] = parseCoords(args);

  if (Number.isNaN(x2) || Number.isNaN(y2)) {
    return logError(
      "line's arguments should have the following types: number number"
    );
  }

  const [x, y] = [x1 + x2, y1 + y2];
  POINT = [x, y];

  ctx.lineTo(x, y);
};

const arc = (args) => {
  if (args.length !== 3) {
    return logError("arc requires 3 arguments: x y direction");
  }

  if (typeof args[2] !== "string") {
    return logError(
      "arc's arguments should have the following types: number number string"
    );
  }

  const [x1, y1] = POINT;
  const [xStr, yStr, direction] = args;
  const [x, y] = parseCoords([xStr, yStr]);

  if (Number.isNaN(x) || Number.isNaN(y)) {
    return logError(
      "arc's arguments should have the following types: number number string"
    );
  }

  const [x2, y2] = [x1 + x, y1 + y];
  POINT = [x2, y2];

  const xRadius = Math.abs(x2 - x1);
  const yRadius = Math.abs(y2 - y1);

  // Default to a line if we can't make an arc
  if (!xRadius || !yRadius) {
    return ctx.lineTo(x2, y2);
  }

  if (direction === "n") {
    if (x2 > x1 && y2 < y1) {
      ctx.ellipse(x2, y1, xRadius, yRadius, 0, -Math.PI, -Math.PI / 2);
    } else if (x2 > x1 && y2 > y1) {
      ctx.ellipse(x1, y2, xRadius, yRadius, 0, -Math.PI / 2, 0);
    } else if (x2 < x1 && y2 < y1) {
      ctx.ellipse(x2, y1, xRadius, yRadius, 0, 0, -Math.PI / 2, true);
    } else {
      ctx.ellipse(x1, y2, xRadius, yRadius, 0, -Math.PI / 2, -Math.PI, true);
    }
  } else if (direction === "s") {
    if (x2 > x1 && y2 < y1) {
      ctx.ellipse(x1, y2, xRadius, yRadius, 0, Math.PI / 2, 0, true);
    } else if (x2 > x1 && y2 > y1) {
      ctx.ellipse(x2, y1, xRadius, yRadius, 0, -Math.PI, Math.PI / 2, true);
    } else if (x2 < x1 && y2 < y1) {
      ctx.ellipse(x1, y2, xRadius, yRadius, 0, Math.PI / 2, -Math.PI);
    } else {
      ctx.ellipse(x2, y1, xRadius, yRadius, 0, 0, Math.PI / 2);
    }
  } else {
    return logError(`${direction} is an invalid direction`);
  }
};

const drawCursor = () => {
  const [x, y] = POINT;

  ctx.beginPath();

  // Horizontal
  ctx.moveTo(x - 4, y);
  ctx.lineTo(x + 4, y);

  // Vertical
  ctx.moveTo(x, y - 4);
  ctx.lineTo(x, y + 4);

  // Reset
  ctx.moveTo(x, y);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.stroke();
};

const clearLog = () => {
  outputArea.value = "";
};

const logError = (message) => {
  outputArea.value = message;
};

const clear = () => {
  POINT = [START.x, START.y];
  SHOW_CURSOR = true;
  SHOW_GRID = true;

  clearLog();
  ctx.clearRect(-4, -4, CANVAS_SIZE, CANVAS_SIZE);
};

const parseAndExec = (text) => {
  clear();

  const [x, y] = POINT;
  ctx.beginPath();
  ctx.moveTo(x, y);

  text
    .split("\n")
    .filter((textLine) => textLine)
    .forEach((textLine) => {
      const [funcName, ...funcArgs] = textLine.split(" ");
      switch (funcName) {
        case "nocursor":
          SHOW_CURSOR = false;
          break;
        case "nogrid":
          SHOW_GRID = false;
          break;
        case "move":
          move(funcArgs);
          break;
        case "line":
          line(funcArgs);
          break;
        case "arc":
          arc(funcArgs);
          break;
        default:
          logError(`${funcName} is not a valid function.`);
      }
    });

  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (SHOW_CURSOR) {
    drawCursor();
  }

  if (!SHOW_GRID) {
    clearGrid();
  } else if (SHOW_GRID && !document.querySelectorAll(".row")){
    // Only regenerate if grid doesn't exist
    generateGrids(NUM_GRIDS);
  }
};

const runCode = () => {
  const codeToRun = codeArea.value;
  parseAndExec(codeToRun);
};

const startDwg = () => {
  clear();
  drawCursor();
  generateGrids(NUM_GRIDS);
};

codeArea.focus();
runBtn.addEventListener("click", runCode);
clearBtn.addEventListener("click", startDwg);

window.addEventListener("keypress", (ev) => {
  // Keys only really work on non-mac
  // Probably best to let electron deal with this
  if (ev.charCode === 10) {
    // ctrl + enter
    runCode();
  } else if (ev.charCode === 3) {
    // ctrl + shift + c
    startDwg();
  }
});

startDwg();
