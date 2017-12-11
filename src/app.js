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