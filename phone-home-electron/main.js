// Modules to control application life and create native browser window
// See: https://gm-surendra.medium.com/electron-app-and-classic-windows-app-integration-942d0f8c59c2
// See: https://www.codeproject.com/Articles/488668/Csharp-TCP-Server

const HOST = 'localhost'; //# ip address for the socket; TCP Server Simulator should be on this computer
const PORT = 3001; //# port number for the socket; TCP Server Simulator uses 3001 by default

const {
    app,
    BrowserWindow
} = require('electron');

const path = require('path');
const net = require('net');
const electron = require('electron');
const ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // and load the index.html of the app.
    mainWindow.loadFile('./index.html');// Open the DevTools.
    // mainWindow.webContents.openDevTools()// Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

const client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('Line Opened');
});

// Add a 'data' event handler for the client socket
// data is what the server sent to this socket
client.on('data', function (data) {
    console.log('DATA: ' + data);
    mainWindow.webContents.send('received-data', '' + data);
    // Prove that I can close the app from outside
    if ('' + data == 'hangup'){
        console.log('bye');
        app.quit();
    }
});

// Add a 'close' event handler for the client socket
ipcMain.on('phoneHome', function (event) {
    client.write('phoneHome');
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
