/*Variaveis*/

const logo = {
    container: document.getElementById('logo_anima'),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './json/logo.json'
};

const conversa_div = document.getElementById('chat');
const conversa = lottie.loadAnimation({
    container: document.getElementById('chat'),
    renderer: 'svg',
    loop: true,
    autoplay: false,
    path: './json/conversa.json'
});

/*Funções*/

/*Eventos*/

const observer = new IntersectionObserver(
    entries =>{
        entries[0].isIntersecting ?conversa.play():conversa.pause();
    },{threshold: 0.7}
);

/*Inicializações*/

observer.observe(conversa_div);
lottie.loadAnimation(logo);