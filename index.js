const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const { PassThrough } = require('stream');
const io = new Server(server);

const port = process.env.PORT || 3000;

var usuarios = [];

app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) =>{
    res.sendFile('./html/index.html', {root: __dirname});
});

app.get('/chat', (req, res) =>{
    res.sendFile('./html/chat.html', {root: __dirname});
});

/*Conf Socket.io*/ 

io.on('connection', (socket) =>{

    /*Cadastrando usuario*/ 
    if(socket.handshake.query['nome'] && socket.handshake.query['sexo']) {
        let cNome, teste, corno;
        if(socket.handshake.query['nome'].length >= 30){
            corno = 'Dicionário Ambulante';
        }else if(socket.handshake.query['nome'] == 'Mike'){
            corno = 'Maiketeiro';
        }else if(socket.handshake.query['nome'] == 'Bruno'){
            corno = 'Cheat Vidas Infinitas';
        }

        do {
            teste = 1;
            if(corno){
                cNome = corno + '#' + (Math.floor(Math.random() * 9000) + 1000);
            }else{
                cNome = socket.handshake.query['nome'] + '#' + (Math.floor(Math.random() * 9000) + 1000);
            }
            usuarios.forEach(element =>{
                if(element.nomeUser == cNome){
                    teste = 0;
                }
            });
        } while (teste != 1);
        
        let user = {
            id: socket.id,
            nomeUser: cNome,
            sexoUser: socket.handshake.query['sexo']
        }

        usuarios.push(user);
        socket.broadcast.emit('contato_novo', {nome: cNome, sexo: socket.handshake.query['sexo']});
    }else{
        socket.disconnect(true);
    }

    /*Eventos Socket*/

    socket.on('contatos_existentes', ()=>{
        let arrayUsers = []
        usuarios.forEach(element =>{
            if(element.id != socket.id){
                let teste2 = {
                    nome: element.nomeUser,
                    sexo: element.sexoUser
                }
                arrayUsers.push(teste2);
            }
        });
        socket.emit('contatos_existentes', arrayUsers);
    });

    socket.on('mensagem_geral', (msgU) => {
        usuarios.forEach(element =>{
            if(element.id == socket.id){
                socket.broadcast.emit('mensagem_geral', {nome: element.nomeUser, msg: msgU.msg});
            }
        });
    });

    socket.on('mensagem_especifica', (msgU) =>{
        usuarios.forEach(element =>{
            if(element.id == socket.id){
                let userMsg = usuarios.findIndex(elemento => elemento.nomeUser == msgU.chatuser);
                if(userMsg != -1){
                    socket.to(usuarios[userMsg].id).emit('mensagem_especifica', {nome: element.nomeUser, msg: msgU.msg});
                }
            }
        });
    });

    socket.on('digitando_chat', (param) =>{
        let user = usuarios.find(elemento => elemento.id == socket.id);
        socket.broadcast.emit('digitando_chat', {nome: user.nomeUser, flag: param});
    });

    socket.on('disconnect', () => {
        try {
            if(usuarios.length > 1){
                usuarios.forEach(element =>{
                    if(element.id == socket.id){
                        socket.broadcast.emit('contato_saiu', {nome: element.nomeUser});
                        socket.broadcast.emit('digitando_chat', {nome: element.nomeUser, flag: 'Desativado'});
                    }
                });
            }

            let userExit = usuarios.findIndex(element => element.id == socket.id)
            usuarios.splice(userExit,1);
        } catch (error) {
            PassThrough;
        }
    })
});

app.use('/', (req, res) =>{
    res.sendFile('./html/404.html', {root: __dirname});
});

server.listen(port, () => {
    console.log(`Server rodando na porta ${port}...`);
})