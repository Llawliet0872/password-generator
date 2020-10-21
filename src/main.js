const electron = require("electron");
const url = require("url");
const path = require("path");
const {protocol} = require("electron");
const {app, BrowserWindow, Menu, ipcMain} = electron;

let alertWindow;
let mainWindow;

process.env.NODE_ENV == "development";

app.on("ready", function(){
  // create new window
  mainWindow = new BrowserWindow({webPreferences:{
      nodeIntegration: true,
    },
    maximizable: false,
  });
  mainWindow.on("close", function(){
    mainWindow = null;
  });
  
  mainWindow.setMenu(null);

  // load html file
  mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file:",
      slashes: true 
  }));
});


function createPassWindow(){
  passWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true
    },
    width: 500,
    height: 600,
    minimizable: false,
    maximizable: false
  });
  const passMenu = Menu.buildFromTemplate(passMenuTemplate);
  passWindow.setMenu(passMenu);

  passWindow.on("close", function(){
    passWindow = null;
  });
  mainWindow.on("closed", function(){
    app.quit()
  });
  passWindow.loadURL(url.format({
    pathname: path.join(__dirname, "passWindow.html"),
    protocol: "file:",
    slashes: true,

  }));

};


const passMenuTemplate = [
  {
    label: "Options",
    submenu: [
      {
        label: "Clear",
        click(){
          passWindow.webContents.send("clear");
        }
      }
    ]
  } 
];


function createAlertWindow(){
  // create new window
 alertWindow = new BrowserWindow({
    webPreferences:{
        nodeIntegration: true
    },
    width: 300,   // defining the size
    height: 200,
    frame: false, // removes the top bar!
  });
  alertWindow.setMenu(null);
  // garbage collection
  alertWindow.on("close", function(){
      alertWindow = null;
  });
  mainWindow.on("closed", function(){
    app.quit()
  });
   // load html file
  alertWindow.loadURL(url.format({
      pathname: path.join(__dirname, "alertWindow.html"),
      protocol: "file:",
      slashes: true,
  }));
 };

ipcMain.on("short", function(){
  createAlertWindow();
});

ipcMain.on("closeAlert", function(){
  alertWindow.close();
});

ipcMain.on("showPass", function(){
  createPassWindow();
})
