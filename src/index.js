const { app, BrowserWindow, desktopCapturer, ipcMain } = require("electron");
const path = require("path");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

require("@electron/remote/main").initialize();

var mainWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 720,
    minHeight: 720,
    maxWidth: 5000,
    maxHeight: 5000,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false,
    },
  });

  require("@electron/remote/main").enable(mainWindow.webContents);

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

ipcMain.on("screen-capture", async (event, arg) => {
  desktopCapturer
    .getSources({
      types: ["screen"],
      thumbnailSize: { width: 300, height: 300 },
    })
    .then((sources) => {
      event.sender.send("screen-capture-reply", sources);
    });
});

ipcMain.on("resize11720", async (event, arg) => {
  mainWindow.setSize(720, 720, true);
});
ipcMain.on("resize169720", async (event, arg) => {
  mainWindow.setSize(1280, 720, true);
});
ipcMain.on("resize111080", async (event, arg) => {
  mainWindow.setSize(1080, 1080, true);
});
ipcMain.on("resize1691080", async (event, arg) => {
  mainWindow.setSize(1920, 1080, true);
});

ipcMain.on("resizecustom", async (event, { width, height }) => {
  console.log(typeof width, height);
  mainWindow.setSize(parseInt(width), parseInt(height), true);
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
