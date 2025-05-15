const historico = [];
const TEMA_KEY = 'temaPreferido';

function calcular() {
    const pesoAtual = parseFloat(document.getElementById("pesoAtual").value);
    const tipoGalao = parseInt(document.querySelector('input[name="galao"]:checked').value);
    const TARA = 170; // Tara do galão em gramas
    
    // Converter litros para gramas (1ml = 1g para essências)
    const capacidadeMaxima = tipoGalao * 1000; // Converte litros para gramas

    if (isNaN(pesoAtual)) {
        mostrarErro("Por favor, insira um peso válido.");
        return;
    }

    // Subtrair a tara do peso atual
    const pesoLiquido = pesoAtual - TARA;

    if (pesoLiquido < 0) {
        mostrarErro(`O peso inserido (${pesoAtual}g) é menor que a tara do galão (${TARA}g)`);
        return;
    }

    if (pesoLiquido > capacidadeMaxima) {
        mostrarErro(`O peso líquido (${pesoLiquido}g) excede a capacidade do galão de ${tipoGalao}L (${capacidadeMaxima}g)`);
        return;
    }

    // Cálculos
    const restanteGramas = pesoLiquido;
    const gastoGramas = capacidadeMaxima - pesoLiquido;

    // Exibir resultados
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.innerHTML = `
        <div class="resultado-item">
            <span class="label">Peso Bruto:</span>
            <span class="valor">${pesoAtual.toFixed(0)}g</span>
        </div>
        <div class="resultado-item">
            <span class="label">Tara do Galão:</span>
            <span class="valor">${TARA}g</span>
        </div>
        <div class="resultado-item">
            <span class="label">Peso Líquido:</span>
            <span class="valor">${pesoLiquido.toFixed(0)}g (${pesoLiquido.toFixed(0)}mL)</span>
        </div>
        <div class="resultado-item">
            <span class="label">Gasto:</span>
            <span class="valor">${gastoGramas.toFixed(0)}g (${gastoGramas.toFixed(0)}mL)</span>
        </div>
    `;

    // Adicionar ao histórico
    adicionarHistorico({
        tipoGalao,
        pesoBruto: pesoAtual.toFixed(0),
        pesoLiquido: pesoLiquido.toFixed(0),
        gasto: gastoGramas.toFixed(0),
        data: new Date().toLocaleTimeString()
    });
}

function mostrarErro(mensagem) {
    const modal = document.getElementById("modalErro");
    const mensagemErro = document.getElementById("mensagemErro");
    mensagemErro.textContent = mensagem;
    modal.style.display = "block";
}

function salvarHistoricoNoLocalStorage() {
    localStorage.setItem("historico", JSON.stringify(historico));
}

function carregarHistoricoDoLocalStorage() {
    const historicoSalvo = localStorage.getItem("historico");
    if (historicoSalvo) {
        historico.push(...JSON.parse(historicoSalvo));
        atualizarHistoricoNaTela();
    }
}

function adicionarHistorico(dados) {
    // Garante que só armazenamos dados primitivos
    const itemHistorico = {
        tipoGalao: dados.tipoGalao,
        pesoBruto: dados.pesoBruto,
        pesoLiquido: dados.pesoLiquido,
        gasto: dados.gasto,
        data: new Date().toLocaleTimeString() // Formato: "14:30:25"
    };

    historico.unshift(itemHistorico);
    if (historico.length > 5) historico.pop();
    salvarHistoricoNoLocalStorage();
    atualizarHistoricoNaTela();
}

function atualizarHistoricoNaTela() {
    const lista = document.getElementById("historicoLista");
    if (!lista) return;

    lista.innerHTML = "";

    historico.forEach((item, index) => {
        if (item && item.tipoGalao && item.pesoLiquido) {
            const li = document.createElement("li");
            li.innerHTML = `
                ${index + 1}. [${item.data || "---"}] Galão ${item.tipoGalao}L
                <br>Peso Bruto: ${item.pesoBruto}g
                <br>Peso Líquido: ${item.pesoLiquido}g (${item.pesoLiquido}mL)
                <br>Gasto: ${item.gasto}g (${item.gasto}mL)
            `;
            lista.appendChild(li);
        }
    });
}

