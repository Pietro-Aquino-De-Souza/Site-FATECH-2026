/* =========================================================
   FATECH - script.js
   Cada bloco só roda se a página tiver os elementos dele.
   ========================================================= */

/* ---------- Funções auxiliares ---------- */
function criar(tag, classe, texto) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto) elemento.textContent = texto;
  return elemento;
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Imagem do projeto: usa a imagem real, ou a imagem preta "Coloque o projeto aqui"
function criarImagemProjeto(projeto) {
  if (projeto.imagem) {
    const img = criar("img", "proj-img");
    img.src = projeto.imagem;
    img.alt = projeto.nome;
    return img;
  }
  return criar("div", "proj-img proj-img-vazia", "Coloque o projeto aqui");
}

function linkWhatsapp(mensagem) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(mensagem);
}

/* ---------- Menu no celular ---------- */
const botaoMenu = document.querySelector(".menu-btn");
const menu = document.querySelector(".nav");
if (botaoMenu && menu) {
  botaoMenu.addEventListener("click", () => {
    const aberto = menu.classList.toggle("open");
    botaoMenu.setAttribute("aria-expanded", String(aberto));
  });
}

/* ---------- Ano no rodapé ---------- */
const anoRodape = document.getElementById("ano");
if (anoRodape) anoRodape.textContent = new Date().getFullYear();

/* ---------- Contagem regressiva ---------- */
const cdDias = document.getElementById("cd-dias");
if (cdDias) {
  const cdHoras = document.getElementById("cd-horas");
  const cdMin = document.getElementById("cd-min");
  const cdSeg = document.getElementById("cd-seg");
  const tituloContagem = document.getElementById("contagem-titulo");
  const alvo = new Date(CONFIG.dataInicio).getTime();
  const doisDigitos = (n) => String(n).padStart(2, "0");

  function atualizarContagem() {
    let falta = alvo - Date.now();
    if (falta <= 0) {
      falta = 0;
      tituloContagem.textContent = "A FATECH já começou!";
      clearInterval(relogio);
    }
    const total = Math.floor(falta / 1000);
    cdDias.textContent = doisDigitos(Math.floor(total / 86400));
    cdHoras.textContent = doisDigitos(Math.floor((total % 86400) / 3600));
    cdMin.textContent = doisDigitos(Math.floor((total % 3600) / 60));
    cdSeg.textContent = doisDigitos(total % 60);
  }

  const relogio = setInterval(atualizarContagem, 1000);
  atualizarContagem();
}

/* ---------- Carrossel (projetos sorteados) ---------- */
const pista = document.getElementById("pista");
if (pista) {
  const pontos = document.getElementById("pontos");
  const caixa = document.getElementById("carrossel");
  const escolhidos = embaralhar(PROJETOS).slice(0, 4);
  let atual = 0;
  let timer = null;

  function ir(numero) {
    atual = (numero + escolhidos.length) % escolhidos.length;
    pista.style.transform = "translateX(-" + atual * 100 + "%)";
    Array.from(pista.children).forEach((slide, i) => {
      slide.inert = i !== atual; // slides escondidos não recebem foco
    });
    Array.from(pontos.children).forEach((ponto, i) => {
      ponto.setAttribute("aria-current", i === atual ? "true" : "false");
    });
  }

  function iniciarAuto() {
    pararAuto();
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(() => ir(atual + 1), 6000);
    }
  }
  function pararAuto() {
    clearInterval(timer);
  }

  escolhidos.forEach((projeto, i) => {
    const slide = criar("article", "slide");
    slide.setAttribute("aria-label", "Projeto " + (i + 1) + " de " + escolhidos.length);

    const info = criar("div", "slide-info");
    info.appendChild(criar("span", "tema", projeto.tema));
    info.appendChild(criar("h3", "", projeto.nome));

    const alunos = criar("p", "alunos");
    alunos.appendChild(criar("strong", "", "Alunos responsáveis:"));
    alunos.appendChild(document.createTextNode(projeto.alunos));
    info.appendChild(alunos);

    info.appendChild(criar("p", "", projeto.resumo));

    const link = criar("a", "btn btn-pequeno", "Ver todos os projetos");
    link.href = "projetos.html";
    info.appendChild(link);

    slide.appendChild(criarImagemProjeto(projeto));
    slide.appendChild(info);
    pista.appendChild(slide);

    const ponto = criar("button", "ponto");
    ponto.type = "button";
    ponto.setAttribute("aria-label", "Ir para o projeto " + (i + 1));
    ponto.addEventListener("click", () => ir(i));
    pontos.appendChild(ponto);
  });

  document.getElementById("anterior").addEventListener("click", () => ir(atual - 1));
  document.getElementById("proximo").addEventListener("click", () => ir(atual + 1));

  caixa.addEventListener("mouseenter", pararAuto);
  caixa.addEventListener("mouseleave", iniciarAuto);
  caixa.addEventListener("focusin", pararAuto);
  caixa.addEventListener("focusout", iniciarAuto);

  ir(0);
  iniciarAuto();
}

