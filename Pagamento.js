let precoItem = 720;
let freteAtual = 0;
let desconto = 0;         // desconto fixo em reais (ex: desconto no frete)
let descontoPercent = 0;  // desconto percentual no subtotal

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".btn-voltar").addEventListener("click", () => history.back());

  const radios = document.querySelectorAll('input[name="pagamento"]');
  const cartaoInfo = document.getElementById("cartao-info");
  const btnFinalizar = document.getElementById("btn-finalizar");

  function atualizarVisibilidadeFinalizar() {
    // Mostrar o botão apenas se o cartão estiver selecionado
    if (document.getElementById("radio-cartao").checked) {
      btnFinalizar.style.display = "inline-block"; // ou block conforme seu estilo
    } else {
      btnFinalizar.style.display = "none";
    }
  }

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      // Mostrar ou esconder dados do cartão
      cartaoInfo.style.display = document.getElementById("radio-cartao").checked ? "block" : "none";

      // Controlar botão finalizar
      atualizarVisibilidadeFinalizar();
    });
  });

  // Chamar uma vez ao carregar a página para definir o estado inicial
  atualizarVisibilidadeFinalizar();

  // Seu código atual continua...
  const validadeInput = document.getElementById("validade-cartao");

  validadeInput.addEventListener("input", e => {
    let valor = e.target.value;

    valor = valor.replace(/\D/g, "");

    if (valor.length > 4) valor = valor.substring(0, 4);

    if (valor.length >= 2) {
      let mes = parseInt(valor.substring(0, 2), 10);
      if (mes < 1 || mes > 12) mes = "12";

      let ano = valor.substring(2);
      valor = mes.toString().padStart(2, "0") + (ano ? "/" + ano : "");
    }

    e.target.value = valor;
  });

  atualizarTotal();
});

// Adiciona novo item
function adicionarItem() {
  const div = document.getElementById("lista-itens");

  const item = document.createElement("div");
  item.classList.add("item-produto");

  item.innerHTML = `
    <img src="51m5B8yyaNL.jpg" alt="Tranca Elétrica" class="imagem-produto" />
    <div class="info-produto">
      <p><strong>Tranca Elétrica</strong></p>
      <p>R$ <span class="preco">${precoItem}</span></p>
    </div>
    <button class="remover-item" title="Remover item" onclick="removerItem(this)">❌</button>
  `;

  div.appendChild(item);
  atualizarTotal();
}

function removerItem(botao) {
  const item = botao.closest(".item-produto");
  item.style.transition = "opacity 0.3s ease";
  item.style.opacity = 0;

  setTimeout(() => {
    item.remove();
    atualizarTotal();
  }, 300);
}

