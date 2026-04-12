# 🔊 DIY Multiroom Audio System
Um sistema de áudio multiroom sincronizado feito com Node.js + WebSocket + Web App (incluindo suporte para TVs Samsung Tizen).
> Controle músicas em tempo real e reproduza em múltiplos dispositivos ao mesmo tempo — tipo um Spotify Connect caseiro.

---

## 🚀 Funcionalidades

* 📤 Upload de músicas direto pelo navegador
* 🔊 Reprodução sincronizada em múltiplos dispositivos
* 📺 Suporte para TV (Tizen Web App)
* ▶️ Controles em tempo real:

  * Play
  * Pause
  * Volume
  * Próxima música
* 📃 Fila de músicas dinâmica
* ⚡ Comunicação via WebSocket (tempo real)

---

## 🧠 Como funciona

* Servidor em Node.js gerencia músicas e eventos
* WebSocket sincroniza todos os players
* Clientes (celular, PC, TV) recebem comandos ao mesmo tempo

---

## 📦 Instalação

### 1. Clonar o projeto

```bash
git clone https://github.com/seu-usuario/multiroom-audio.git
cd multiroom-audio
```

---

### 2. Instalar dependências

```bash
npm install express multer ws
```

---

### 3. Rodar o servidor

```bash
node server.js
```

Servidor rodando em:

```
http://localhost:3000
```

---

## 🎛️ Interface de controle

Acesse no navegador:

```
http://SEU_IP:3000/control
```

---

## 🔊 Player (celular / TV / PC)

```
http://SEU_IP:3000/player
```

> ⚠️ Importante: Substitua `SEU_IP` pelo IP do seu computador na rede (ex: 192.168.0.10)

---

## ⚠️ Problemas comuns

### ❌ Player não conecta

* Verifique IP no código
* Certifique-se que TV e PC estão na mesma rede

### ❌ Upload não funciona

* Verifique se selecionou um arquivo antes de enviar

---

## 💡 Ideias futuras

* 🎵 Suporte a streaming (Spotify API)
* 🏠 Nomear salas (Quarto, Sala, etc.)
* ⏱️ Sincronização mais precisa (NTP)
* 🎨 Interface estilo Spotify
* 📱 App mobile

---

## 🧑‍💻 Autor

Projeto criado por um estudante apaixonado por tecnologia 🤘

---

## ⭐ Contribuições

Pull requests são bem-vindos!
