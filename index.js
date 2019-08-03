const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const { app, BrowserWindow, ipcMain } = electron;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);
let mainWindow;
app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (event, path) => {
  ffmpeg.ffprobe(path, (err, metadata) => {
    if (err) {
      console.log(`Error happened: ${err}`);
    } else {
      console.log(`Video duration metadata = ${metadata.format.duration}`);
      const durationInMinutes =
        Math.floor(metadata.format.duration / 60) +
        ':' +
        Math.floor(metadata.format.duration % 60);
      mainWindow.webContents.send('video:metadata', durationInMinutes);
    }
  });
});