/* ---------- Página de projetos ---------- */
const listaProjetos = document.getElementById("lista-projetos");
if (listaProjetos) {
  PROJETOS.forEach((projeto) => {
    const card = criar("article", "card-proj");
    card.appendChild(criarImagemProjeto(projeto));

    const corpo = criar("div", "card-proj-corpo");
    corpo.appendChild(criar("span", "tema", projeto.tema));
    corpo.appendChild(criar("h3", "", projeto.nome));

    const alunos = criar("p", "alunos");
    alunos.appendChild(criar("strong", "", "Alunos responsáveis:"));
    alunos.appendChild(document.createTextNode(projeto.alunos));
    corpo.appendChild(alunos);

    corpo.appendChild(criar("p", "", projeto.resumo));
    card.appendChild(corpo);
    listaProjetos.appendChild(card);
  });
}

/* ---------- Página de inscrição ---------- */
const formInscricao = document.getElementById("form-inscricao");
if (formInscricao) {
  const botoesAba = document.querySelectorAll(".aba");
  const painelForm = document.getElementById("painel-form");
  const painelContato = document.getElementById("painel-contato");
  const blocoResumo = document.getElementById("resumo");
  const listaResumo = document.getElementById("resumo-lista");
  const botaoZap = document.getElementById("enviar-whatsapp");
  const campoLogo = document.getElementById("logo");
  const previaLogo = document.getElementById("logo-preview");

  // Abas: Formulário / Contato
  function mostrarAba(idPainel) {
    botoesAba.forEach((botao) => {
      botao.setAttribute("aria-pressed", String(botao.dataset.painel === idPainel));
    });
    painelForm.hidden = idPainel !== "painel-form";
    painelContato.hidden = idPainel !== "painel-contato";
  }
  botoesAba.forEach((botao) => {
    botao.addEventListener("click", () => mostrarAba(botao.dataset.painel));
  });
  if (location.hash === "#contato") mostrarAba("painel-contato");

  // Link do WhatsApp na aba Contato
  const primeiroNome = CONFIG.professor.split(" ")[0];
  document.getElementById("nome-professor").textContent = CONFIG.professor;
  const botaoContato = document.getElementById("botao-contato");
  botaoContato.href = linkWhatsapp("Olá, professor " + primeiroNome + "! Tenho uma dúvida sobre a FATECH.");
  document.getElementById("link-regulamento").href = CONFIG.regulamento;

  // Pré-visualização do logo
  campoLogo.addEventListener("change", () => {
    const arquivo = campoLogo.files[0];
    if (!arquivo) {
      previaLogo.hidden = true;
      return;
    }
    const leitor = new FileReader();
    leitor.onload = () => {
      previaLogo.src = leitor.result;
      previaLogo.hidden = false;
    };
    leitor.readAsDataURL(arquivo);
  });

  // Envio do formulário: mostra o resumo e abre o WhatsApp com os dados prontos
  formInscricao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const campos = formInscricao.elements;
    const dados = [
      ["Nome da equipe", campos["equipe"].value.trim()],
      ["Líder da equipe", campos["lider"].value.trim()],
      ["Responsável/Professor", campos["responsavel"].value.trim()],
      ["Nome do robô", campos["robo"].value.trim()]
    ];
    const temLogo = campoLogo.files.length > 0;

    listaResumo.textContent = "";
    dados.forEach(([rotulo, valor]) => {
      listaResumo.appendChild(criar("dt", "", rotulo));
      listaResumo.appendChild(criar("dd", "", valor));
    });
    listaResumo.appendChild(criar("dt", "", "Logo"));
    listaResumo.appendChild(criar("dd", "", temLogo ? "Selecionado (envie a imagem no WhatsApp)" : "Não enviado"));

    let mensagem = "Olá, professor " + primeiroNome + "! Quero inscrever minha equipe na FATECH.\n\n";
    dados.forEach(([rotulo, valor]) => {
      mensagem += rotulo + ": " + valor + "\n";
    });
    mensagem += temLogo ? "Logo: vou enviar a imagem em seguida." : "Logo: não enviado.";
    botaoZap.href = linkWhatsapp(mensagem);

    formInscricao.hidden = true;
    blocoResumo.hidden = false;
    blocoResumo.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.getElementById("corrigir").addEventListener("click", () => {
    blocoResumo.hidden = true;
    formInscricao.hidden = false;
  });
}
