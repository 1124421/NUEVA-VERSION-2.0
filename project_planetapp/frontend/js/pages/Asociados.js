import { Component } from '../core/Component.js';
import { ApiClient } from '../services/ApiClient.js';
import { LibraryInit } from '../services/LibraryInit.js';

export class Asociados extends Component {
    constructor() {
        super('asociados');
        this.dataTable = null;
        this.activeTab = 'asociados';
        this.allData = [];
    }

    template() {
        return `
            <!-- Tabs -->
            <div class="asoc-tabs">
                <button class="asoc-tab active" data-tab="asociados">Asociados</button>
                <button class="asoc-tab" data-tab="clientes">Clientes</button>
            </div>

            <!-- Filter Bar -->
            <div class="module-card" style="margin-bottom:16px;">
                <div class="asoc-filter-bar">
                    <div class="asoc-search-wrapper">
                        <i data-lucide="search" class="asoc-search-icon"></i>
                        <input type="text" class="form-control" id="searchInput" placeholder="Buscar asociado">
                    </div>
                    <button class="btn btn-primary-green" id="btnNuevo">
                        <span id="btnNuevoText">Nuevo asociado</span>
                    </button>
                </div>
                <div class="asoc-filters-row">
                    <div class="asoc-filter-group">
                        <label class="form-label">Fecha desde</label>
                        <input type="date" class="form-control form-control-sm" id="filterFechaDesde">
                    </div>
                    <div class="asoc-filter-group">
                        <label class="form-label">Fecha hasta</label>
                        <input type="date" class="form-control form-control-sm" id="filterFechaHasta">
                    </div>
                    <div class="asoc-filter-group">
                        <label class="form-label">Estado</label>
                        <select class="form-control form-control-sm" id="filterEstado">
                            <option value="">Todos</option>
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                    <div class="asoc-filter-actions">
                        <button class="btn btn-outline-secondary btn-sm" id="btnLimpiarFiltros">Limpiar filtros</button>
                        <button class="btn btn-primary-green btn-sm" id="btnAplicarFiltros">Aplicar filtros</button>
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="module-card">
                <table id="dataTable" class="table table-sm" style="width:100%">
                    <thead id="tableHead">
                        <!-- Dynamic headers -->
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

            <!-- Mini Modal: Info Detalle -->
            <div class="mini-modal-overlay" id="infoOverlay"></div>
            <div class="mini-modal" id="infoModal">
                <div class="mini-modal-header">
                    <h5 id="infoModalTitle">Información del asociado</h5>
                    <button class="mini-modal-close" id="btnCloseInfo">&times;</button>
                </div>
                <div class="mini-modal-body">
                    <div class="info-avatar"><i data-lucide="user"></i></div>
                    <div class="info-name" id="infoNombre"></div>
                    <div class="info-role" id="infoRol"></div>
                    <div id="infoRows"></div>
                </div>
            </div>

            <!-- Modal: Nuevo Asociado -->
            <div class="asoc-modal-overlay" id="modalAsociadoOverlay"></div>
            <div class="asoc-modal" id="modalAsociado">
                <div class="asoc-modal-header">
                    <div class="asoc-modal-title"><i data-lucide="hard-hat"></i><h4>Nuevo Asociado</h4></div>
                    <button class="asoc-modal-close" id="btnCloseAsociado">&times;</button>
                </div>
                <div class="asoc-modal-body">
                    <form id="formAsociado">
                        <div class="asoc-form-section-title">Datos del Asociado</div>

                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Nombre completo del asociado</label>
                            <input type="text" class="asoc-form-input" id="asociadoNombre" required placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Documento</label>
                            <input type="text" class="asoc-form-input" id="asociadoDocumento" required placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Telefono</label>
                            <input type="text" class="asoc-form-input" id="asociadoTelefono" placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Correo Electronico</label>
                            <input type="email" class="asoc-form-input" id="asociadoEmail" placeholder="Ingrese aquí">
                        </div>

                        <div class="asoc-form-section-title" style="margin-top: 24px;">Datos Laborales</div>

                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Fecha de Inicio</label>
                            <input type="text" class="asoc-form-input" id="asociadoFechaInicio" placeholder="Seleccione fecha" readonly style="background: white; cursor: pointer;">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Dirección</label>
                            <input type="text" class="asoc-form-input" id="asociadoDireccion" placeholder="Ingrese dirección">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Tipo de contrato</label>
                            <input type="text" class="asoc-form-input" id="asociadoTipoContrato" placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Cargo</label>
                            <input type="text" class="asoc-form-input" id="asociadoCargo" placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Tipo de asociado</label>
                            <input type="text" class="asoc-form-input" id="asociadoTipo" placeholder="Ingrese aquí">
                        </div>

                        <div class="asoc-form-actions">
                            <button type="button" class="asoc-btn-cancel" id="btnCancelAsociado">Cancelar</button>
                            <button type="submit" class="asoc-btn-save">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Modal: Nuevo Cliente -->
            <div class="asoc-modal-overlay" id="modalClienteOverlay"></div>
            <div class="asoc-modal" id="modalCliente">
                <div class="asoc-modal-header">
                    <div class="asoc-modal-title"><i data-lucide="user-plus"></i><h4>Nuevo Cliente</h4></div>
                    <button class="asoc-modal-close" id="btnCloseCliente">&times;</button>
                </div>
                <div class="asoc-modal-body">
                    <form id="formCliente">
                        <div class="asoc-form-section-title">Datos del Cliente</div>

                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Nombre completo</label>
                            <input type="text" class="asoc-form-input" id="clienteNombre" required placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Documento</label>
                            <input type="text" class="asoc-form-input" id="clienteDocumento" required placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Teléfono</label>
                            <input type="text" class="asoc-form-input" id="clienteTelefono" placeholder="Ingrese aquí">
                        </div>
                        <div class="asoc-form-group">
                            <label class="asoc-form-label">Correo Electronico</label>
                            <input type="email" class="asoc-form-input" id="clienteEmail" placeholder="Ingrese aquí">
                        </div>

                        <div class="asoc-form-actions">
                            <button type="button" class="asoc-btn-cancel" id="btnCancelCliente">Cancelar</button>
                            <button type="submit" class="asoc-btn-save">Guardar cambios</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
    }

    async afterMount() {
        console.log('[Asociados] afterMount starting...');
        await this.initDataTable();
        console.log('[Asociados] DataTable initialized');
        this.attachEvents();
        try { this.initLibraries(); } catch (e) { console.warn('[Asociados] initLibraries failed:', e.message); }
        await this.loadData();
        console.log('[Asociados] Data loaded, total records:', this.allData.length);
        if (window.lucide) lucide.createIcons();
    }

    initLibraries() {
        // Air Datepicker on filter date inputs
        LibraryInit.initDatePickers(['#filterFechaDesde', '#filterFechaHasta']);
        // Tom Select on Estado select
        LibraryInit.initSelects(['#filterEstado']);
    }

    initDataTable() {
        return new Promise((resolve) => {
            const tryInit = () => {
                if (!window.$ || !window.$.fn || !window.$.fn.DataTable) {
                    setTimeout(tryInit, 200);
                    return;
                }
                // Ensure any previous instance is completely gone
                if (window.$.fn.DataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable().destroy();
                    this.element.querySelector('#dataTable').innerHTML = '<thead id="tableHead"></thead><tbody id="tableBody"></tbody>';
                }

                const self = this;
                const tableHead = this.element.querySelector('#tableHead');
                if (this.activeTab === 'asociados') {
                    tableHead.innerHTML = `
                        <tr>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Fecha Registro</th>
                            <th>Cargo</th>
                            <th>Tipo</th>
                            <th>Inicio</th>
                            <th>Estado</th>
                            <th style="width:120px;text-align:center;">Acciones</th>
                        </tr>
                    `;
                } else {
                    tableHead.innerHTML = `
                        <tr>
                            <th>Nombre</th>
                            <th>Documento</th>
                            <th>Teléfono</th>
                            <th>Email</th>
                            <th>Fecha Registro</th>
                            <th>Estado</th>
                            <th style="width:120px;text-align:center;">Acciones</th>
                        </tr>
                    `;
                }

                const columns = [];
                if (this.activeTab === 'asociados') {
                    columns.push(
                        { data: null, render: (d) => `${d.nombre} ${d.apellido || ''}`.trim() },
                        { data: 'documento' },
                        { data: 'telefono', render: d => d || '—' },
                        { data: 'email', render: d => d || '—' },
                        { data: 'fechaRegistro', render: d => d || '—' },
                        { data: null, render: d => d.cargo || '—' },
                        { data: null, render: d => d.tipo || '—' },
                        { data: 'fechaInicio', render: d => d || '—' },
                        {
                            data: 'activo',
                            render: a => a
                                ? '<span class="badge-status badge-active">● Activo</span>'
                                : '<span class="badge-status badge-inactive">● Inactivo</span>'
                        },
                        {
                            data: null, orderable: false, className: 'text-center', render: (d) => {
                                const toggleIcon = d.activo ? 'user-x' : 'user-check';
                                const toggleTitle = d.activo ? 'Inactivar' : 'Activar';
                                const toggleClass = d.activo ? 'btn-toggle-off' : 'btn-toggle-on';
                                return `
                                    <div class="d-flex justify-content-center gap-1">
                                        <button class="btn-action btn-view" data-id="${d.id}" title="Ver detalle">
                                            <i data-lucide="eye"></i>
                                        </button>
                                        <button class="btn-action btn-edit" data-id="${d.id}" title="Editar">
                                            <i data-lucide="edit-2"></i>
                                        </button>
                                        <button class="btn-action btn-toggle ${toggleClass}" data-id="${d.id}" title="${toggleTitle}">
                                            <i data-lucide="${toggleIcon}"></i>
                                        </button>
                                    </div>
                                `;
                            }
                        }
                    );
                } else {
                    columns.push(
                        { data: 'nombre' },
                        { data: 'documento' },
                        { data: 'telefono', render: d => d || '—' },
                        { data: 'email', render: d => d || '—' },
                        { data: 'fechaRegistro', render: d => d || '—' },
                        {
                            data: 'activo',
                            render: a => a
                                ? '<span class="badge-status badge-active">● Activo</span>'
                                : '<span class="badge-status badge-inactive">● Inactivo</span>'
                        },
                        {
                            data: null, orderable: false, className: 'text-center', render: (d) => {
                                const toggleIcon = d.activo ? 'user-x' : 'user-check';
                                const toggleTitle = d.activo ? 'Inactivar' : 'Activar';
                                const toggleClass = d.activo ? 'btn-toggle-off' : 'btn-toggle-on';
                                return `
                                    <div class="d-flex justify-content-center gap-1">
                                        <button class="btn-action btn-view" data-id="${d.id}" title="Ver detalle">
                                            <i data-lucide="eye"></i>
                                        </button>
                                        <button class="btn-action btn-edit" data-id="${d.id}" title="Editar">
                                            <i data-lucide="edit-2"></i>
                                        </button>
                                        <button class="btn-action btn-toggle ${toggleClass}" data-id="${d.id}" title="${toggleTitle}">
                                            <i data-lucide="${toggleIcon}"></i>
                                        </button>
                                    </div>
                                `;
                            }
                        }
                    );
                }

                this.dataTable = $('#dataTable').DataTable({
                    language: {
                        processing: 'Procesando...',
                        search: 'Buscar:',
                        lengthMenu: 'Mostrar _MENU_ registros',
                        info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                        infoEmpty: 'No hay registros',
                        infoFiltered: '(filtrado de _MAX_ registros totales)',
                        loadingRecords: 'Cargando...',
                        zeroRecords: 'No se encontraron resultados',
                        emptyTable: 'No hay registros disponibles',
                        paginate: { first: 'Primero', previous: 'Anterior', next: 'Siguiente', last: 'Último' }
                    },
                    ordering: false,
                    searching: false,
                    columns: columns,
                    destroy: true
                });

                // Delegate click on eye buttons
                $('#dataTable tbody').on('click', '.btn-view', (e) => {
                    const id = $(e.currentTarget).data('id');
                    const record = self.allData.find(r => r.id == id);
                    if (record) self.showInfo(record);
                });

                // Delegate click on edit buttons
                $('#dataTable tbody').on('click', '.btn-edit', (e) => {
                    const id = $(e.currentTarget).data('id');
                    const record = self.allData.find(r => r.id == id);
                    if (record) self.handleEdit(record);
                });

                // Delegate click on toggle buttons (btn-delete or its dynamic classes)
                $('#dataTable tbody').on('click', '.btn-delete, .btn-edit', function (e) {
                    if (!$(this).hasClass('btn-toggle') && !$(this).parent().find('.btn-view').length) return; // Basic guard
                    // Re-implementing more reliably below
                });

                $('#dataTable tbody').on('click', '[data-id]', function (e) {
                    const $btn = $(this);
                    const id = $btn.data('id');
                    const record = self.allData.find(r => r.id == id);
                    if (!record) return;

                    if ($btn.hasClass('btn-view')) {
                        self.showInfo(record);
                    } else if ($btn.hasClass('btn-edit')) {
                        self.handleEdit(record);
                    } else if ($btn.hasClass('btn-toggle')) {
                        self.handleToggleActivo(record);
                    }
                });

                resolve();
            };
            tryInit();
        });
    }

    showInfo(record) {
        const isAsociado = this.activeTab === 'asociados';
        const title = isAsociado ? 'Información del asociado' : 'Información del cliente';
        const name = isAsociado ? `${record.nombre} ${record.apellido || ''}`.trim() : record.nombre;
        const role = isAsociado ? (record.cargo || record.tipo || 'Asociado') : 'Cliente';

        this.element.querySelector('#infoModalTitle').textContent = title;
        this.element.querySelector('#infoNombre').textContent = name;
        this.element.querySelector('#infoRol').textContent = role;

        // Only show fields that have actual data
        const fields = [];
        if (record.documento) fields.push({ label: 'Documento', value: record.documento });
        if (record.telefono) fields.push({ label: 'Teléfono', value: record.telefono });
        if (record.email) fields.push({ label: 'Correo Electrónico', value: record.email });
        if (isAsociado) {
            if (record.fechaInicio) fields.push({ label: 'Fecha Inicio', value: record.fechaInicio });
            if (record.tipoContrato) fields.push({ label: 'Tipo Contrato', value: record.tipoContrato });
            if (record.cargo) fields.push({ label: 'Cargo', value: record.cargo });
            if (record.tipo) fields.push({ label: 'Tipo', value: record.tipo });
            if (record.direccion) fields.push({ label: 'Dirección', value: record.direccion });
        } else {
            if (record.fechaRegistro) fields.push({ label: 'Fecha Registro', value: record.fechaRegistro });
            if (record.direccion) fields.push({ label: 'Dirección', value: record.direccion });
        }

        const rows = fields.map(f =>
            `<div class="info-row"><span class="info-label">${f.label}</span><span class="info-value">${f.value}</span></div>`
        ).join('');

        this.element.querySelector('#infoRows').innerHTML = rows || '<p style="text-align:center;color:#94a3b8;">Sin datos adicionales</p>';
        this.element.querySelector('#infoOverlay').classList.add('show');
        this.element.querySelector('#infoModal').classList.add('show');

        if (window.lucide) window.lucide.createIcons();
    }

    handleEdit(record) {
        const isAsociado = this.activeTab === 'asociados';
        this._editingId = record.id;

        if (isAsociado) {
            const fullName = `${record.nombre} ${record.apellido || ''}`.trim();
            this.element.querySelector('#asociadoNombre').value = fullName;
            this.element.querySelector('#asociadoDocumento').value = record.documento || '';
            this.element.querySelector('#asociadoTelefono').value = record.telefono || '';
            this.element.querySelector('#asociadoEmail').value = record.email || '';
            // Fix: include all fields in edit
            this.element.querySelector('#asociadoFechaInicio').value = record.fechaInicio || record.fechaRegistro || '';
            this.element.querySelector('#asociadoTipoContrato').value = record.tipoContrato || '';
            this.element.querySelector('#asociadoCargo').value = record.cargo || '';
            this.element.querySelector('#asociadoTipo').value = record.tipo || '';
            this.element.querySelector('#asociadoDireccion').value = record.direccion || '';
            this.element.querySelector('.asoc-modal-title h4').textContent = 'Editar Asociado';
            this.openModal('Asociado');
        } else {
            this.element.querySelector('#clienteNombre').value = record.nombre || '';
            this.element.querySelector('#clienteDocumento').value = record.documento || '';
            this.element.querySelector('#clienteTelefono').value = record.telefono || '';
            this.element.querySelector('#clienteEmail').value = record.email || '';
            this.element.querySelector('.asoc-modal:last-of-type .asoc-modal-title h4').textContent = 'Editar Cliente';
            this.openModal('Cliente');
        }
    }

    closeInfo() {
        this.element.querySelector('#infoModal').classList.remove('show');
        this.element.querySelector('#infoOverlay').classList.remove('show');
    }

    async loadData(searchTerm = '') {
        try {
            console.log('[Asociados] loadData called, activeTab:', this.activeTab, 'searchTerm:', searchTerm);
            if (this.activeTab === 'asociados') {
                if (searchTerm) {
                    this.allData = await ApiClient.asociados.buscar(searchTerm);
                } else {
                    this.allData = await ApiClient.asociados.getAll();
                }
            } else {
                if (searchTerm) {
                    this.allData = await ApiClient.clientes.buscar(searchTerm);
                } else {
                    this.allData = await ApiClient.clientes.getAll();
                }
            }
            console.log('[Asociados] Loaded', this.allData.length, 'records');
            this.applyFilters();
        } catch (err) {
            console.error('[Asociados] Error cargando datos:', err);
        }
    }

    applyFilters() {
        let data = [...this.allData];

        // Search filtering is now handled server-side in loadData.
        // We only apply local date/status filters here.

        const desde = this.element.querySelector('#filterFechaDesde')?.value;
        const hasta = this.element.querySelector('#filterFechaHasta')?.value;
        if (desde) data = data.filter(d => d.fechaRegistro >= desde);
        if (hasta) data = data.filter(d => d.fechaRegistro <= hasta);

        const estado = this.element.querySelector('#filterEstado')?.value;
        if (estado === 'true') data = data.filter(d => d.activo === true);
        if (estado === 'false') data = data.filter(d => d.activo === false);

        console.log('[Asociados] applyFilters: showing', data.length, 'records, dataTable exists:', !!this.dataTable);
        if (this.dataTable) {
            this.dataTable.clear().rows.add(data).draw();
            setTimeout(() => lucide.createIcons(), 100);
        } else {
            console.error('[Asociados] DataTable not initialized yet!');
        }
    }

    attachEvents() {
        // Real-time numeric validation (prevents writing letters)
        const numericInputs = [
            '#asociadoDocumento', '#asociadoTelefono',
            '#clienteDocumento', '#clienteTelefono'
        ];
        numericInputs.forEach(sel => {
            this.element.querySelector(sel)?.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        });

        // Tab switching
        this.element.querySelectorAll('.asoc-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.element.querySelectorAll('.asoc-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeTab = tab.dataset.tab;

                const label = this.activeTab === 'asociados' ? 'asociado' : 'cliente';
                this.element.querySelector('#searchInput').placeholder = `Buscar ${label}`;
                this.element.querySelector('#btnNuevoText').textContent = `Nuevo ${label}`;

                this.element.querySelector('#searchInput').value = '';
                this.element.querySelector('#filterFechaDesde').value = '';
                this.element.querySelector('#filterFechaHasta').value = '';
                this.element.querySelector('#filterEstado').value = '';

                // Pure DOM reset to ensure zero trace of old DataTable
                const tableContainer = this.element.querySelector('.module-card:has(#dataTable)');
                if (tableContainer) {
                    tableContainer.innerHTML = `
                        <table id="dataTable" class="table table-sm" style="width:100%">
                            <thead id="tableHead"></thead>
                            <tbody id="tableBody"></tbody>
                        </table>
                    `;
                }

                this.dataTable = null;
                this.initDataTable();
                this.loadData();
            });
        });

        this.element.querySelector('#btnNuevo')?.addEventListener('click', () => {
            if (this.activeTab === 'asociados') {
                this.openModal('Asociado');
            } else {
                this.openModal('Cliente');
            }
        });

        // Debounce for search input
        let searchTimeout;
        this.element.querySelector('#searchInput')?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.loadData(e.target.value.trim());
            }, 300);
        });

        this.element.querySelector('#btnAplicarFiltros')?.addEventListener('click', () => this.applyFilters());

        // Automatic filtering on change
        this.element.querySelector('#filterFechaDesde')?.addEventListener('change', () => this.applyFilters());
        this.element.querySelector('#filterFechaHasta')?.addEventListener('change', () => this.applyFilters());
        this.element.querySelector('#filterEstado')?.addEventListener('change', () => this.applyFilters());

        this.element.querySelector('#btnLimpiarFiltros')?.addEventListener('click', () => {
            this.element.querySelector('#searchInput').value = '';
            // Clear Air Datepicker date inputs
            const desdeEl = this.element.querySelector('#filterFechaDesde');
            const hastaEl = this.element.querySelector('#filterFechaHasta');
            if (desdeEl) desdeEl.value = '';
            if (hastaEl) hastaEl.value = '';
            // Reset Tom Select
            const estadoEl = this.element.querySelector('#filterEstado');
            if (estadoEl && estadoEl.tomselect) estadoEl.tomselect.setValue('');
            else if (estadoEl) estadoEl.value = '';
            this.loadData(); // Clear search and reload all
        });

        // Info modal close
        this.element.querySelector('#btnCloseInfo')?.addEventListener('click', () => this.closeInfo());
        this.element.querySelector('#infoOverlay')?.addEventListener('click', () => this.closeInfo());

        // Asociado modal
        this.element.querySelector('#btnCloseAsociado')?.addEventListener('click', () => this.closeModal('Asociado'));
        this.element.querySelector('#btnCancelAsociado')?.addEventListener('click', () => this.closeModal('Asociado'));
        this.element.querySelector('#modalAsociadoOverlay')?.addEventListener('click', () => this.closeModal('Asociado'));
        this.element.querySelector('#formAsociado')?.addEventListener('submit', (e) => this.handleSaveAsociado(e));

        // Cliente modal
        this.element.querySelector('#btnCloseCliente')?.addEventListener('click', () => this.closeModal('Cliente'));
        this.element.querySelector('#btnCancelCliente')?.addEventListener('click', () => this.closeModal('Cliente'));
        this.element.querySelector('#modalClienteOverlay')?.addEventListener('click', () => this.closeModal('Cliente'));
        this.element.querySelector('#formCliente')?.addEventListener('submit', (e) => this.handleSaveCliente(e));
    }

    openModal(type) {
        const modal = this.element.querySelector(`#modal${type}`);
        const overlay = this.element.querySelector(`#modal${type}Overlay`);

        modal.classList.add('show');
        overlay.classList.add('show');

        // Robust initialization of Air Datepicker
        if (type === 'Asociado') {
            const initWithRetry = (attempts = 0) => {
                const sel = '#asociadoFechaInicio';
                const el = this.element.querySelector(sel);
                if (el) {
                    // Small additional delay to ensure modal transition is enough
                    setTimeout(() => {
                        if (!window.AirDatepicker) return;
                        LibraryInit.destroyDatePicker(sel);
                        LibraryInit.initDatePickers([sel], {
                            container: '#modalAsociado' // Force inside modal DOM
                        });
                    }, 200);
                } else if (attempts < 10) {
                    setTimeout(() => initWithRetry(attempts + 1), 100);
                }
            };
            initWithRetry();
        }

        if (window.lucide) lucide.createIcons();
    }

