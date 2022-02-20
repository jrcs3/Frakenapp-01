// # ip address for the socket
const HOST = 'localhost'; 
// # port number for the socket
const PORT = 3001; 

import  {
    app,
    BrowserWindow,
    ipcMain         // Inter Process Communication module for the main process
} from 'electron';

const net = require('net');

const path = require('path');

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
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// 1. Create a connection with home
const client = new net.Socket();
client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, 
    // the server will receive it as message from the client 
    client.write('Line Opened');
});

// 2. Listen for data from home and send it to mainWindow (the renderer process),
client.on('data', function (data) {
    console.log('DATA: ' + data);
    mainWindow.webContents.send('received-data', '' + data);
    // Prove that I can close the app from outside
    if ('' + data == 'hangup'){
        console.log('bye');
        app.quit();
    }
});

// 3. relay data from mainWindow (the renderer process) to home.
ipcMain.on('phoneHome', function (event, arg) {
    client.write('' + arg);
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
