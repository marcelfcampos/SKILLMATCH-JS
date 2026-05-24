/**
 * Mini-Projeto Avaliativo — SkillMatch JS
 * Simulador de Compatibilidade com Vaga Front-End Júnior
 */

// ==========================================
// 1. RECURSOS JS OBRIGATÓRIOS (Closures & Callbacks)
// ==========================================

// Closure para contagem de análises processadas
function criarContador() {
  let total = 0;
  return function () {
    total++;
    return total;
  };
}
const contadorAnalises = criarContador();

// Callback para finalização do fluxo
function finalizarAnalise(nome, callback) {
  callback(nome);
}

// ==========================================
// 2. PROGRAMAÇÃO ORIENTADA A OBJETOS (POO) - Vaga Front-End
// ==========================================

class Vaga {
  constructor(empresa, cargo, requisitos) {
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos;
  }
}

class VagaFrontEnd extends Vaga {
  constructor(empresa, cargo, requisitos, nivel, salario, modalidade) {
    super(empresa, cargo, requisitos);
    this.nivel = nivel;
    this.salario = salario;
    this.modalidade = modalidade;
  }

  exibirResumo() {
    return `${this.cargo} (${this.nivel}) - ${this.empresa}`;
  }

  // EVERY: verifica se o candidato atende a todos os requisitos da vaga
  candidatoAtendeTudo(habilidadesCandidato) {
    return this.requisitos.every((req) =>
      habilidadesCandidato.includes(req)
    );
  }
}

// ==========================================
// 3. ESTRUTURA DE DADOS (Candidato e Vagas) - Adicionar dados do candidato e vagas:
// ==========================================

const candidato = {
  nome: "Marcel",
  area: "Front-End",
  habilidades: ["JavaScript", "GitHub", "Kanban"],
  experienciaMeses: 6,
};

const bancoDeVagas = [
  new VagaFrontEnd(
    "TechStart",
    "Desenvolvedor Front-End",
    ["JavaScript", "GitHub", "Arrays", "CSS"],
    "Júnior",
    3000,
    "Remoto"
  ),
  new VagaFrontEnd(
    "DevCorp",
    "Desenvolvedor Front-End",
    ["JavaScript", "GitHub", "Kanban", "React"],
    "Júnior",
    3500,
    "Híbrido"
  ),
  new VagaFrontEnd(
    "WebFlow Studio",
    "Desenvolvedor Front-End",
    ["HTML", "CSS", "Design Responsivo"],
    "Júnior",
    2800,
    "Presencial"
  ),
];

// FIND: busca uma vaga específica pelo nome da empresa
function buscarVagaPorEmpresa(nome) {
  return bancoDeVagas.find((v) => v.empresa === nome) || null;
}

// Promise simulando carregamento de API
function buscarVagas() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(bancoDeVagas);
    }, 1000);
  });
}

// ==========================================
// 4. CORE ENGINE (Serviços e Métodos de Array)
// ==========================================

function analisarVaga(candidato, vaga) {
  const totalDeRequisitos = vaga.requisitos.length;

  // REDUCE: separa habilidades encontradas e faltantes em uma única passagem
  const { habilidadesEncontradas, habilidadesFaltantes } =
    vaga.requisitos.reduce(
      (acc, req) => {
        if (candidato.habilidades.includes(req)) {
          acc.habilidadesEncontradas.push(req);
        } else {
          acc.habilidadesFaltantes.push(req);
        }
        return acc;
      },
      { habilidadesEncontradas: [], habilidadesFaltantes: [] }
    );

  const requisitosAtendidos = habilidadesEncontradas.length;
  const percentual = (requisitosAtendidos / totalDeRequisitos) * 100;

  // Operador ternário para classificação por faixa de percentual (compatibilidade)
  const classificacao =
    percentual >= 80
      ? "Alta compatibilidade"
      : percentual >= 50
        ? "Média compatibilidade"
        : "Baixa compatibilidade";

  return {
    vaga: vaga.exibirResumo(),
    empresa: vaga.empresa,
    cargo: vaga.cargo,
    salario: vaga.salario,
    modalidade: vaga.modalidade,
    percentual: Math.round(percentual),
    habilidadesEncontradas,
    habilidadesFaltantes,
    classificacao,
  };
}

