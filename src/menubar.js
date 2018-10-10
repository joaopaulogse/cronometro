const { remote } = require("electron");
const { BrowserWindow, Notification, screen } = remote;
let win;
let isStarted;

let { value: minutesGlobal } = document.getElementById('minutes');   
let { value: secondsGlobal } = document.getElementById('seconds');   
let {checked: colorGlobal } = document.getElementById('color');   
let {checked: backgroundGlobal } = document.getElementById('background');
let isFullScreen = false;
const notification = (message, options = {}) => {
    return new Notification({
        title:'Time',
        body: message,
        silent: true,
        ...options
    });
}
function openWindow(){
    if(!!!win){
        win = new BrowserWindow({ width: 800, height: 600, transparent:true, frame:true, resizable:true });
        win.on('close', ()=>{
            win = undefined;
        })
    }
    colorGlobal = color === true ? 'white' : 'black';
    win.loadURL(`file://${__dirname}/index.html?hours=01&minutes=${minutesGlobal}&seconds=${secondsGlobal}&color=${colorGlobal}&background=${backgroundGlobal}`);
}
function closeWindow(){
    if(!!win){
        win.close();
        win = undefined;
    }
}
function start(){
    if(!!win){
        if(isStarted !== true){
            win.emit('command', 'start');
            isStarted = true;
        }
    }else{
        notification('Nenhuma pagina aberta').show();
    }
}
function stop(){
    if(!!win){
        win.emit('command', 'stop');
        isStarted = false
    }else{
        notification('Nenhuma pagina aberta').show();
    }
}

function fullScreen(){
    if(!!win){
        isFullScreen = !isFullScreen;
        win.setFullScreen(isFullScreen)
        win.flashFrame(false)
        
    }
}

document.getElementById('color').addEventListener('change', (event)=>{
    colorGlobal = event.target.checked === true ? 'white' : 'black';
    if(!!win){
        win.emit('colors', {
            color: colorGlobal,
            background: backgroundGlobal
        });
    }
});
document.getElementById('background').addEventListener('change', (event)=>{
    backgroundGlobal = event.target.checked;
    if(!!win){
        win.emit('colors', {
            background: backgroundGlobal,
            color: colorGlobal
        });
    }
});

document.getElementById('minutes').addEventListener('change', (event)=>{
    minutesGlobal = event.target.value;
    if(!!win){
        win.emit('time', {
            minutes: minutesGlobal,
            seconds: secondsGlobal
        })
    }
});

document.getElementById('seconds').addEventListener('change', (event)=>{
    secondsGlobal = event.target.value;
    if(!!win){
        win.emit('time', {
            minutes: minutesGlobal,
            seconds: secondsGlobal
        })
    }
});