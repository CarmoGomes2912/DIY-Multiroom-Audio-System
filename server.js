const express = require("express");
const app = express();
const multer = require("multer");
const WebSocket = require("ws");

const upload = multer({ dest: "uploads/" });

let queue = [];
let currentIndex = 0;

// servidor
const server = app.listen(3000, () => {
    console.log("Rodando em http://localhost:3000");
});

// websocket
const wss = new WebSocket.Server({ server });


// ================== PLAYER ==================
app.get("/player", (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<body style="background:black; color:white; text-align:center;">

<h1>🔊 Player</h1>
<div id="title">Nenhuma música</div>
<button onclick="ativar()">🔓 Ativar áudio</button>

<audio id="player"></audio>

<script>
const player = document.getElementById("player");
const title = document.getElementById("title");

player.onended = () => fetch("/next");

let liberado = false;

function ativar() {
    player.play().catch(()=>{});
    liberado = true;
    alert("Áudio liberado 👍");
}

const ws = new WebSocket("ws://" + location.host);

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.action === "play" && data.time && liberado) {
        const delay = data.time - Date.now();
        player.src = "/music?t=" + Date.now();
        title.innerText = "🎵 " + data.name;

        setTimeout(() => player.play(), Math.max(0, delay));
    }

    if (data.action === "play" && !data.time) player.play();
    if (data.action === "pause") player.pause();
    if (data.action === "volume") player.volume = Number(data.value);
};
</script>

</body>
</html>
`);
});


// ================== UPLOAD ==================
app.post("/upload", upload.single("audio"), (req, res) => {

    if (!req.file) {
        return res.status(400).send("Sem arquivo");
    }

    const file = {
        path: req.file.path,
        name: req.file.originalname
    };

    queue.push(file);

    // toca se for a primeira
    if (queue.length === 1) {
        playMusic(file);
    }

    res.send("ok");
});


// ================== FUNÇÃO PLAY ==================
function playMusic(file) {
    const startTime = Date.now() + 3000;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                action: "play",
                time: startTime,
                name: file.name
            }));
        }
    });
}


// ================== CONTROLES ==================
app.post("/control", express.json(), (req, res) => {
    const { action, value } = req.body;

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action, value }));
        }
    });

    res.send("ok");
});


// ================== MUSIC ==================
app.get("/music", (req, res) => {
    if (!queue[currentIndex]) return res.sendStatus(404);
    res.sendFile(__dirname + "/" + queue[currentIndex].path);
});


// ================== NEXT ==================
app.get("/next", (req, res) => {
    currentIndex++;

    if (!queue[currentIndex]) {
        currentIndex = 0;
        return res.send("fim");
    }

    playMusic(queue[currentIndex]);

    res.send("ok");
});


// ================== QUEUE ==================
app.get("/queue", (req, res) => {
    res.json({ queue, currentIndex });
});


// ================== CONTROLE UI ==================
app.get("/control", (req, res) => {
res.send(`
<!DOCTYPE html>
<html>
<body style="background:#111;color:white;text-align:center;">

<h1>🎛️ Controle</h1>

<input type="file" id="file"><br><br>
<button onclick="upload()">📤 Upload</button><br><br>

<button onclick="play()">▶️</button>
<button onclick="pause()">⏸️</button>
<button onclick="next()">⏭️</button>

<br><br>
<input type="range" min="0" max="1" step="0.01" oninput="volume(this.value)">

<h2>📃 Fila</h2>
<ul id="list"></ul>

<script>
async function upload(){
    const f = file.files[0];
    const fd = new FormData();
    fd.append("audio", f);

    await fetch("/upload",{method:"POST",body:fd});
}

function play(){
    fetch("/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"play"})});
}

function pause(){
    fetch("/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"pause"})});
}

function volume(v){
    fetch("/control",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"volume",value:v})});
}

function next(){
    fetch("/next");
}

async function load(){
    const res = await fetch("/queue");
    const data = await res.json();

    list.innerHTML="";

    data.queue.forEach((m,i)=>{
        const li = document.createElement("li");

        if(i===data.currentIndex){
            li.innerText="▶️ "+m.name;
            li.style.color="#0f0";
        }else{
            li.innerText=m.name;
        }

        list.appendChild(li);
    });
}

setInterval(load,1000);
</script>

</body>
</html>
`);
});
const { exec } = require("child_process");

setTimeout(() => {
    exec("start http://localhost:3000/control");
}, 2000);