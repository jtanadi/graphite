const electron = require("electron");
const path = require("path");

const { app, BrowserWindow } = electron;

app.on("ready", () => {
  const mainWindow = new BrowserWindow({ width: 800, height: 560 });

  if (process.env.NODE_ENV === "PRODUCTION") {
    mainWindow.setMenu(null);
    mainWindow.setResizable(false);
  }

  mainWindow.loadFile(path.join(__dirname, "index.html"));
});
