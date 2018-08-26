let cronometro = document.getElementById('cronometro');
const { remote } = require("electron");
const { Notification } = remote;
const moment = require('moment');
const url = new URLSearchParams(location.search);
const seconds = url.get('seconds');
const hours = url.get('hours');
const minutes = url.get('minutes');
const color = url.get('color');
const background = url.get('background');
let date;
function init(){
    console.log(seconds, hours, minutes, color, background)
    document.body.style.color = color;
    if(background == "true"){
        document.body.style.background = color === 'white' ? 'rgba(0, 0, 0)': 'rgba(255, 255, 255)';;
        document.body.style.backgroundColor = color === 'white' ? 'black': 'white';
    }
    date = moment().hours(hours).minutes(minutes).seconds(seconds);
    cronometro.innerHTML = date.format('mm:ss');
}
const notification = (message, options = {}) => {
    return new Notification({
        title:'Time',
        body: message,
        silent: true,
        ...options
    });
}
let timeId;
const start = (date) => {
    timeId = setInterval(()=>{
        let chronos = date.subtract(1, 'seconds').format('mm:ss')
        cronometro.innerHTML = chronos;
        if(chronos.includes('00:00')){
            notification('Tempo acabou!').show();
            remote.getCurrentWindow().close();
        }
    }, 1000, timeId);
}
const stop = () => {
    clearInterval(timeId);
}
remote.getCurrentWindow().on('command', data => {
    if(data === 'start'){
        start(date);
    }
    if(data === 'stop'){
        stop();
    }
});
remote.getCurrentWindow().on('colors', ({ background, color }) => {
    document.body.style.color = color;
    if(background == true){
        document.body.style.backgroundColor = color === 'white' ? 'black': 'white';
    }else{
        document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }
});

remote.getCurrentWindow().on('time', ({minutes, seconds})=>{
    date = moment({seconds, minutes});
    console.log(date);
    cronometro.innerHTML = date.format('mm:ss');
})