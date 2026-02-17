import { Component } from '../core/Component.js';
import { Pagination } from '../components/Pagination.js';
import { ApiClient } from '../services/ApiClient.js';
import { LibraryInit } from '../services/LibraryInit.js';

export class Compra extends Component {
    constructor() {
        super('compra');
        this.materialesCompra = [];
        this.asociadoSeleccionado = null;
        this.rutaSeleccionada = null;
        this.comprasTable = null;
        this.searchAsociadoTimeout = null;
        this.searchMaterialTimeout = null;
        this.searchRutaTimeout = null;
    }

    template() {
        return `
            <!-- Form Card -->
            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="plus-circle"></i>
                    <h5>Nueva Compra</h5>
                </div>
                <form id="formCompra" novalidate>
                    <!-- Asociado -->
                    <div class="form-group">
                        <label class="form-label">Buscar Asociado <span style="color:#dc2626">*</span></label>
                        <div class="search-box">
                            <input type="text" class="form-control form-control-sm" id="searchAsociado" placeholder="Nombre, documento o correo..." autocomplete="off">
                            <div class="search-results" id="asociadoResults"></div>
                        </div>
                    </div>
                    <div id="asociadoInfo" class="info-box-premium" style="display: none;">
                        <div class="info-icon"><i data-lucide="user-check"></i></div>
                        <div class="info-content">
                            <p><strong>Nombre:</strong> <span id="infoAsociadoNombre"></span></p>
                            <p><strong>Documento:</strong> <span id="infoAsociadoDoc"></span></p>
                            <p><strong>Teléfono:</strong> <span id="infoAsociadoTel"></span></p>
                        </div>
                        <button type="button" class="btn-remove" id="btnClearAsociado" style="position:absolute;top:8px;right:8px">✕</button>
                    </div>

                    <!-- Material -->
                    <div class="form-group">
                        <label class="form-label">Agregar Material <span style="color:#dc2626">*</span></label>
                        <div class="search-box">
                            <input type="text" class="form-control form-control-sm" id="searchMaterial" placeholder="Buscar por nombre o código..." autocomplete="off">
                            <div class="search-results" id="materialResults"></div>
                        </div>
                    </div>
                    <div id="listaMaterialesCompra"></div>

                    <!-- Carreta + Ruta row -->
                    <div class="row g-2 mt-2">
                        <div class="col-md-4">
                            <label class="form-label">Carreta <span style="color:#dc2626">*</span></label>
                            <input type="text" class="form-control form-control-sm" id="inputCarreta" placeholder="Código o identificador de carreta">
                        </div>
                        <div class="col-md-8">
                            <label class="form-label">Ruta (Barrio / Comuna) <span style="color:#dc2626">*</span></label>
                            <div class="search-box">
                                <input type="text" class="form-control form-control-sm" id="searchRuta" placeholder="Buscar barrio, código o comuna..." autocomplete="off">
                                <div class="search-results" id="rutaResults"></div>
                            </div>
                            <div id="rutaInfo" style="display:none;margin-top:4px;">
                                <span class="badge bg-light text-dark" id="rutaBadge" style="font-size:12px;border:1px solid #e2e8f0;"></span>
                                <button type="button" class="btn-link" id="btnClearRuta" style="font-size:11px;color:#dc2626;margin-left:6px;background:none;border:none;cursor:pointer">✕ Quitar</button>
                            </div>
                            <div style="margin-top:4px;">
                                <button type="button" class="btn btn-outline-secondary btn-sm" id="btnAddBarrio" style="font-size:11px;padding:2px 8px;">
                                    + Agregar barrio
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Rechazados -->
                    <div class="row g-2 mt-2">
                        <div class="col-md-4">
                            <label class="form-label">¿Rechazados?</label>
                            <select class="form-select form-select-sm" id="selectRechazado">
                                <option value="no">No</option>
                                <option value="si">Sí</option>
                            </select>
                        </div>
                        <div class="col-md-4" id="rechazadoPesoWrapper" style="display:none;">
                            <label class="form-label">Peso rechazado (KG)</label>
                            <input type="number" class="form-control form-control-sm" id="inputRechazadoPeso" placeholder="0.00" min="0" step="0.1">
                        </div>
                    </div>

                    <div class="total-row mt-3"><h5>Total: $<span id="totalCompra">0.00</span></h5></div>
                    <button type="submit" class="btn btn-primary-green">Registrar Compra</button>
                </form>
            </div>

            <!-- Table Card -->
            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="list"></i>
                    <h5>Compras Registradas</h5>
                </div>
                <table id="comprasTable" class="table table-sm" style="width:100%">
                    <thead><tr><th>ID</th><th>Fecha</th><th>Asociado</th><th>Material</th><th>KG</th><th>Carreta</th><th>Ruta</th><th>Total</th><th>Estado</th><th style="width:80px;text-align:center;">Acciones</th></tr></thead>
                    <tbody></tbody>
                </table>
                <!-- Custom Pagination Container -->
                <div id="comprasPagination"></div>
            </div>

            <!-- Modal: Nuevo Barrio -->
            <div class="asoc-modal-overlay" id="modalBarrioOverlay"></div>
            <div class="asoc-modal" id="modalBarrio">
                <div class="asoc-modal-header">
                    <div class="asoc-modal-title"><h4>Nuevo Barrio</h4></div>
                    <button class="asoc-modal-close" id="btnCloseBarrio">&times;</button>
                </div>
                <div class="asoc-modal-body">
                    <form id="formBarrio">
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Código del barrio</label>
                            <input type="text" class="asoc-form-input" id="barrioCodigo" placeholder="Ej: B001">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Nombre del barrio</label>
                            <input type="text" class="asoc-form-input" id="barrioNombre" required placeholder="Ej: La Flora">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Comuna</label>
                            <input type="text" class="asoc-form-input" id="barrioComuna" required placeholder="Ej: Comuna 5">
                        </div>
                        <div class="asoc-form-actions">
                            <button type="button" class="asoc-btn-cancel" id="btnCancelBarrio">Cancelar</button>
                            <button type="submit" class="asoc-btn-save">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async afterMount() {
        this.initDataTable();
        this.attachEvents();
        this.initLibraries();
        await this.loadCompras();
    }

    initLibraries() {
        // Tom Select on Rechazados select
        LibraryInit.initSelects(['#selectRechazado']);
    }

    initDataTable() {
        if (!window.$ || !window.$.fn || !window.$.fn.DataTable) {
            setTimeout(() => this.initDataTable(), 200);
            return;
        }
        const self = this;
        this.comprasTable = $('#comprasTable').DataTable({
            language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            paging: false,
            dom: 'rt',
            ordering: false,
            columns: [
                { data: 'id', render: d => `<strong>#C${String(d).padStart(3, '0')}</strong>` },
                { data: 'fechaCompra', render: d => d ? new Date(d).toLocaleDateString('es-CO') : '—' },
                { data: 'asociadoNombre', render: d => d || '—' },
                { data: 'materialNombre', render: d => d || '—' },
                { data: 'cantidad', render: d => `${Number(d).toFixed(2)} kg` },
                { data: 'carreta', render: d => d || '—' },
                { data: 'ruta', render: d => d || '—' },
                { data: 'total', render: d => `$${Number(d).toFixed(2)}` },
                {
                    data: 'estado', render: d => {
                        if (d === 'COMPLETADA') return '<span class="badge bg-success">Completada</span>';
                        return '<span class="badge bg-danger">Cancelada</span>';
                    }
                },
                {
                    data: null, orderable: false, className: 'text-center', render: d => {
                        if (d.estado !== 'COMPLETADA') return '<span style="color:#94a3b8;font-size:11px;">—</span>';
                        return `<button class="action-btn action-btn-danger btn-cancel" data-id="${d.id}" title="Cancelar compra"><i data-lucide="x"></i></button>`;
                    }
                }
            ]
        });

        // Cancel button handler
        $('#comprasTable tbody').on('click', '.btn-cancel', (e) => {
            const id = $(e.currentTarget).data('id');
            self.handleCancel(id);
        });

        // Init custom pagination
        new Pagination(this.comprasTable, 'comprasPagination');
    }

    async loadCompras() {
        try {
            const compras = await ApiClient.compras.getAll();
            if (this.comprasTable) this.comprasTable.clear().rows.add(compras).draw();
        } catch (err) {
            console.error('Error cargando compras:', err);
        }
    }

    attachEvents() {
        // Asociado search
        this.element.querySelector('#searchAsociado')?.addEventListener('input', (e) => {
            clearTimeout(this.searchAsociadoTimeout);
            this.searchAsociadoTimeout = setTimeout(() => this.handleSearchAsociado(e.target.value), 300);
        });

        // Material search
        this.element.querySelector('#searchMaterial')?.addEventListener('input', (e) => {
            clearTimeout(this.searchMaterialTimeout);
            this.searchMaterialTimeout = setTimeout(() => this.handleSearchMaterial(e.target.value), 300);
        });

        // Ruta search
        this.element.querySelector('#searchRuta')?.addEventListener('input', (e) => {
            clearTimeout(this.searchRutaTimeout);
            this.searchRutaTimeout = setTimeout(() => this.handleSearchRuta(e.target.value), 300);
        });

        // Clear buttons
        this.element.querySelector('#btnClearAsociado')?.addEventListener('click', () => {
            this.asociadoSeleccionado = null;
            this.element.querySelector('#searchAsociado').value = '';
            this.element.querySelector('#asociadoInfo').style.display = 'none';
        });

        this.element.querySelector('#btnClearRuta')?.addEventListener('click', () => {
            this.rutaSeleccionada = null;
            this.element.querySelector('#searchRuta').value = '';
            this.element.querySelector('#rutaInfo').style.display = 'none';
        });

        // Rechazados toggle
        this.element.querySelector('#selectRechazado')?.addEventListener('change', (e) => {
            this.element.querySelector('#rechazadoPesoWrapper').style.display = e.target.value === 'si' ? '' : 'none';
            if (e.target.value === 'no') this.element.querySelector('#inputRechazadoPeso').value = '';
        });

        // Add barrio modal
        this.element.querySelector('#btnAddBarrio')?.addEventListener('click', () => this.openBarrioModal());
        this.element.querySelector('#btnCloseBarrio')?.addEventListener('click', () => this.closeBarrioModal());
        this.element.querySelector('#btnCancelBarrio')?.addEventListener('click', () => this.closeBarrioModal());
        this.element.querySelector('#modalBarrioOverlay')?.addEventListener('click', () => this.closeBarrioModal());
        this.element.querySelector('#formBarrio')?.addEventListener('submit', (e) => this.handleSaveBarrio(e));

        // Form submit
        this.element.querySelector('#formCompra')?.addEventListener('submit', (e) => this.handleSubmit(e));

        // Close dropdowns
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.element.querySelectorAll('.search-results').forEach(r => r.classList.remove('show'));
            }
        });
    }

    // --- Search handlers ---

    async handleSearchAsociado(query) {
        const results = this.element.querySelector('#asociadoResults');
        results.innerHTML = '';
        if (query.length < 1) { results.classList.remove('show'); return; }
        try {
            const asociados = await ApiClient.asociados.buscar(query);
            if (!asociados || asociados.length === 0) {
                results.innerHTML = '<div class="search-result-item text-muted">Sin resultados</div>';
            } else {
                results.innerHTML = asociados.map(a => `
                    <div class="search-result-item" data-id="${a.id}">
                        <strong>${a.nombre} ${a.apellido || ''}</strong>
                        <small class="text-muted">Doc: ${a.documento}</small>
                    </div>
                `).join('');
            }
            results.classList.add('show');
            results.querySelectorAll('.search-result-item[data-id]').forEach(item => {
                item.addEventListener('click', () => this.selectAsociado(item.dataset.id, asociados));
            });
        } catch (err) {
            results.innerHTML = '<div class="search-result-item text-danger">Error al buscar</div>';
            results.classList.add('show');
        }
    }

    selectAsociado(id, list) {
        const a = list.find(x => x.id == id);
        if (!a) return;
        this.asociadoSeleccionado = a;
        this.element.querySelector('#searchAsociado').value = `${a.nombre} ${a.apellido || ''}`.trim();
        this.element.querySelector('#asociadoResults').classList.remove('show');
        this.element.querySelector('#asociadoInfo').style.display = 'flex';
        this.element.querySelector('#infoAsociadoNombre').textContent = `${a.nombre} ${a.apellido || ''}`.trim();
        this.element.querySelector('#infoAsociadoDoc').textContent = a.documento;
        this.element.querySelector('#infoAsociadoTel').textContent = a.telefono || '—';
        lucide.createIcons();
    }

    async handleSearchMaterial(query) {
        const results = this.element.querySelector('#materialResults');
        results.innerHTML = '';
        if (query.length < 1) { results.classList.remove('show'); return; }
        try {
            const materiales = await ApiClient.materiales.buscar(query);
            const available = materiales.filter(m => m.activo && !this.materialesCompra.find(mc => mc.id === m.id));
            if (available.length === 0) {
                results.innerHTML = '<div class="search-result-item text-muted">Sin resultados</div>';
            } else {
                results.innerHTML = available.map(m => `
                    <div class="search-result-item" data-id="${m.id}">
                        <strong>${m.codigo ? m.codigo + ' — ' : ''}${m.nombre}</strong>
                        <small class="text-muted">$${Number(m.precioCompra).toFixed(2)}/${m.unidad || 'kg'}</small>
                    </div>
                `).join('');
            }
            results.classList.add('show');
            results.querySelectorAll('.search-result-item[data-id]').forEach(item => {
                item.addEventListener('click', () => this.addMaterial(item.dataset.id, materiales));
            });
        } catch (err) {
            results.innerHTML = '<div class="search-result-item text-danger">Error buscando material</div>';
            results.classList.add('show');
        }
    }

    addMaterial(id, list) {
        if (this.materialesCompra.length >= 10) {
            Swal.fire({ icon: 'warning', title: 'Límite alcanzado', text: 'Máximo 10 materiales por compra.' });
            return;
        }
        const material = list.find(m => m.id == id);
        if (!material || this.materialesCompra.find(m => m.id == id)) return;
        this.materialesCompra.push({ ...material, peso: 0 });
        this.renderMateriales();
        this.element.querySelector('#searchMaterial').value = '';
        this.element.querySelector('#materialResults').classList.remove('show');
    }

    renderMateriales() {
        const container = this.element.querySelector('#listaMaterialesCompra');
        container.innerHTML = this.materialesCompra.map((m, i) => `
            <div class="material-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${m.codigo ? m.codigo + ' — ' : ''}${m.nombre}</strong>
                    <button type="button" class="btn-remove" data-index="${i}">Quitar</button>
                </div>
                <div class="row g-2">
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Peso (${m.unidad || 'kg'}) <span style="color:#dc2626">*</span></label>
                        <input type="number" class="form-control form-control-sm weight-input" data-index="${i}" value="${m.peso}" min="0" step="0.1">
                    </div>
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Precio</label>
                        <input type="text" class="form-control form-control-sm" value="$${Number(m.precioCompra).toFixed(2)}" readonly>
                    </div>
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Subtotal</label>
                        <input type="text" class="form-control form-control-sm" value="$${(m.peso * m.precioCompra).toFixed(2)}" readonly>
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => { this.materialesCompra.splice(btn.dataset.index, 1); this.renderMateriales(); });
        });
        container.querySelectorAll('.weight-input').forEach(input => {
            input.addEventListener('input', (e) => { this.materialesCompra[input.dataset.index].peso = parseFloat(e.target.value) || 0; this.renderMateriales(); });
        });
        this.updateTotal();
    }

    updateTotal() {
        const total = this.materialesCompra.reduce((sum, m) => sum + (m.peso * m.precioCompra), 0);
        this.element.querySelector('#totalCompra').textContent = total.toFixed(2);
    }

    // --- Ruta search ---

    async handleSearchRuta(query) {
        const results = this.element.querySelector('#rutaResults');
        results.innerHTML = '';
        if (query.length < 1) { results.classList.remove('show'); return; }
        try {
            const barrios = await ApiClient.barrios.buscar(query);
            if (!barrios || barrios.length === 0) {
                results.innerHTML = '<div class="search-result-item text-muted">Sin resultados. Use "+ Agregar barrio".</div>';
            } else {
                results.innerHTML = barrios.map(b => `
                    <div class="search-result-item" data-id="${b.id}">
                        <strong>${b.nombre}</strong>
                        <small class="text-muted">${b.codigo || ''} — ${b.comuna}</small>
                    </div>
                `).join('');
            }
            results.classList.add('show');
            results.querySelectorAll('.search-result-item[data-id]').forEach(item => {
                item.addEventListener('click', () => this.selectRuta(item.dataset.id, barrios));
            });
        } catch (err) {
            results.innerHTML = '<div class="search-result-item text-danger">Error buscando barrios</div>';
            results.classList.add('show');
        }
    }

    selectRuta(id, list) {
        const b = list.find(x => x.id == id);
        if (!b) return;
        this.rutaSeleccionada = b;
        this.element.querySelector('#searchRuta').value = `${b.nombre} — ${b.comuna}`;
        this.element.querySelector('#rutaResults').classList.remove('show');
        this.element.querySelector('#rutaBadge').textContent = `${b.nombre} — ${b.comuna}`;
        this.element.querySelector('#rutaInfo').style.display = '';
    }

    // --- Barrio modal ---

    openBarrioModal() {
        this.element.querySelector('#modalBarrio').classList.add('show');
        this.element.querySelector('#modalBarrioOverlay').classList.add('show');
        lucide.createIcons();
    }

    closeBarrioModal() {
        this.element.querySelector('#modalBarrio').classList.remove('show');
        this.element.querySelector('#modalBarrioOverlay').classList.remove('show');
        this.element.querySelector('#formBarrio').reset();
    }

    async handleSaveBarrio(e) {
        e.preventDefault();
        const nombre = this.element.querySelector('#barrioNombre').value.trim();
        const comuna = this.element.querySelector('#barrioComuna').value.trim();
        if (!nombre || !comuna) {
            Swal.fire({ icon: 'warning', title: 'Campos requeridos', text: 'Nombre y comuna son obligatorios.' });
            return;
        }
        try {
            const barrio = await ApiClient.barrios.create({
                codigo: this.element.querySelector('#barrioCodigo').value.trim() || null,
                nombre, comuna
            });
            this.closeBarrioModal();
            Swal.fire({ icon: 'success', title: 'Barrio creado', timer: 1500, showConfirmButton: false });
            // Auto-select
            this.rutaSeleccionada = barrio;
            this.element.querySelector('#searchRuta').value = `${barrio.nombre} — ${barrio.comuna}`;
            this.element.querySelector('#rutaBadge').textContent = `${barrio.nombre} — ${barrio.comuna}`;
            this.element.querySelector('#rutaInfo').style.display = '';
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el barrio.' });
        }
    }

    // --- Submit ---

    async handleSubmit(e) {
        e.preventDefault();

        // Validate
        const errors = [];
        if (!this.asociadoSeleccionado) errors.push('Seleccione un asociado');
        if (this.materialesCompra.length === 0) errors.push('Agregue al menos un material');
        const invalidMats = this.materialesCompra.filter(m => m.peso <= 0);
        if (invalidMats.length > 0) errors.push('Todos los materiales deben tener peso mayor a 0');
        const carreta = this.element.querySelector('#inputCarreta').value.trim();
        if (!carreta) errors.push('Ingrese la carreta');
        if (!this.rutaSeleccionada) errors.push('Seleccione una ruta (barrio/comuna)');

        if (errors.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Campos incompletos', html: errors.map(e => `• ${e}`).join('<br>') });
            return;
        }

        const rechazadoVal = this.element.querySelector('#selectRechazado').value;
        const rechazadoPeso = rechazadoVal === 'si' ? parseFloat(this.element.querySelector('#inputRechazadoPeso').value) || 0 : null;
        const rutaText = `${this.rutaSeleccionada.nombre} — ${this.rutaSeleccionada.comuna}`;

        try {
            const promises = this.materialesCompra.map(m =>
                ApiClient.compras.create({
                    asociadoId: this.asociadoSeleccionado.id,
                    materialId: m.id,
                    cantidad: m.peso,
                    precioUnitario: m.precioCompra,
                    carreta: carreta,
                    ruta: rutaText,
                    rechazado: rechazadoPeso,
                })
            );
            await Promise.all(promises);

            Swal.fire({ icon: 'success', title: 'Compra registrada', text: `${this.materialesCompra.length} material(es) registrados.`, timer: 2500, showConfirmButton: false });

            // Reset
            this.materialesCompra = [];
            this.asociadoSeleccionado = null;
            this.rutaSeleccionada = null;
            this.element.querySelector('#formCompra').reset();
            this.element.querySelector('#asociadoInfo').style.display = 'none';
            this.element.querySelector('#rutaInfo').style.display = 'none';
            this.element.querySelector('#rechazadoPesoWrapper').style.display = 'none';
            this.renderMateriales();
            await this.loadCompras();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la compra.' });
        }
    }

    async handleCancel(id) {
        const result = await Swal.fire({
            title: '¿Cancelar esta compra?',
            text: 'Se revertirá el movimiento de inventario y el registro quedará como cancelado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });
        if (!result.isConfirmed) return;

        try {
            await ApiClient.compras.cancelar(id);
            Swal.fire({ icon: 'success', title: 'Compra cancelada', text: 'El stock ha sido revertido correctamente.', timer: 2000, showConfirmButton: false });
            await this.loadCompras();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cancelar la compra.' });
        }
    }
}
