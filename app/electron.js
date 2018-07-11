// const { ipcMain } = require('electron');
const { app, BrowserWindow } = require('electron');
const { join } = require('path');
const isDev = require('electron-is-dev');
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1000, height: 700 });
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:1234'
      : `file://${join(__dirname, '../dist/index.html')}`
  );

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', () => (mainWindow = null));
}

app.on('ready', () => mainWindow || createWindow());
app.on('window-all-closed', () => process.platform === 'darwin' || app.quit());

// ipcMain.on('asynchronous-message', (event, arg) => {
//   console.log(arg); // prints "ping"
//   event.sender.send('asynchronous-reply', 'pong');
// });

// ipcMain.on('synchronous-message', (event, arg) => {
//   console.log(arg); // prints "ping"
//   event.returnValue = 'pong';
// });
