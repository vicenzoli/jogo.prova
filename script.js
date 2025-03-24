const canvas = document.getElementById('jogoCanvas')
const ctx = canvas.getContext('2d')

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
        this.x = x
        this.y = y
        this.largura = largura
        this.altura = altura
    }
    desenhar() {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.x, this.y, this.largura, this.altura)
    }
}

class Cobra extends Entidade {
    constructor(x, y, largura, altura) {
        super(x, y, largura, altura)
    }
    atualizar() {
        if (teclasPressionadas.KeyW) {
            this.y -= 7
        } else if (teclasPressionadas.KeyS) {
            this.y += 7
        } else if (teclasPressionadas.KeyA) {
            this.x -= 7
        } else if (teclasPressionadas.KeyD) {
            this.x += 7
        }

        // Verifica se a cobra bateu nas paredes
        if (this.x < 0 || this.x + this.largura > canvas.width || this.y < 0 || this.y + this.altura > canvas.height) {
            gameOver();
        }
    }
    verificarColisao(comida) {
        // Verifica se a cobra colidiu com a comida
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
        super(Math.random() * (canvas.width - 20), Math.random() * (canvas.height - 20), 20, 20)
    }
    desenhar() {
        ctx.fillStyle = 'red'; // Define a cor da comida como vermelha
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

// Variável para armazenar a pontuação
let pontuacao = 0;
let jogoAtivo = true;

const cobra = new Cobra(100, 200, 20, 20)
const comida = new Comida()

function desenharPontuacao() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Pontuação: ' + pontuacao, 10, 30); // Desenha a pontuação no canto superior esquerdo
}

function gameOver() {
    jogoAtivo = false;
    ctx.fillStyle = 'red';
    ctx.font = '40px Arial';
    ctx.fillText('GAME OVER', canvas.width / 4, canvas.height / 2);
}

function loop() {
    if (!jogoAtivo) return; // Interrompe o jogo se o game over ocorrer

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    cobra.desenhar()
    cobra.atualizar()
    comida.desenhar()

    // Verifica colisão e incrementa a pontuação
    if (cobra.verificarColisao(comida)) {
        pontuacao += 1; // Aumenta 1 ponto sempre que a cobra comer a comida
        comida.x = Math.random() * (canvas.width - 20); // Move a comida para uma nova posição
        comida.y = Math.random() * (canvas.height - 20);
    }

    desenharPontuacao(); // Desenha a pontuação

    requestAnimationFrame(loop)
}

loop()