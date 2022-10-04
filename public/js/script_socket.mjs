import { GeralDigi } from  "./script_chat_geral.js"

var chat_msgs = [];
var users_digi= [];
chat_msgs.push({nome: 'Geral', msgs: []});
export var ativo;

export function contatosExistentes(contatos){
        const lista_chat = document.querySelector('.contatos .lista');
        contatos.forEach(element => {
                let user = criarContato(element.nome, element.sexo);
                chat_msgs.push({nome: element.nome, notifications: 0, msgs: []});
                lista_chat.append(user);
        });
        return;
}

export function contatoNovo(contato){
        const lista_chat = document.querySelector('.contatos .lista');
        let user = criarContato(contato.nome, contato.sexo);
        chat_msgs.push({nome: contato.nome, notifications: 0, msgs: []});
        lista_chat.append(user);
        return;
}

export function contatoOff(nomeUser){
        const lista_chat = Array.from(document.querySelector('.contatos .lista').children);
        let userExit = chat_msgs.findIndex(element => element.nome == nomeUser.nome);
        chat_msgs.splice(userExit,1);
        lista_chat.forEach(element =>{
                if(nomeUser.nome == element.children[1].innerHTML){
                        element.remove();
                }
        });
        return;
}

export function mensagemGeral(msgArray){
        let chat = document.querySelector('.chat_msg');
        adicionarMsg(msgArray.msg, msgArray.nome, 'Geral');
        if(ativo == 'Geral'){
                let msgF = criarDivMsg(msgArray.msg, msgArray.nome);
                chat.prepend(msgF);
        }
}

export function mensagemEspecifica(msgArray){
        let chat = document.querySelector('.chat_msg');
        adicionarMsg(msgArray.msg, msgArray.nome, msgArray.nome);
        if(ativo == msgArray.nome){
                let msgF = criarDivMsg(msgArray.msg, msgArray.nome);
                chat.prepend(msgF);
        }
}

export function mensagemUsuario(msg){
        let chat = document.querySelector('.chat_msg');
        let msgF = criarDivMsg(msg);
        adicionarMsg(msg, undefined, ativo);
        chat.prepend(msgF);
}

export function criarEventListener(element,idx){
        if(idx == 0){
                element.addEventListener('click', (e) =>{
                        let nome_chat = document.querySelector('.conversa .info_contato');
                        nome_chat.innerHTML = '';
                        ativo = e.currentTarget.children[1].innerHTML;
                        let i = document.createElement('i');
                        let h3 = document.createElement('h3');
                        i.classList.add("fa-solid", "fa-user");
                        h3.innerHTML = ativo;
                        nome_chat.prepend(h3);
                        nome_chat.prepend(i);
                        i.classList.add(e.currentTarget.classList[0]);
                        historicoChat();
                        GeralDigi();
                        digitacao();
                });
                return;
        }
        element.addEventListener('click', (e) => {
                ativo = 'Geral';
                digitacao();
                let nome_chat = document.querySelector('.conversa .info_contato');
                nome_chat.innerHTML = '';
                let i = document.createElement('i');
                let h3 = document.createElement('h3');
                i.classList.add("fa-solid", "fa-users");
                h3.innerHTML = ativo;
                nome_chat.className = 'info_contato';
                nome_chat.prepend(h3);
                nome_chat.prepend(i);
                historicoChat();
        });
}

export function usuariosDigi(params){
        let idx = users_digi.indexOf(params.nome);
        if(params.flag == 'Desativado'){
                if (idx > -1) {
                        users_digi.splice(idx, 1);
                        digitacao();
                }
                return;
        }
        if(idx != -1){
                return;
        }
        users_digi.push(params.nome);
        digitacao();
}

//Funções Não Exportadas

function digitacao(){
        let div_users = document.querySelector('.user_digi');
        if(ativo != "Geral"){
                div_users.classList.remove('ativo');
                return;
        }
        if(users_digi.length < 1){
                div_users.classList.remove('ativo');
                return;
        }
        let msg = '';
        if(users_digi.length > 2){
                msg += 'Muitos usuários estão digitando'
        }else{
                users_digi.forEach(element =>{
                        msg += element + ' ';
                });
                msg += 'esta digitando';
        }
        div_users.innerHTML = msg;
        div_users.classList.add('ativo');
}

function notificacao(chat, quantidade){
        let butttonEsc = chat.replace("#","_");
        butttonEsc = butttonEsc.replace(/[ ]/g,"_");
        let chatButton = document.querySelector('.'+butttonEsc);
        chatButton.children[2].classList.add('ativo');
        chatButton.children[2].innerHTML = quantidade;
}

function historicoChat(){
        let msgsChat = chat_msgs.find(element => element.nome == ativo);
        let chat = document.querySelector('.chat_msg');
        chat.innerHTML = '';
        if(ativo != 'Geral'){
                msgsChat.notifications = 0;
                let butttonEsc = ativo.replace("#","_");
                butttonEsc = butttonEsc.replace(/[ ]/g,"_");
                let chatButton = document.querySelector('.'+butttonEsc);
                chatButton.children[2].innerHTML = 0;
                chatButton.children[2].classList.remove('ativo');
        }
        msgsChat.msgs.forEach(element =>{
                let msg;
                if(!!element.nome){
                        msg = criarDivMsg(element.mensagem, element.nome);
                }else{
                        msg = criarDivMsg(element.mensagem);
                }
                chat.prepend(msg);
        });
}

function criarContato(nome, sexo){
        let div = document.createElement('div');
        let i = document.createElement('i');
        let p = document.createElement('p');
        i.classList.add("fa-solid", "fa-user");
        let classe = nome.replace("#","_");
        classe = classe.replace(/[ ]/g,"_");
        div.classList.add(sexo, classe);
        p.classList.add('noti');
        let span = document.createElement('span');
        span.innerHTML = nome;
        div.append(i);
        div.append(span);
        div.append(p);
        criarEventListener(div,0);
        return div;
}

function criarDivMsg(msg, autor){
        let div = document.createElement('div');
        let p = document.createElement('p');
        p.innerHTML = msg;
        div.append(p);
        if(typeof autor !== 'undefined'){
                let span = document.createElement('span');
                span.innerHTML = autor;
                div.append(span);
        }else{
                div.classList.add('ps');
        }
        return div;
}

function adicionarMsg(msg, autor, chat){
        chat_msgs.forEach(chatElement =>{
                if(chatElement.nome == chat){
                        let novaMsg
                        if(typeof autor !== 'undefined'){
                                if(ativo != autor && chat != 'Geral'){
                                        chatElement.notifications ++;
                                        notificacao(chat, chatElement.notifications);
                                }
                                novaMsg = {
                                        nome: autor,
                                        mensagem: msg
                                } 
                        }else{
                                novaMsg = {
                                        mensagem: msg
                                }
                        }
                        chatElement.msgs.push(novaMsg);
                }
        });
}