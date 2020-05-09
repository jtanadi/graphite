const electron = require("electron");
const path = require("path");

const { app, BrowserWindow } = electron;

app.on("ready", () => {
  const windowOption = { width: 800, height: 550, frame: false };

  if (process.env.NODE_ENV !== "PRODUCTION" && process.platform !== "darwin") {
    windowOption.height = 575;
    windowOption.frame = true;
  }

  const mainWindow = new BrowserWindow(windowOption);

  if (process.env.NODE_ENV === "PRODUCTION") {
    mainWindow.setMenu(null);
    mainWindow.setResizable(false);
  }

  mainWindow.loadFile(path.join(__dirname, "index.html"));
});
