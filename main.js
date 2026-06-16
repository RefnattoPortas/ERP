/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let nextServer;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: "ERP Playarts Pets",
    icon: path.join(__dirname, 'public', 'favicon.ico')
  });

  // Em produção, esperamos o servidor Next.js iniciar
  const checkServer = () => {
    http.get('http://localhost:3000', (res) => {
      mainWindow.loadURL('http://localhost:3000');
    }).on('error', () => {
      setTimeout(checkServer, 1000);
    });
  };

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    checkServer();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startNextServer() {
  const isDev = process.env.NODE_ENV === 'development';
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const args = isDev ? ['run', 'dev'] : ['run', 'start'];

  nextServer = spawn(command, args, {
    cwd: __dirname,
    env: { ...process.env, NODE_ENV: isDev ? 'development' : 'production' }
  });

  nextServer.stdout.on('data', (data) => {
    console.log(`Next.js: ${data}`);
  });

  nextServer.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data}`);
  });
}

app.on('ready', () => {
  startNextServer();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (nextServer) nextServer.kill();
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
