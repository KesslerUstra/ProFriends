/*Variaveis*/

import "./script_socket.mjs";
import { mensagemGeral, mensagemEspecifica, contatosExistentes, contatoNovo, contatoOff, mensagemUsuario, criarEventListener, ativo, usuariosDigi } from "./script_socket.mjs";

var socket, digitando;

const nome = document.querySelector('#nome_usuario');

const btnEntrar = document.querySelector('#login');
const formEntrar = document.querySelector('.input_nome .form');
const section = document.querySelector('.input_nome');
const last = document.querySelectorAll('.last');

const menu_btn_abrir = document.querySelector('.menu_icone');
const menu_btn_fechar = document.querySelector('.btn_fechar');
const menu = document.querySelector('.contatos');

const input_message = document.getElementById('mensagem');
const btn_enviar = document.getElementById('enviar_btn');


/*Funções*/

function ativarChat(){
    socket.on('mensagem_geral', function(msg){mensagemGeral(msg)});
    socket.on('mensagem_especifica', function(msg){mensagemEspecifica(msg)});
    socket.on('contatos_existentes', function(contatos){contatosExistentes(contatos)});
    socket.on('contato_novo', function(contato){contatoNovo(contato)});
    socket.on('contato_saiu', function(nome){
        contatoOff(nome);
    });
    criarEventListener(document.getElementById('geral'),1);
    socket.on('digitando_chat', function(params){usuariosDigi(params)});

    socket.emit('contatos_existentes');
}

function enviarMsg(){
    if(ativo == 'Geral'){
        GeralDigi();
        socket.emit('mensagem_geral', {msg: input_message.value});
    }else{
        socket.emit('mensagem_especifica', {msg: input_message.value, chatuser: ativo});
    }
    mensagemUsuario(input_message.value);
    mensagem.value = '';
}

export function GeralDigi(){
    if(digitando == true){
        digitando = false;
        socket.emit('digitando_chat', 'Desativado');
    }
    return;
}

/*Eventos*/

btnEntrar.addEventListener('click', () =>{
    let sexoContato;
    let nomeContato = nome.value;
    document.getElementsByName('sexo').forEach(sexo => {
        if (sexo.checked){
            sexoContato = sexo.value;
        }
    });
    if(!nomeContato || !sexoContato){
        return;
    }
    section.classList.add('ativo');
    last.forEach(element => {
        element.addEventListener('transitionend', ()=>{
            section.remove();
        });
    });
    formEntrar.addEventListener('transitionend', ()=>{
        formEntrar.remove();
    });
    
    socket = io('', { query: {nome: nomeContato, sexo: sexoContato} });
    ativarChat();
});

menu_btn_abrir.addEventListener('click', () =>{
    menu.classList.add('ativo');
});

menu_btn_fechar.addEventListener('click', () =>{
    menu.classList.remove('ativo');
});

/*Eventos Socket*/

btn_enviar.addEventListener('click', (e) =>{
    e.preventDefault();
    if(input_message.value && typeof ativo !== 'undefined'){
        enviarMsg();
    }
});

input_message.addEventListener('keydown', (e)=>{
    if(input_message.value && typeof ativo !== 'undefined'){
        if(e.key == 'Enter'){
            enviarMsg();
        }
    }
});

//Funcionalidade Digitando

input_message.addEventListener('input', ()=>{
    if(ativo !== 'Geral'){
        return;
    }
    if(input_message.value){
        if(!digitando){
            socket.emit('digitando_chat', 'Ativo');
            digitando = true;
        }   
        return;
    }
    digitando = false;
    socket.emit('digitando_chat', 'Desativado');
});