function limparHistorico() {
    historico.length = 0;
    localStorage.removeItem("historico");
    atualizarHistoricoNaTela();
}

function mudarTema(temaNome) {
    // Desabilita todos os temas
    const todosTemas = document.querySelectorAll('link[id^="tema-"]');
    todosTemas.forEach(tema => {
        tema.disabled = true;
    });

    // Se não for o tema original, habilita o tema selecionado
    if (temaNome !== 'original') {
        const temaLink = document.getElementById(`tema-${temaNome}`);
        if (temaLink) {
            temaLink.disabled = false;
        }
    }

    // Salva a preferência do usuário
    localStorage.setItem(TEMA_KEY, temaNome);

    // Fecha o menu
    document.querySelector('.tema-menu').classList.remove('aberto');
}

// Função para carregar o tema preferido
function carregarTemaPreferido() {
    const temaSalvo = localStorage.getItem(TEMA_KEY);
    if (temaSalvo) {
        mudarTema(temaSalvo);
    } else {
        mudarTema('original'); // Tema padrão caso não haja preferência salva
    }
}

function atualizarAjuda() {
    const pesoAtualElement = document.getElementById("pesoAtual");
    const ajudaElement = document.getElementById("pesoAjuda");
    
    if (!pesoAtualElement || !ajudaElement) return;

    const pesoAtual = parseFloat(pesoAtualElement.value);
    const tipoGalao = parseInt(document.querySelector('input[name="galao"]:checked')?.value || 1);
    const capacidadeMaxima = tipoGalao * 1000;

    if (!isNaN(pesoAtual)) {
        if (pesoAtual > capacidadeMaxima) {
            ajudaElement.style.color = 'var(--cor-erro, #ff4444)';
            ajudaElement.textContent = `Atenção: O valor máximo para um galão de ${tipoGalao}L é ${capacidadeMaxima}g`;
        } else {
            ajudaElement.style.color = 'var(--cor-label)';
            ajudaElement.textContent = `Capacidade máxima do galão: ${capacidadeMaxima}g`;
        }
    } else {
        ajudaElement.textContent = `Capacidade máxima do galão: ${capacidadeMaxima}g`;
    }
}

// Espera o DOM carregar completamente antes de adicionar os event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar eventos do modal
    const closeButton = document.querySelector(".close-button");
    if (closeButton) {
        closeButton.onclick = function() {
            const modal = document.getElementById("modalErro");
            if (modal) modal.style.display = "none";
        };
    }

    // Configurar evento de clique fora do modal
    window.onclick = function(event) {
        const modal = document.getElementById("modalErro");
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    // Adicionar listeners para os radio buttons
    document.querySelectorAll('input[name="galao"]').forEach(radio => {
        radio.addEventListener('change', atualizarAjuda);
    });

    // Inicializar a ajuda
    atualizarAjuda();

    // Carregar histórico e tema preferido
    carregarHistoricoDoLocalStorage();
    carregarTemaPreferido();

    // Configurações para dispositivos móveis
    document.addEventListener('touchstart', function() {}, {passive: true});

    // Previne zoom em double-tap em iOS
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });

    // Previne bounce scroll em iOS
    document.body.addEventListener('touchmove', function(e) {
        if (e.target.closest('.nav-tabs')) return;
        e.preventDefault();
    }, { passive: false });

    // Controle do menu de temas
    const btnTema = document.getElementById('btnTema');
    if (btnTema) {
        btnTema.addEventListener('click', function(e) {
            e.stopPropagation();
            const menu = document.querySelector('.tema-menu');
            if (menu) menu.classList.toggle('aberto');
        });
    }

    // Fechar o menu ao clicar fora dele
    document.addEventListener('click', function(e) {
        const menu = document.querySelector('.tema-menu');
        const btnTema = document.getElementById('btnTema');
        
        if (menu && !menu.contains(e.target) && e.target !== btnTema) {
            menu.classList.remove('aberto');
        }
    });
});