// ==========================================
// 5. ORQUESTRADOR DO SISTEMA (Async/Await)
// ==========================================

async function iniciarSistema() {
  console.log("=== SkillMatch JS — Inicializando análise de vagas... ===\n");

  // Async/Await consumindo a Promise
  const vagas = await buscarVagas();

  // MAP: gera a lista de resultados processados
  const resultados = vagas.map((vaga) => analisarVaga(candidato, vaga));

  // FOR...OF: exibição dos resultados individuais
  for (const res of resultados) {
    console.log(`Empresa: ${res.empresa}`);
    console.log(`Cargo: ${res.cargo}`);
    console.log(`Salário: R$ ${res.salario.toLocaleString("pt-BR")}`);
    console.log(`Modalidade: ${res.modalidade}`);
    console.log(`Compatibilidade: ${res.percentual}%`);

    console.log("Habilidades encontradas:");
    if (res.habilidadesEncontradas.length > 0) {
      // FOR: listagem das habilidades encontradas
      for (let i = 0; i < res.habilidadesEncontradas.length; i++) {
        console.log(`  - ${res.habilidadesEncontradas[i]}`);
      }
    } else {
      console.log("  - Nenhuma habilidade em comum.");
    }

    console.log("Habilidades faltantes:");
    if (res.habilidadesFaltantes.length > 0) {
      for (const h of res.habilidadesFaltantes) {
        console.log(`  - ${h}`);
      }
    } else {
      console.log("  - Nenhuma! Candidato cumpre todos os requisitos.");
    }

    console.log(`Classificação: ${res.classificacao}`);
    console.log("-".repeat(40));
  }

  // REDUCE: encontra a vaga com maior percentual de compatibilidade
  const melhorVaga = resultados.reduce((maior, atual) =>
    atual.percentual > maior.percentual ? atual : maior
  );

  console.log("\n==========================================");
  console.log("DIAGNÓSTICO FINAL DO SKILLMATCH");
  console.log("==========================================");
  console.log(
    `Melhor vaga identificada: ${melhorVaga.vaga} com ${melhorVaga.percentual}% de match.`
  );

  // EVERY: verifica se o candidato atende 100% dos requisitos da melhor vaga
  const vagaObj = buscarVagaPorEmpresa(melhorVaga.empresa);
  const atendeTudo =
    vagaObj !== null && vagaObj.candidatoAtendeTudo(candidato.habilidades);
  console.log(
    `Candidato atende todos os requisitos da melhor vaga? ${atendeTudo ? "Sim ✓" : "Não ✗"}`
  );

  console.log("\nSugestão de recomendações de estudo:");
  if (melhorVaga.habilidadesFaltantes.length > 0) {
    console.log(
      `Para se adequar perfeitamente à vaga da ${melhorVaga.empresa}, foque em aprender:`
    );
    for (const hab of melhorVaga.habilidadesFaltantes) {
      console.log(`  - Estude: ${hab}`);
    }
  } else {
    console.log(
      "Você está 100% pronto para a sua melhor vaga! Candidate-se imediatamente."
    );
  }

  // Closure e Callback
  const idAnalise = contadorAnalises();
  console.log(
    `\nControle interno: Total de análises rodadas nesta sessão: ${idAnalise}`
  );

  finalizarAnalise(candidato.nome, (nome) => {
    console.log(
      `\nSistema SkillMatch JS finalizado com sucesso para o candidato: ${nome}.`
    );
  });
}

// Executa a aplicação
iniciarSistema();