    closeModal(type) {
        this.element.querySelector(`#modal${type}`).classList.remove('show');
        this.element.querySelector(`#modal${type}Overlay`).classList.remove('show');
        this.element.querySelector(`#form${type}`).reset();
        this._editingId = null;
        // Reset modal title
        if (type === 'Asociado') {
            const titleEl = this.element.querySelector('#modalAsociado .asoc-modal-title h4');
            if (titleEl) titleEl.textContent = 'Nuevo Asociado';
        } else {
            const titleEl = this.element.querySelector('#modalCliente .asoc-modal-title h4');
            if (titleEl) titleEl.textContent = 'Nuevo Cliente';
        }
    }

    async handleSaveAsociado(e) {
        e.preventDefault();
        const nombreCompleto = this.element.querySelector('#asociadoNombre').value.trim();
        const documento = this.element.querySelector('#asociadoDocumento').value.trim();
        const telefono = this.element.querySelector('#asociadoTelefono').value.trim();
        const email = this.element.querySelector('#asociadoEmail').value.trim();

        // Validations
        if (!/^\d+$/.test(documento)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'El documento debe contener solo números.' });
        }
        if (telefono && !/^\d+$/.test(telefono)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'El teléfono debe contener solo números.' });
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'Por favor, ingrese un correo electrónico válido.' });
        }

        const parts = nombreCompleto.split(/\s+/);
        const nombre = parts[0] || '';
        const apellido = parts.slice(1).join(' ') || '';

        const data = {
            nombre: nombre,
            apellido: apellido,
            documento: documento,
            telefono: telefono || null,
            email: this.element.querySelector('#asociadoEmail').value.trim() || null,
            fechaInicio: this.element.querySelector('#asociadoFechaInicio').value || null,
            tipoContrato: this.element.querySelector('#asociadoTipoContrato').value.trim() || null,
            cargo: this.element.querySelector('#asociadoCargo').value.trim() || null,
            tipo: this.element.querySelector('#asociadoTipo').value.trim() || null,
            direccion: this.element.querySelector('#asociadoDireccion').value.trim() || null,
            activo: true // New associates are active by default
        };

        if (this._editingId) {
            const record = this.allData.find(r => r.id == this._editingId);
            if (record) data.activo = record.activo;
        }

        try {
            if (this._editingId) {
                await ApiClient.asociados.update(this._editingId, data);
                this.closeModal('Asociado');
                Swal.fire({ icon: 'success', title: 'Asociado actualizado', text: 'Los cambios se han guardado correctamente.', timer: 2000, showConfirmButton: false });
            } else {
                await ApiClient.asociados.create(data);
                this.closeModal('Asociado');
                Swal.fire({ icon: 'success', title: 'Asociado registrado', text: 'El asociado se ha guardado correctamente.', timer: 2000, showConfirmButton: false });
            }
            await this.loadData();
        } catch (err) {
            const msg = err.message || 'No se pudo guardar la información.';
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        }
    }

    async handleSaveCliente(e) {
        e.preventDefault();
        const documento = this.element.querySelector('#clienteDocumento').value.trim();
        const telefono = this.element.querySelector('#clienteTelefono').value.trim();
        const email = this.element.querySelector('#clienteEmail').value.trim();

        // Validations
        if (!/^\d+$/.test(documento)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'El documento debe contener solo números.' });
        }
        if (telefono && !/^\d+$/.test(telefono)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'El teléfono debe contener solo números.' });
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Swal.fire({ icon: 'warning', title: 'Validación', text: 'Por favor, ingrese un correo electrónico válido.' });
        }

        const data = {
            nombre: this.element.querySelector('#clienteNombre').value.trim(),
            documento: documento,
            telefono: telefono || null,
            email: this.element.querySelector('#clienteEmail').value.trim() || null,
            activo: true
        };

        if (this._editingId) {
            const record = this.allData.find(r => r.id == this._editingId);
            if (record) data.activo = record.activo;
        }

        try {
            if (this._editingId) {
                await ApiClient.clientes.update(this._editingId, data);
                this.closeModal('Cliente');
                Swal.fire({ icon: 'success', title: 'Cliente actualizado', text: 'Los cambios se han guardado correctamente.', timer: 2000, showConfirmButton: false });
            } else {
                await ApiClient.clientes.create(data);
                this.closeModal('Cliente');
                Swal.fire({ icon: 'success', title: 'Cliente registrado', text: 'El cliente se ha guardado correctamente.', timer: 2000, showConfirmButton: false });
            }
            await this.loadData();
        } catch (err) {
            const msg = err.message || 'No se pudo guardar la información.';
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        }
    }

    async handleToggleActivo(record) {
        const isAsociado = this.activeTab === 'asociados';
        const label = isAsociado ? 'asociado' : 'cliente';
        const action = record.activo ? 'inactivar' : 'activar';
        const name = isAsociado ? `${record.nombre} ${record.apellido || ''}`.trim() : record.nombre;

        const result = await Swal.fire({
            title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} ${label}?`,
            text: `${name} será ${record.activo ? 'inactivado' : 'activado'}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: record.activo ? '#dc2626' : '#16a34a',
            confirmButtonText: record.activo ? 'Sí, inactivar' : 'Sí, activar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        try {
            const api = isAsociado ? ApiClient.asociados : ApiClient.clientes;
            await api.toggleActivo(record.id);
            Swal.fire({ icon: 'success', title: `${label.charAt(0).toUpperCase() + label.slice(1)} ${action === 'activar' ? 'activado' : 'inactivado'}`, timer: 1500, showConfirmButton: false });
            await this.loadData();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: `No se pudo ${action} el ${label}.` });
        }
    }
}

