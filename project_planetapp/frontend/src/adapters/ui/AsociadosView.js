/**
 * Adaptador UI: Vista de Asociados
 * Renderiza tabla y modales; delega CRUD a los casos de uso.
 */

import { Asociado } from '../../core/domain/Asociado.js';
import { GetAsociados } from '../../application/GetAsociados.js';
import { CreateAsociado } from '../../application/CreateAsociado.js';
import { UpdateAsociado } from '../../application/UpdateAsociado.js';
import { DeleteAsociado } from '../../application/DeleteAsociado.js';

function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/**
 * @param {Object} deps
 * @param {import('../../core/ports/AsociadosPort.js').AsociadosPort} deps.asociadosPort
 * @param {HTMLElement} deps.tbody
 * @param {HTMLInputElement} deps.searchInput
 * @param {HTMLFormElement} deps.form
 * @param {HTMLElement} deps.modalForm
 * @param {HTMLElement} deps.modalVer
 * @param {HTMLElement} deps.btnNuevo
 * @param {HTMLElement} deps.btnCancelForm
 * @param {HTMLElement} deps.btnCloseVer
 * @param {() => boolean} deps.confirmDelete
 */
export function initAsociadosView(deps) {
  const {
    asociadosPort,
    tbody,
    searchInput,
    form,
    modalForm,
    modalVer,
    btnNuevo,
    btnCancelForm,
    btnCloseVer,
    confirmDelete,
  } = deps;

  let list = [];

  async function loadList() {
    list = await GetAsociados(asociadosPort);
    renderTable();
  }

  function getFormData() {
    const get = (id) => document.getElementById(id)?.value ?? '';
    return {
      nombre: get('nombre').trim(),
      documento: get('documento').trim(),
      contacto: get('contacto').trim(),
      fechaInicio: get('fechaInicio'),
      contrato: get('contrato').trim(),
      cargo: get('cargo').trim(),
      idUnico: get('idUnico').trim(),
      tipoAsociado: get('tipoAsociado').trim(),
      ingresos: get('ingresos'),
    };
  }

  function renderTable() {
    if (!tbody) return;
    tbody.innerHTML = '';
    list.forEach((a, i) => {
      const tr = document.createElement('tr');
      const estado = a.tipoAsociado || 'Activo';
      tr.innerHTML = `
        <td>${escapeHtml(a.nombre)}</td>
        <td>${escapeHtml(a.documento)}</td>
        <td>${escapeHtml(a.contacto)}</td>
        <td><span class="badge">${escapeHtml(a.ingresos ?? '')}</span></td>
        <td><span class="badge-ingresos">${escapeHtml(estado)}</span></td>
        <td class="actions">
          <button class="view" data-action="ver" data-index="${i}" title="Ver"><i class="fa fa-eye"></i></button>
          <button class="edit" data-action="editar" data-index="${i}" title="Editar"><i class="fa fa-pen"></i></button>
          <button class="delete" data-action="eliminar" data-index="${i}" title="Eliminar"><i class="fa fa-trash"></i></button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    applyFilter();
    bindRowActions();
  }

  function bindRowActions() {
    tbody.querySelectorAll('[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const index = Number(btn.getAttribute('data-index'));
        if (action === 'ver') openViewModal(index);
        else if (action === 'editar') openFormModal(index);
        else if (action === 'eliminar') handleDelete(index);
      });
    });
  }

  function applyFilter() {
    if (!searchInput || !tbody) return;
    const q = (searchInput.value || '').toLowerCase().trim();
    tbody.querySelectorAll('tr').forEach((row) => {
      const txt = row.textContent.toLowerCase();
      row.style.display = txt.includes(q) ? '' : 'none';
    });
  }

  function openFormModal(editIndex = null) {
    const modalTitle = document.getElementById('modalTitle');
    const editIndexInput = document.getElementById('editIndex');
    if (modalTitle) modalTitle.textContent = editIndex === null ? 'Nuevo Asociado' : 'Editar Asociado';
    if (editIndexInput) editIndexInput.value = editIndex === null ? '' : String(editIndex);

    if (editIndex !== null && list[editIndex]) {
      const a = list[editIndex];
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val ?? '';
      };
      set('nombre', a.nombre);
      set('documento', a.documento);
      set('contacto', a.contacto);
      set('fechaInicio', a.fechaInicio);
      set('contrato', a.contrato);
      set('cargo', a.cargo);
      set('idUnico', a.idUnico);
      set('tipoAsociado', a.tipoAsociado);
      set('ingresos', a.ingresos);
    } else if (form) {
      form.reset();
    }
    if (modalForm && typeof modalForm.setAttribute === 'function') {
      modalForm.setAttribute('title', editIndex === null ? 'Nuevo Asociado' : 'Editar Asociado');
      if (typeof modalForm.open === 'function') modalForm.open();
    } else if (modalForm) {
      modalForm.style.display = 'flex';
    }
  }

  function closeFormModal() {
    if (form) form.reset();
    const editIndexInput = document.getElementById('editIndex');
    if (editIndexInput) editIndexInput.value = '';
    if (modalForm && typeof modalForm.close === 'function') {
      modalForm.close();
    } else if (modalForm) {
      modalForm.style.display = 'none';
    }
  }

  function openViewModal(index) {
    const a = list[index];
    if (!a) {
      if (typeof alert === 'function') alert('Registro no encontrado.');
      return;
    }
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val ?? '-';
    };
    set('verNombre', a.nombre);
    set('verDocumento', a.documento);
    set('verContacto', a.contacto);
    set('verFechaInicio', a.fechaInicio);
    set('verContrato', a.contrato);
    set('verCargo', a.cargo);
    set('verIdUnico', a.idUnico);
    set('verTipoAsociado', a.tipoAsociado);
    set('verIngresos', a.ingresos);
    if (modalVer && typeof modalVer.open === 'function') {
      modalVer.open();
    } else if (modalVer) {
      modalVer.style.display = 'flex';
    }
  }

  function closeViewModal() {
    if (modalVer && typeof modalVer.close === 'function') {
      modalVer.close();
    } else if (modalVer) {
      modalVer.style.display = 'none';
    }
  }

  async function handleDelete(index) {
    if (!confirmDelete()) return;
    const asociado = list[index];
    const id = asociado?._backendId || asociado?.idUnico;
    if (id) {
      await DeleteAsociado(asociadosPort, id);
    }
    await loadList();
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = getFormData();
      const editIndexInput = document.getElementById('editIndex');
      const editIndex = editIndexInput?.value === '' ? null : Number(editIndexInput?.value);

      if (editIndex === null) {
        await CreateAsociado(asociadosPort, data);
      } else {
        const asociado = list[editIndex];
        const id = asociado?._backendId || asociado?.idUnico;
        await UpdateAsociado(asociadosPort, id, data);
      }
      await loadList();
      closeFormModal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }
  if (btnNuevo) {
    btnNuevo.addEventListener('click', () => openFormModal(null));
  }
  if (btnCancelForm) {
    btnCancelForm.addEventListener('click', closeFormModal);
  }
  if (btnCloseVer) {
    btnCloseVer.addEventListener('click', closeViewModal);
  }

  document.addEventListener('click', (e) => {
    if (e.target === modalForm) closeFormModal();
    if (e.target === modalVer) closeViewModal();
  });

  loadList();
}
