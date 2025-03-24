const canvas = document.getElementById('jogoCanvas');
const ctx = canvas.getContext('2d');

const teclasPressionadas = {
    KeyW: false,
    KeyS: false,
    KeyD: false,
    KeyA: false
};

document.addEventListener('keydown', (e) => {
    for (let tecla in teclasPressionadas) {
        if (teclasPressionadas.hasOwnProperty(e.code)) {
            teclasPressionadas[tecla] = false;
        }
    }
    if (teclasPressionadas.hasOwnProperty(e.code)) {
        teclasPressionadas[e.code] = true;
    }
});

class Entidade {
    constructor(x, y, largura, altura) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
    }
    desenhar() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura);
    }
    atualizar() {
        if (teclasPressionadas.KeyW) {
            this.y -= 7;
        } else if (teclasPressionadas.KeyS) {
            this.y += 7;
        } else if (teclasPressionadas.KeyA) {
            this.x -= 7;
        } else if (teclasPressionadas.KeyD) {
            this.x += 7;
        }

        if (this.x < 0 || this.x + this.largura > canvas.width || this.y < 0 || this.y + this.altura > canvas.height) {
            gameOver();
        }
    }
    verificarColisao(comida) {
        if (
            this.x < comida.x + comida.largura &&
            this.x + this.largura > comida.x &&
            this.y < comida.y + comida.altura &&
            this.y + this.altura > comida.y
        ) {
            return true;
        }
        return false;
    }
}

class Comida extends Entidade {
    constructor() {
        super(Math.random() * (canvas.width - 20), Math.random() * (canvas.height - 20), 20, 20);
    }
    desenhar() {
        ctx.fillStyle = 'red'; 
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

let pontuacao = 0;
let jogoAtivo = true;

const cobra = new Cobra(100, 200, 20, 20);
const comida = new Comida();

// Carregar a imagem de fundo
const imagemFundo = new Image();
imagemFundo.src = 'https://static.vecteezy.com/ti/fotos-gratis/p1/9221341-tela-verde-8k-ultra-hd-plus-gratis-foto.jpg'; // Coloque o caminho correto da imagem

imagemFundo.onload = function() {
    loop(); // Iniciar o loop após a imagem ter carregado
}

function desenharPontuacao() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + pontuacao, 10, 30); 
}

function gameOver() {
    jogoAtivo = false;
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('GAME OVER', canvas.width / 4, canvas.height / 2);
}

function loop() {
    if (!jogoAtivo) return;

    // Desenhar o fundo
    ctx.drawImage(imagemFundo, 0, 0, canvas.width, canvas.height); // Ajuste o tamanho do fundo para o tamanho do canvas

    cobra.desenhar();
    cobra.atualizar();
    comida.desenhar();

    if (cobra.verificarColisao(comida)) {
        pontuacao += 1;
        comida.x = Math.random() * (canvas.width - 20); 
        comida.y = Math.random() * (canvas.height - 20);
    }

    desenharPontuacao();

    requestAnimationFrame(loop);
}