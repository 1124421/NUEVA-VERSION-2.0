// DOM elements
const btnNuevo = document.getElementById("btnNuevo");
const modalForm = document.getElementById("modalForm");
const asociadoForm = document.getElementById("asociadoForm");
const btnCancelForm = document.getElementById("btnCancelForm");
const tbody = document.getElementById("asociadosTbody");
const searchInput = document.getElementById("searchInput");

const modalVer = document.getElementById("modalVer");
const btnCloseVer = document.getElementById("btnCloseVer");

// array de asociados
let asociados = [];

// --- util: escape para evitar HTML injection ---
function escapeHtml(text) {
  if (text === null || text === undefined) return "";
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --- abrir / cerrar modales ---
function openFormModal(editIndex = null) {
  document.getElementById("modalTitle").textContent = editIndex === null ? "Nuevo Asociado" : "Editar Asociado";
  document.getElementById("editIndex").value = editIndex === null ? "" : String(editIndex);

  if (editIndex !== null) {
    // prefilling form
    const a = asociados[editIndex];
    document.getElementById("nombre").value = a.nombre || "";
    document.getElementById("documento").value = a.documento || "";
    document.getElementById("contacto").value = a.contacto || "";
    document.getElementById("fechaInicio").value = a.fechaInicio || "";
    document.getElementById("contrato").value = a.contrato || "";
    document.getElementById("cargo").value = a.cargo || "";
    document.getElementById("idUnico").value = a.idUnico || "";
    document.getElementById("tipoAsociado").value = a.tipoAsociado || "";
    document.getElementById("ingresos").value = a.ingresos || "";
  } else {
    asociadoForm.reset();
  }

  modalForm.style.display = "flex";
}
function closeFormModal() {
  modalForm.style.display = "none";
  asociadoForm.reset();
  document.getElementById("editIndex").value = "";
}
function openViewModal() { modalVer.style.display = "flex"; }
function closeViewModal() { modalVer.style.display = "none"; }

// cerrar al click fuera del modal
window.addEventListener("click", function (e) {
  if (e.target === modalForm) closeFormModal();
  if (e.target === modalVer) closeViewModal();
});

// --- render tabla (solo 4 columnas visibles + acciones) ---
function renderTable() {
  tbody.innerHTML = "";
  asociados.forEach((a, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(a.nombre)}</td>
      <td>${escapeHtml(a.documento)}</td>
      <td>${escapeHtml(a.contacto)}</td>
      <td><span class="badge">${escapeHtml(a.ingresos ?? "")}</span></td>
      <td class="actions">
        <button class="view" onclick="verAsociado(${i})" title="Ver"><i class="fa fa-eye"></i></button>
        <button class="edit" onclick="editarAsociado(${i})" title="Editar"><i class="fa fa-pen"></i></button>
        <button class="delete" onclick="eliminarAsociado(${i})" title="Eliminar"><i class="fa fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // mantener aplicado el filtro si hay texto
  applyFilter();
}

// --- CRUD / acciones ---
// submit (crear o actualizar)
asociadoForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const nuevo = {
    nombre: document.getElementById("nombre").value.trim(),
    documento: document.getElementById("documento").value.trim(),
    contacto: document.getElementById("contacto").value.trim(),
    fechaInicio: document.getElementById("fechaInicio").value,
    contrato: document.getElementById("contrato").value.trim(),
    cargo: document.getElementById("cargo").value.trim(),
    idUnico: document.getElementById("idUnico").value.trim(),
    tipoAsociado: document.getElementById("tipoAsociado").value.trim(),
    ingresos: document.getElementById("ingresos").value
  };

  const editIndex = document.getElementById("editIndex").value;
  if (editIndex === "") {
    asociados.push(nuevo);
  } else {
    asociados[Number(editIndex)] = nuevo;
  }

  renderTable();
  closeFormModal();
});

// ver asociado (abre modal con todos los campos)
function verAsociado(index) {
  const a = asociados[index];
  if (!a) return alert("Registro no encontrado.");
  document.getElementById("verNombre").textContent = a.nombre || "";
  document.getElementById("verDocumento").textContent = a.documento || "";
  document.getElementById("verContacto").textContent = a.contacto || "";
  document.getElementById("verFechaInicio").textContent = a.fechaInicio || "-";
  document.getElementById("verContrato").textContent = a.contrato || "-";
  document.getElementById("verCargo").textContent = a.cargo || "-";
  document.getElementById("verIdUnico").textContent = a.idUnico || "-";
  document.getElementById("verTipoAsociado").textContent = a.tipoAsociado || "-";
  document.getElementById("verIngresos").textContent = a.ingresos || "-";
  openViewModal();
}

// editar (abre modal con datos cargados)
function editarAsociado(index) {
  openFormModal(index);
}

// eliminar
function eliminarAsociado(index) {
  if (!confirm("¿Eliminar este asociado?")) return;
  asociados.splice(index, 1);
  renderTable();
}

// --- búsqueda (oculta filas sin reordenar índices) ---
function applyFilter() {
  const q = (searchInput.value || "").toLowerCase().trim();
  tbody.querySelectorAll("tr").forEach(row => {
    const txt = row.textContent.toLowerCase();
    row.style.display = txt.includes(q) ? "" : "none";
  });
}
searchInput.addEventListener("input", applyFilter);

// --- botones UI ---
btnNuevo.addEventListener("click", () => openFormModal(null));
btnCancelForm.addEventListener("click", () => closeFormModal());
btnCloseVer.addEventListener("click", () => closeViewModal());

// initial render
renderTable();
