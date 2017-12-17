let cronometro = document.getElementById('cronometro');
let play = document.getElementById('play');
let parar = document.getElementById("parar");
let footer = document.getElementById('footer');
let minutos = document.getElementById("minutos");
function init(){
    window.onkeyup = window.teclado;
    window.onmousemove = window.mouseMove;
    window.onmouseout = window.mouseOut;
    window.ondblclick = window.fullScreen;
    window.ondrop = window.dropArquivo;
    preencheSelectMinitos();
}
function mudaValorCronometro(event){
    if(event.target.value == 60){
        cronometro.innerHTML = "01h";
    }else{
        cronometro.innerHTML = dateHandler(event.target.value);
    }
}
function preencheSelectMinitos(){
    let options = [];
    let values = Array(60).fill(1).map((v,i)=>v+i);
    values.map(num=>{
        let optionDinamic = document.createElement("option");
        optionDinamic.value = num;
        optionDinamic.innerHTML = num;
        if(num == 5){
            optionDinamic.selected = true
        }
        options.push(optionDinamic);
    })
    // console.log(options);
    options.map(option=>{
        minutos.appendChild(option);
    })
    cronometro.innerHTML = dateHandler(minutos.value);
}
function dropArquivo(event){
    console.log(event)
}
function mouseMove(event){
    if(event){
        footer.hidden = false;
    }
}
function mouseOut(event){
    if(event){
        footer.hidden = true;
    }
}
function teclado(event){
    console.log(event.key);
    if(event.key == "Escape"){
        ipcRenderer.send("fullScreen-main", {value:false});
    }
}
let audio = document.getElementById("audio");
function envioArquivo(event){
    let nomeAudio = document.getElementById("tituloAudio");
    nomeAudio.innerHTML = event.target.files[0].name;
    audio.src = URL.createObjectURL(event.target.files[0]);
    audio.hidden = false;
    audio.onloadeddata = (event)=>{
        audio.currentTime = event.target.duration - 60 * minutos.value // 5MINUTOS
    }
    audio.onplay = (event)=>{
        // start();
    }
    audio.onpause = (event)=>{
        // pause();
    }
}
function envioImagem(event){
    console.log(event.target.files[0])
    if(event.target.files.length == 1){
        styleFundo(event.target.files[0]);
    }else{
        let files = event.target.files;
        let y = 0;
        setInterval(()=>{
            styleFundo(files[++y]);
            if(!files[y]){
                // clearInterval(time);
                y=0;
            }
        },10000);
    }
}
function styleFundo(files){
    document.body.style.background = `url(${URL.createObjectURL(files)}) no-repeat center center fixed`;
    document.body.style.backgroundColor = "black";
    document.body.style.webkitBackgroundSize = "cover";
    document.body.style.backgroundSize = "cover";
}
function audioEvent(event){
    console.log(event)
}
let timeId;
let i = 0;
let time;
function start(){
    // audio.play();  
        timeId = setInterval(()=>{
            --i;
            time = dateHandler(minutos.value, i.toString());
            cronometro.innerHTML = time;
            if(time.includes('00:00')){
                reset()
                fullScreenOff()
            }
        }, 1000, timeId);
        // audio.play()
        play.hidden = true;
        parar.hidden = false;
}
function pause(){
        clearInterval(timeId);
        // audio.pause();
        play.hidden = false;
        parar.hidden = true;
}
function reset(){
    window.location.reload();
}
function dateHandler(minutos, segundos = "00"){
    return new Date(new Date().getFullYear(),
                new Date().getMonth(), 
                new Date().getDate(), 
                "00", minutos, segundos)
                .toLocaleTimeString('pt-br',{minute:'2-digit',second:'2-digit'});
}
// let audio = document.getElementById("audio");
let canvas, ctx, source, context, analyser, fbc_array, bars, bar_x, bar_width, bar_height;
// let microfone = document.getElementById("microfone");
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
audio.addEventListener("loadeddata", initMp3Player, false);
canvas.style.position = 'absolute';
canvas.style.zIndex = 0;
canvas.style.top = "0px"
document.getElementById('fundo').appendChild(canvas);
function initMp3Player(){
    // microfone.checked = false;
    cronometro.style.fontSize = "12vw"
    cronometro.style.margin = "22vw 22vw"
    audio.loop = true;
    context = new AudioContext();
    analyser = context.createAnalyser(); 
    source = context.createMediaElementSource(audio); 
    source.connect(analyser);
    analyser.connect(context.destination);
    frameLooper(analyser);
}
let cor = '#'+Math.floor(Math.random()*16777215).toString(16);
let cor1 = '#'+Math.floor(Math.random()*16777215).toString(16);
let cor2 = '#'+Math.floor(Math.random()*16777215).toString(16);
function frameLooper(){
    window.requestAnimationFrame(frameLooper);
    fbc_array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fbc_array);

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.save();
    ctx.globalCompositeOperation='source-over';
    ctx.scale(0.5, 0.5);
    ctx.translate(window.innerWidth, window.innerHeight);

    var bass = Math.floor(fbc_array[1]); //1Hz Frequenz 
    var radius = 0.60 * window.innerWidth <= 450 ? -(bass * 0.15 + 0.45 * window.innerWidth) : -(bass * 0.15 + 450);
    var bar_length_factor = 1;
    if (window.innerWidth >= 785) {
        bar_length_factor = 1.0;
    }
    else if (window.innerWidth < 785) {
        bar_length_factor = 2.5;
    }
    else if (window.innerWidth < 500) {
        bar_length_factor = 20.0;
    }
    // console.log(window.innerWidth);
    bars = fbc_array.length;
    let rotacao = (180 / 128) * Math.PI/180;
    for (var i = 0; i < bars; i++) {
        bar_x = i * 3;
        bar_height = -(fbc_array[i] * bar_length_factor);
        ctx.fillStyle = cor; // Color of the bars'#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, bar_height);
        ctx.rotate(rotacao+1);
    }
    for (var i = 0; i < bars; i++) {
        bar_x = i * 3;
        // bar_width = 3;
        bar_height = -(fbc_array[i] / bar_length_factor);
        ctx.fillStyle = cor1; // Color of the bars'#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.rotate(-rotacao);
        ctx.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, bar_height);
    }
    for (var i = 0; i < bars; i++) {
        bar_x = i * 3;
        bar_width = 3;
        bar_height = -(fbc_array[i]);
        ctx.fillStyle = cor2; // Color of the bars'#'+Math.floor(Math.random()*16777215).toString(16);
        ctx.rotate(rotacao+2);
        ctx.fillRect(0, radius, window.innerWidth <= 450 ? 2 : 3, bar_height);
    }
    ctx.restore();
}
const importAudio = (event)=>{
    audio.src = URL.createObjectURL(event.target.files[0]);
}

// if(microfone.checked == false){
//     stm.stop();
// }
// navigator.getUserMedia({audio:true}, (stream)=>{
//     let AudioCtx = new AudioContext();
//     analyser = AudioCtx.createAnalyser();
//     let media = AudioCtx.createMediaStreamSource(stream);
//     media.connect(analyser);
//     analyser.connect(AudioCtx.destination)   
//     frameLooper();
//     // let array = new Uint8Array(analise.frequencyBinCount);
//     // analise.getByteFrequencyData(array);
// },(err)=>{
//     console.log(err);
// });
// function mick(){
//     if(microfone.checked == false){
//         navigator.per
//     }
// }
// navigator.mediaDevices.ondevicechange = e =>{
//     console.log(e)
// }