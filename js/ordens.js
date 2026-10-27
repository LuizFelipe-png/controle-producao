// 1. Dados            (ordens e NOMES)
// 2. Elementos         (const ... = document.querySelector)
// 3. Controle          (let que guardam o estado da tela)
// 4. Funções           (criarOP, atualizarResumo, desenhar)
// 5. Ouvintes          (addEventListener)
// 6. Começo            (a última linha: desenhar())

//PARTE 1----------Dados----------//
let ordens = [
    { numero: 101, produto: "Eixo de transmissão", quantidade: 200, maquina: "Torno CNC", status: "aguardando" },
    { numero: 102, produto: "Suporte de motor", quantidade: 500, maquina: "Prensa", status: "producao" },
    { numero: 103, produto: "Tampa plástica", quantidade: 1200, maquina: "Injetora", status: "concluida" },
    { numero: 104, produto: "Flange de aço", quantidade: 80, maquina: "Torno CNC", status: "aguardando" }
  ]
  
  const NOMES = { aguardando: "Aguardando", producao: "Em produção", concluida: "Concluída" }
  
  //PARTE 2----------Elementos----------//
  const resumo = document.querySelector("#resumo")
  const botaoTv = document.querySelector("#modo-tv")
  const lista = document.querySelector("#lista")
  const filtros = document.querySelectorAll(".filtro")
  const form = document.querySelector("#form-op")
  const campoProduto = document.querySelector("#produto")
  const campoQuantidade = document.querySelector("#quantidade")
  const campoMaquina = document.querySelector("#maquina")
  const mensagem = document.querySelector("#mensagem")
  const busca = document.querySelector("#busca")
  const vazia = document.querySelector("#vazia")
  
  //PARTE 3----------Controle----------//
  let filtro = "todas"
  let proximoNumero = 105
  
  //PARTE 4----------Funções----------//
  function criarOP(op) {
    const item = document.createElement("li")
    item.classList.add("op", "status-" + op.status)
  
    const titulo = document.createElement("h3")
    // com innerHTML abriu um alerta escrito "invadido": o texto digitado virou código. Voltei para textContent.
    titulo.textContent = "OP-" + op.numero + " · " + op.produto
  
    const detalhes = document.createElement("p")
    detalhes.textContent = op.quantidade + " peças · " + op.maquina + " · " + NOMES[op.status]
  
    item.append(titulo, detalhes)
  
    if (op.status !== "concluida") {
      const avancar = document.createElement("button")
  
      if (op.status === "aguardando") {
        avancar.textContent = "Iniciar produção"
      } else {
        avancar.textContent = "Concluir"
      }
  
      avancar.addEventListener("click", () => {
        if (op.status === "aguardando") {
          op.status = "producao"
        } else {
          op.status = "concluida"
        }
        desenhar()
      })
  
      item.append(avancar)
    }
  
    if (op.status === "aguardando") {
      const cancelar = document.createElement("button")
      cancelar.textContent = "Cancelar"
  
      cancelar.addEventListener("click", () => {
        if (confirm("Cancelar a OP-" + op.numero + "?")) {
          ordens = ordens.filter((o) => o !== op)
          desenhar()
        }
      })
  
      item.append(cancelar)
    }
  
    return item
  }
  
  function atualizarResumo(mostrando) {
    let aguardando = 0
    let producao = 0
    let concluida = 0
    ordens.forEach((op) => {
      if (op.status === "aguardando") {
        aguardando++
      } else if (op.status === "producao") {
        producao++
      } else {
        concluida++
      }
    })
    resumo.textContent = "Mostrando " + mostrando + " de " + ordens.length + " ordens\n" +
      "Aguardando: " + aguardando + " · Em produção: " + producao + " · Concluídas: " + concluida
  }
  
  function desenhar() {
    let visiveis = ordens
    if (filtro !== "todas") {
      visiveis = ordens.filter((op) => op.status === filtro)
    }
    const texto = busca.value.trim().toLowerCase()
    visiveis = visiveis.filter((op) => op.produto.toLowerCase().includes(texto))
  
    lista.textContent = ""
    visiveis.forEach((op) => {
      lista.append(criarOP(op))
    })
    vazia.hidden = visiveis.length > 0
    atualizarResumo(visiveis.length)
  }
  
  //PARTE 5----------Ouvintes----------//
  botaoTv.addEventListener("click", () => {
    document.body.classList.toggle("modo-tv")
  
    if (document.body.classList.contains("modo-tv")) {
      botaoTv.textContent = "Sair do modo TV"
    } else {
      botaoTv.textContent = "Modo TV"
    }
  })
  
  filtros.forEach((botao) => {
    botao.addEventListener("click", (event) => {
      filtro = event.target.dataset.filtro
  
      filtros.forEach((b) => b.classList.remove("selecionado"))
      event.target.classList.add("selecionado")
  
      desenhar()
    })
  })
  
  busca.addEventListener("input", desenhar)
  
  form.addEventListener("submit", (event) => {
    event.preventDefault()
  
    const produto = campoProduto.value.trim()
    const quantidade = Number(campoQuantidade.value)
  
    if (produto === "" || quantidade <= 0) {
      mensagem.textContent = "Informe o produto e uma quantidade maior que zero."
      mensagem.hidden = false
      return
    }
  
    ordens.push({
      numero: proximoNumero,
      produto: produto,
      quantidade: quantidade,
      maquina: campoMaquina.value,
      status: "aguardando"
    })
    proximoNumero++
  
    mensagem.hidden = true
    form.reset()
    campoProduto.focus()
    desenhar()
  })
  
  //PARTE 6----------Começo----------//
  desenhar()