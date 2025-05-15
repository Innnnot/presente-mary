// Array com as imagens do jogo
const imagens = [
    {
        url: 'images/gatinha1.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinha2.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinha3.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinha4.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinha5.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinha6.jpg',
        tipo: 'gatinha'
    },
    {
        url: 'images/gatinho1.jpeg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho2.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho3.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho4.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho5.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho6.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho7.jpg',
        tipo: 'gatinho'
    },
    {
        url: 'images/gatinho8.jpg',
        tipo: 'gatinho'
    }
];

let pontuacao = 0;
let imagemAtual = null;
let imagensDisponiveis = [...imagens]; // Array para controlar imagens disponíveis
let highScore = 0;
const HIGH_SCORE_KEY = 'gatinhoHighScore';
let jogoAtivo = true;
let recordeBatido = false;

// Elementos do DOM
const gameImage = document.getElementById('gameImage');
const scoreValue = document.getElementById('scoreValue');
const btnGatinho = document.getElementById('btnGatinho');
const btnGatinha = document.getElementById('btnGatinha');

// Função para carregar o high score do localStorage
function carregarHighScore() {
    const savedScore = localStorage.getItem(HIGH_SCORE_KEY);
    if (savedScore !== null) {
        highScore = parseInt(savedScore);
        atualizarHighScoreDisplay();
    }
}

// Função para salvar o high score
function salvarHighScore() {
    if (pontuacao > highScore) {
        highScore = pontuacao;
        localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
        atualizarHighScoreDisplay();
        mostrarParabens();
    }
}

// Função para atualizar o display do high score
function atualizarHighScoreDisplay() {
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
        highScoreElement.textContent = highScore;
    }
}

// Função para mostrar mensagem de parabéns quando bate recorde
function mostrarParabens() {
    const modal = document.getElementById('recordeModal');
    const mensagem = document.getElementById('recordeMensagem');
    if (modal && mensagem) {
        mensagem.textContent = `Parabéns! Novo recorde: ${highScore} pontos!`;
        modal.style.display = 'block';
        
        // Fecha o modal após 3 segundos
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }
}

// Adicione esta função no início do arquivo, após a declaração das variáveis
function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para escolher uma imagem aleatória
function escolherImagemAleatoria() {
    // Se não houver mais imagens disponíveis, recarrega todas e embaralha
    if (imagensDisponiveis.length === 0) {
        imagensDisponiveis = [...imagens];
        embaralharArray(imagensDisponiveis);
    }

    // Pega a próxima imagem do array embaralhado
    imagemAtual = imagensDisponiveis.pop();

    // Tenta carregar a imagem
    const tempImage = new Image();
    tempImage.onload = () => {
        gameImage.loading = "lazy";
        gameImage.src = imagemAtual.url;
        gameImage.style.display = 'block';
        document.querySelector('.buttons').style.display = 'flex';
    };
    tempImage.onerror = () => {
        console.error(`Erro ao carregar imagem: ${imagemAtual.url}`);
        escolherImagemAleatoria(); // Tenta outra imagem
    };
    tempImage.src = imagemAtual.url;
}

// Função para verificar resposta
function verificarResposta(resposta) {
    if (!imagemAtual || !jogoAtivo) return;

    if (resposta === imagemAtual.tipo) {
        pontuacao++;
        gameImage.classList.add('correct');
        if (pontuacao > highScore) {
            highScore = pontuacao;
            recordeBatido = true;
            localStorage.setItem(HIGH_SCORE_KEY, highScore.toString());
            atualizarHighScoreDisplay();
        }
    } else {
        gameImage.classList.add('wrong');
        jogoAtivo = false; // Para o jogo
        mostrarGameOver();
        return;
    }
    
    scoreValue.textContent = pontuacao;
    
    btnGatinho.disabled = true;
    btnGatinha.disabled = true;
    
    setTimeout(() => {
        gameImage.classList.remove('correct', 'wrong');
        btnGatinho.disabled = false;
        btnGatinha.disabled = false;
        if (jogoAtivo) {
            escolherImagemAleatoria();
        }
    }, 500);
}

// Função para mostrar mensagem de game over
function mostrarGameOver() {
    const modal = document.getElementById('gameOverModal');
    const mensagem = document.getElementById('gameOverMensagem');
    if (modal && mensagem) {
        let mensagemTexto = `Você errou! Pontuação final: ${pontuacao}`;
        if (recordeBatido) {
            mensagemTexto += `\nParabéns! Novo recorde: ${highScore} pontos!`;
        } else {
            mensagemTexto += `\nRecorde atual: ${highScore} pontos`;
        }
        mensagem.innerHTML = mensagemTexto.replace('\n', '<br>');
        modal.style.display = 'block';
    }
}

// Função para reiniciar o jogo
function reiniciarJogo() {
    pontuacao = 0;
    jogoAtivo = true;
    recordeBatido = false;
    scoreValue.textContent = '0';
    
    // Recarrega e embaralha todas as imagens
    imagensDisponiveis = [...imagens];
    embaralharArray(imagensDisponiveis);
    
    const modal = document.getElementById('gameOverModal');
    if (modal) {
        modal.style.display = 'none';
    }
    escolherImagemAleatoria();
}

// Event listeners
btnGatinho.addEventListener('click', () => verificarResposta('gatinho'));
btnGatinha.addEventListener('click', () => verificarResposta('gatinha'));

// Adicione estes estilos ao seu CSS
const style = document.createElement('style');
style.textContent = `
    .correct {
        animation: flash-green 0.5s;
    }
    .wrong {
        animation: flash-red 0.5s;
    }
    @keyframes flash-green {
        0% { filter: brightness(100%); }
        50% { filter: brightness(150%) sepia(100%) hue-rotate(50deg); }
        100% { filter: brightness(100%); }
    }
    @keyframes flash-red {
        0% { filter: brightness(100%); }
        50% { filter: brightness(150%) sepia(100%) hue-rotate(-50deg); }
        100% { filter: brightness(100%); }
    }
`;
document.head.appendChild(style);

// Iniciar o jogo
embaralharArray(imagensDisponiveis);
escolherImagemAleatoria();
carregarHighScore(); // Carrega o high score quando o jogo inicia
