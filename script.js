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
        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

class Cobra {
    constructor(x, y, largura, altura) {
        this.largura = largura;
        this.altura = altura;
        this.segmentos = [{ x, y }];
        this.direcao = null; // Para controlar a direção da cabeça da cobra
    }

    atualizar() {
        // Movimenta os segmentos da cobra, começando do final
        const cabeça = { ...this.segmentos[0] }; // A cabeça será copiada

        if (teclasPressionadas.KeyW && this.direcao !== 'S') {
            cabeça.y -= 7;
            this.direcao = 'W';
        } else if (teclasPressionadas.KeyS && this.direcao !== 'W') {
            cabeça.y += 7;
            this.direcao = 'S';
        } else if (teclasPressionadas.KeyA && this.direcao !== 'D') {
            cabeça.x -= 7;
            this.direcao = 'A';
        } else if (teclasPressionadas.KeyD && this.direcao !== 'A') {
            cabeça.x += 7;
            this.direcao = 'D';
        }

        // Adiciona a nova cabeça à frente
        this.segmentos.unshift(cabeça);

        // Remove o último segmento se a cobra não comeu
        this.segmentos.pop();

        // Verifica colisão com a parede
        if (
            cabeça.x < 0 ||
            cabeça.x + this.largura > canvas.width ||
            cabeça.y < 0 ||
            cabeça.y + this.altura > canvas.height
        ) {
            gameOver();
        }
    }

    verificarColisao(comida) {
        const cabeça = this.segmentos[0];
        if (
            cabeça.x < comida.x + comida.largura &&
            cabeça.x + this.largura > comida.x &&
            cabeça.y < comida.y + comida.altura &&
            cabeça.y + this.altura > comida.y
        ) {
            return true;
        }
        return false;
    }

    crescer() {
        // Não remove o último segmento ao movimentar, fazendo a cobra crescer
        const últimoSegmento = this.segmentos[this.segmentos.length - 1];
        this.segmentos.push({ ...últimoSegmento });
    }

    desenhar() {
        // Desenha todos os segmentos da cobra
        for (let i = 0; i < this.segmentos.length; i++) {
            const segmento = this.segmentos[i];
            ctx.fillStyle = 'black';
            ctx.fillRect(segmento.x, segmento.y, this.largura, this.altura);
        }
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cobra.desenhar();
    cobra.atualizar();
    comida.desenhar();

    // Verifica se a cobra comeu a comida
    if (cobra.verificarColisao(comida)) {
        pontuacao += 1;
        cobra.crescer(); // Faz a cobra crescer
        comida.x = Math.random() * (canvas.width - 20);
        comida.y = Math.random() * (canvas.height - 20);
    }

    desenharPontuacao();

    requestAnimationFrame(loop);
}

loop();