// Calcula frete baseado no estado selecionado
function calcularFrete() {
  const estado = document.getElementById("estado").value;

  if (!estado) {
    freteAtual = 0;
    atualizarTotal();
    Swal.fire({
      icon: 'error',
      title: 'Estado não selecionado',
      text: 'Por favor, selecione seu estado para calcular o frete.',
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }

  // Tabela simples de frete, base SP = R$15
  const fretePorEstado = {
    "SP": 15,
    "RJ": 18,
    "MG": 18,
    "ES": 18,
    "PR": 22,
    "SC": 22,
    "RS": 25,
    "DF": 20,
    "GO": 20,
    "MS": 25,
    "MT": 30,
    "BA": 35,
    "SE": 35,
    "AL": 35,
    "PE": 35,
    "PB": 35,
    "RN": 35,
    "CE": 35,
    "PI": 35,
    "MA": 40,
    "TO": 40,
    "RO": 45,
    "AC": 50,
    "AP": 50,
    "AM": 50,
    "RR": 50,
    "PA": 45
  };

  freteAtual = fretePorEstado[estado] || 60; // default 60 para casos fora da lista

  atualizarTotal();

  Swal.fire({
    icon: 'success',
    title: 'Frete calculado',
    text: `O frete para ${estado} é R$ ${freteAtual.toFixed(2)}`,
    timer: 1500,
    showConfirmButton: false,
  });
}

// Aplica desconto em % ou desconto fixo no frete
function aplicarDesconto() {
  const codigo = document.getElementById("codigoDesconto").value.trim().toUpperCase();
  desconto = 0;
  descontoPercent = 0;

  if (codigo === "LOCK10") {
    descontoPercent = 10;  // 10% de desconto no subtotal
    Swal.fire("Desconto aplicado!", "Você recebeu 10% de desconto no subtotal.", "success");
  } else if (codigo === "LOCKFRETE") {
    desconto = freteAtual; // desconto total do frete
    Swal.fire("Desconto aplicado!", "Você recebeu desconto no frete.", "success");
  } else {
    Swal.fire("Código inválido", "O código de desconto não é válido.", "error");
  }

  atualizarTotal();
}

// Atualiza os valores do resumo: subtotal, frete, desconto, total
function atualizarTotal() {
  const precos = document.querySelectorAll("#lista-itens .preco");
  let subtotal = 0;
  precos.forEach(p => {
    subtotal += parseFloat(p.textContent);
  });

  // Calcula desconto percentual em reais sobre subtotal
  let descontoCalculado = (subtotal * descontoPercent) / 100;

  // Soma desconto fixo no frete se houver
  descontoCalculado += desconto;

  // Evita desconto maior que subtotal + frete
  let totalAntesDesconto = subtotal + freteAtual;
  if (descontoCalculado > totalAntesDesconto) descontoCalculado = totalAntesDesconto;

  let total = totalAntesDesconto - descontoCalculado;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("frete").textContent = freteAtual.toFixed(2);
  document.getElementById("desconto").textContent = descontoCalculado.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Finaliza compra com confirmação SweetAlert2
function finalizarCompra() {
  atualizarTotal();

  Swal.fire({
    title: "Compra Finalizada!",
    text: "Sua compra foi finalizada com sucesso.",
    icon: "success",
    confirmButtonText: "OK",
    confirmButtonColor: "#3085d6",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "index.html"; // redirecionar
    }
  });
}

// Gera PDF com resumo da compra
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Resumo da Compra - LockSmart", 20, 20);

  const nome = document.getElementById("nome").value || "[não informado]";
  const email = document.getElementById("email").value || "[não informado]";
  const subtotal = document.getElementById("subtotal").textContent;
  const frete = document.getElementById("frete").textContent;
  const descontoTexto = document.getElementById("desconto").textContent;
  const total = document.getElementById("total").textContent;

  doc.setFontSize(12);
  doc.text(`Nome: ${nome}`, 20, 40);
  doc.text(`E-mail: ${email}`, 20, 50);

  const precos = document.querySelectorAll("#lista-itens strong");
  let y = 60;
  doc.text("Itens:", 20, y);
  precos.forEach((item, index) => {
    y += 10;
    doc.text(`- ${item.textContent} (R$ ${precoItem.toFixed(2)})`, 25, y);
  });

  doc.text(`Subtotal: R$ ${subtotal}`, 20, y + 15);
  doc.text(`Frete: R$ ${frete}`, 20, y + 25);
  doc.text(`Desconto: R$ ${descontoTexto}`, 20, y + 35);
  doc.text(`Total: R$ ${total}`, 20, y + 45);

  doc.save("pedido-locksmart.pdf");
}
function mostrarFormaPagamento() {
  const radioPix = document.getElementById("radio-pix");
  const radioBoleto = document.getElementById("radio-boleto");

  document.getElementById("pagamento-direto").style.display =
    (radioPix.checked || radioBoleto.checked) ? "block" : "none";
}

function irParaFormaPagamento() {
  const radioPix = document.getElementById("radio-pix");
  const radioBoleto = document.getElementById("radio-boleto");

  if (radioPix.checked) {
    window.location.href = "pagamento_pix.html";
  } else if (radioBoleto.checked) {
    window.location.href = "pagamento_boleto.html";
  }
}
function buscarCep() {
  const cep = document.getElementById("cep").value.replace(/\D/g, "");

  if (cep.length !== 8) {
    Swal.fire({
      icon: "error",
      title: "CEP inválido",
      text: "Digite um CEP com 8 números.",
    });
    return;
  }

  fetch(`https://viacep.com.br/ws/${cep}/json/`)
    .then(res => res.json())
    .then(data => {
      if (data.erro) {
        Swal.fire({ icon: "error", title: "CEP não encontrado" });
        return;
      }

      // Preenche os campos automaticamente
      document.getElementById("rua").value = data.logradouro || "";
      document.getElementById("cidade").value = data.localidade || "";
      document.getElementById("estado").value = data.uf || "";

      Swal.fire({
        icon: "success",
        title: "Endereço preenchido!",
        timer: 1200,
        showConfirmButton: false,
      });

      // Coloca o cursor no campo de número
      document.getElementById("numero").focus();
    })
    .catch(() => {
      Swal.fire({ icon: "error", title: "Erro ao buscar o CEP" });
    });
}

// Função para criar e/ou preencher campos Rua e Número no formulário
function preencherEndereco(data) {
  // Verifica se já existe campo rua, senão cria
  let ruaInput = document.getElementById("rua");
  if (!ruaInput) {
    const labelRua = document.createElement("label");
    labelRua.textContent = "Rua*";
    const inputRua = document.createElement("input");
    inputRua.type = "text";
    inputRua.id = "rua";
    inputRua.placeholder = "Rua";
    inputRua.required = true;

    const form = document.querySelector(".formulario");
    // Insere rua antes do estado
    const estadoSelect = document.getElementById("estado");
    form.insertBefore(labelRua, estadoSelect);
    form.insertBefore(inputRua, estadoSelect);

    ruaInput = inputRua;
  }
  ruaInput.value = data.logradouro || "";

  // Campo número (não vem no ViaCEP, precisa ser digitado)
  let numeroInput = document.getElementById("numero");
  if (!numeroInput) {
    const labelNumero = document.createElement("label");
    labelNumero.textContent = "Número*";
    const inputNumero = document.createElement("input");
    inputNumero.type = "text";
    inputNumero.id = "numero";
    inputNumero.placeholder = "Número";
    inputNumero.required = true;

    const form = document.querySelector(".formulario");
    const estadoSelect = document.getElementById("estado");
    form.insertBefore(labelNumero, estadoSelect);
    form.insertBefore(inputNumero, estadoSelect);

    numeroInput = inputNumero;
  }
  // Não preenche número automaticamente, pois depende do cliente
  // Pode opcionalmente focar nesse campo para facilitar a digitação
  numeroInput.focus();
}