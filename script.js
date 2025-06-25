  const formas = ['circle', 'square', 'triangle', 'star'];
  const cores = ['azul', 'vermelho', 'amarelo', 'verde'];
  let caminho = [];
  let erros = 0;
  let tempo = 0; // segundos
  let nomeJogador = '';
  let cronometro;
  let linhaAtual = 0;
  let corretas = {};

  function iniciarJogo() {
    const nomeInput = document.getElementById('nome').value.trim();
    if (!nomeInput) {
      alert('Digite seu nome para começar.');
      return;
    }
    nomeJogador = nomeInput;
    linhaAtual = 0;
    erros = 0;
    tempo = 0;
    corretas = {};
    caminho = [];

    document.getElementById('formulario').style.display = 'none';
    document.getElementById('fim-jogo-overlay').style.display = 'none';
    document.getElementById('fim-jogo-overlay').style.animation = 'none';
    document.getElementById('tabuleiro-container').style.display = 'block';
    document.querySelector('h1').style.display = 'block';

    document.getElementById('erros').textContent = erros;
    document.getElementById('tempo').textContent = formatarTempo(tempo);

    gerarTabuleiro();

    clearInterval(cronometro);
    cronometro = setInterval(() => {
      tempo++;
      document.getElementById('tempo').textContent = formatarTempo(tempo);
    }, 1000);
  }

  function gerarTabuleiro() {
    const tabuleiro = document.getElementById('tabuleiro');
    tabuleiro.innerHTML = '';

    for (let linha = 0; linha < 30; linha++) {
      const corretaColuna = Math.floor(Math.random() * 3);
      corretas[linha] = corretaColuna;
      const formasLinha = sortearFormasUnicas(3);

      for (let coluna = 0; coluna < 3; coluna++) {
        const forma = formasLinha[coluna];
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const casa = document.createElement('div');
        casa.classList.add('casa', forma, cor);
        casa.dataset.forma = forma;
        casa.dataset.cor = cor;
        casa.dataset.linha = linha;
        casa.dataset.coluna = coluna;
        casa.addEventListener('click', verificarJogada);
        caminho.push(casa);
        tabuleiro.appendChild(casa);
      }
    }
    ativarLinha(0);
  }

  function sortearFormasUnicas(qtd) {
    const formasCop = [...formas];
    for (let i = formasCop.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [formasCop[i], formasCop[j]] = [formasCop[j], formasCop[i]];
    }
    return formasCop.slice(0, qtd);
  }

  function ativarLinha(linha) {
    const casas = caminho.filter(c => parseInt(c.dataset.linha) === linha);
    casas.forEach(casa => casa.classList.add('ativa'));
    if (casas.length > 0) {
      casas[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function desativarLinha(linha) {
    const casas = caminho.filter(c => parseInt(c.dataset.linha) === linha);
    casas.forEach(casa => casa.classList.remove('ativa'));
  }

  function verificarJogada(event) {
    const casaClicada = event.currentTarget;
    const linha = parseInt(casaClicada.dataset.linha);
    const coluna = parseInt(casaClicada.dataset.coluna);

    if (linha !== linhaAtual) return;

    const correta = corretas[linha];

    if (coluna === correta) {
      casaClicada.style.opacity = '0.2';
      desativarLinha(linhaAtual);

      if (linhaAtual === 29) {
        fimDoJogo();
      } else {
        linhaAtual++;
        ativarLinha(linhaAtual);
      }
    } else {
      erros++;
      document.getElementById('erros').textContent = erros;
      piscarTelaErro();
    }
  }

  function piscarTelaErro() {
    document.body.classList.add('erro-piscar');
    setTimeout(() => {
      document.body.classList.remove('erro-piscar');
    }, 600);
  }

  function formatarTempo(segundos) {
    const m = String(Math.floor(segundos / 60)).padStart(2, '0');
    const s = String(segundos % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function fimDoJogo() {
    clearInterval(cronometro);
    document.getElementById('tabuleiro-container').style.display = 'none';
    document.querySelector('h1').style.display = 'none';

    const overlay = document.getElementById('fim-jogo-overlay');
    document.getElementById('fim-nome').textContent = nomeJogador;
    document.getElementById('fim-tempo').textContent = formatarTempo(tempo);
    document.getElementById('fim-erros').textContent = erros;

    overlay.style.display = 'flex';
    overlay.style.animation = 'piscarVerde 1.2s infinite alternate';

    salvarPlacar(nomeJogador, tempo, erros);
  }

  function salvarPlacar(nome, tempo, erros) {
  const payload = { nome, tempo, erros };

  fetch("https://script.google.com/macros/s/AKfycbzEHFIpfR5FoJ4zx06BqmxxePwu8NEml5FOTJyPcWX27U0xz3SY8in1gRvNUT-NuOxS/exec", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" }
  })
  .then(res => res.text())
  .then(texto => console.log("Resposta do servidor:", texto))
  .catch(erro => console.error("Erro ao enviar placar:", erro));
}



  window.addEventListener('load', () => {
  document.getElementById('fim-jogo-overlay').style.display = 'none';
  document.getElementById('fim-jogo-overlay').style.animation = 'none';
  document.getElementById('formulario').style.display = 'flex';
  document.getElementById('tabuleiro-container').style.display = 'none';
  document.querySelector('h1').style.display = 'block';
});
