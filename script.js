let tarefas = [
  { nome: "Estudar Desenvolvimento Web", descricao: "Revisar grid, forms, tabelas e modais.", prioridade: "Alta", dataHora: "2025-03-20T14:00" },
  { nome: "Fazer exercícios", descricao: "Resolver lista de exercícios de BD/POO.", prioridade: "Média", dataHora: "2025-03-21T08:00" },
  { nome: "Organizar arquivos", descricao: "Separar PDFs e pastas do projeto.", prioridade: "Baixa", dataHora: "2025-03-22T10:30" },
  { nome: "Enviar trabalho", descricao: "Finalizar e enviar o CRUD de tarefas.", prioridade: "Alta", dataHora: "2025-03-23T23:59" },
  { nome: "Ler artigos", descricao: "Ler artigos sobre ETL e modelagem dimensional.", prioridade: "Média", dataHora: "2025-03-24T16:00" }
];
let indexExcluir = null;

const tbody = document.getElementById("tbodyTarefas");
const semRegistros = document.getElementById("semRegistros");

const formNovo = document.getElementById("formNovo");
const formEditar = document.getElementById("formEditar");

const modalExcluir = new bootstrap.Modal(document.getElementById("modalExcluir"));
const modalEditar = new bootstrap.Modal(document.getElementById("modalEditar"));

const btnConfirmarExcluir = document.getElementById("btnConfirmarExcluir");

// =================== NOVO ===================
formNovo.addEventListener("submit", (e) => {
  e.preventDefault();

  const tarefa = {
    nome: document.getElementById("novoNome").value.trim(),
    descricao: document.getElementById("novoDescricao").value.trim(),
    prioridade: document.getElementById("novoPrioridade").value,
    dataHora: document.getElementById("novoDataHora").value
  };

  tarefas.push(tarefa);
  formNovo.reset();
  renderizar();

  // volta pra listagem (visual)
  location.hash = "#listagem";
});

// =================== EDITAR (SALVAR) ===================
formEditar.addEventListener("submit", (e) => {
  e.preventDefault();

  const idx = Number(document.getElementById("editIndex").value);

  tarefas[idx] = {
    nome: document.getElementById("editNome").value.trim(),
    descricao: document.getElementById("editDescricao").value.trim(),
    prioridade: document.getElementById("editPrioridade").value,
    dataHora: document.getElementById("editDataHora").value
  };

  modalEditar.hide();
  renderizar();
});

// =================== RENDER ===================
function renderizar() {
  tbody.innerHTML = "";

  if (tarefas.length === 0) {
    semRegistros.classList.remove("d-none");
    return;
  }
  semRegistros.classList.add("d-none");

  tarefas.forEach((t, i) => {
    const badge =
      t.prioridade === "Alta" ? "bg-danger" :
      t.prioridade === "Média" ? "bg-warning text-dark" :
      "bg-success";

    const dataHoraExibir = t.dataHora ? formatarDataHora(t.dataHora) : "-";

    tbody.innerHTML += `
      <tr>
        <td>${escapeHtml(t.nome)}</td>
        <td>${escapeHtml(dataHoraExibir)}</td>
        <td><span class="badge ${badge}">${escapeHtml(t.prioridade)}</span></td>
        <td class="text-center">
          <button class="btn btn-sm btn-warning me-1" onclick="irEditar(${i})" title="Editar">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="abrirExcluir(${i})" title="Excluir">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// =================== ABRIR MODAL EDITAR ===================
window.irEditar = function (i) {
  const t = tarefas[i];

  document.getElementById("editIndex").value = i;
  document.getElementById("editNome").value = t.nome;
  document.getElementById("editDescricao").value = t.descricao;
  document.getElementById("editPrioridade").value = t.prioridade;
  document.getElementById("editDataHora").value = t.dataHora || "";

  modalEditar.show();
};

// =================== MODAL EXCLUIR ===================
window.abrirExcluir = function (i) {
  indexExcluir = i;
  modalExcluir.show();
};

btnConfirmarExcluir.addEventListener("click", () => {
  if (indexExcluir !== null) {
    tarefas.splice(indexExcluir, 1);
    indexExcluir = null;
    renderizar();
  }
  modalExcluir.hide();
});

// =================== HELPERS ===================
function formatarDataHora(valor) {
  // valor vem tipo: "2025-03-20T14:00"
  const [data, hora] = valor.split("T");
  const [y, m, d] = data.split("-");
  return `${d}/${m}/${y} ${hora}`;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

// =================== INIT ===================
renderizar();
