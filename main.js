const electron = require("electron")
const { app, BrowserWindow,ipcMain, ipcRenderer } = require("electron");
const path = require("path");
// const menubar = require("menubar")
// let mb = menubar(
//     {
//         dir:process.cwd(), 
//         index:`file://${__dirname}/menu.html`,
//         width:200,
//         height:200
//     }  
// );

let win;
// mb.on('ready', ()=>{
//     // console.log('menu')
// })

app.on('ready', ()=>{
    const {height,width} = electron.screen.getPrimaryDisplay().workAreaSize
    win = new BrowserWindow({
        width, 
        height, 
        icon:path.join(__dirname, "64x64.png")
    });
    ipcMain.on('fullScreen-main', (event, args)=>{
        if(!win.isFullScreen()){
            win.setFullScreen(args.value)
        }else{
            win.setFullScreen(false);
        }
    })
    win.loadURL(`file://${__dirname}/index.html`)
})
ipcMain.on("CtrlClock", (event, args)=>{
    // if(args.type == "start")
    console.log(args)
    // console.log(event)
    event.sender.send("page", {type:args.type});
})