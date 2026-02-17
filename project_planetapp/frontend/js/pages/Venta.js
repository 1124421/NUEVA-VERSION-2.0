import { Component } from '../core/Component.js';
import { ApiClient } from '../services/ApiClient.js';

export class Venta extends Component {
    constructor() {
        super('venta');
        this.materialesVenta = [];
        this.clienteSeleccionado = null;
        this.ventasTable = null;
        this.searchClienteTimeout = null;
        this.allMateriales = [];
    }

    template() {
        return `
            <!-- Form Card -->
            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="plus-circle"></i>
                    <h5>Nueva Venta</h5>
                </div>
                <form id="formVenta">
                    <!-- Cliente Search -->
                    <div class="form-group">
                        <label class="form-label">Buscar Cliente</label>
                        <div class="search-box">
                            <input type="text" class="form-control form-control-sm" id="searchCliente" placeholder="Buscar por nombre, documento o email..." autocomplete="off">
                            <div class="search-results" id="clienteResults"></div>
                        </div>
                    </div>

                    <div id="clienteInfo" class="info-box-premium" style="display: none;">
                        <div class="info-icon"><i data-lucide="user"></i></div>
                        <div class="info-content">
                            <p><strong>Nombre:</strong> <span id="infoClienteNombre"></span></p>
                            <p><strong>Documento:</strong> <span id="infoClienteDoc"></span></p>
                            <p><strong>Teléfono:</strong> <span id="infoClienteTel"></span></p>
                            <p><strong>Email:</strong> <span id="infoClienteEmail"></span></p>
                        </div>
                        <button type="button" class="btn-remove" id="btnClearCliente" style="position:absolute;top:8px;right:8px">✕</button>
                    </div>

                    <!-- Material Selection -->
                    <div class="form-group">
                        <label class="form-label">Agregar Materiales <small class="text-muted">(máx. 10)</small></label>

                        <!-- Search by code -->
                        <div style="display:flex; gap:8px; margin-bottom:10px;">
                            <div class="search-box" style="flex:1;">
                                <input type="text" class="form-control form-control-sm" id="searchCodigo" placeholder="Buscar por código o nombre..." autocomplete="off">
                                <div class="search-results" id="codigoResults"></div>
                            </div>
                        </div>

                        <!-- Category / Subcategory selectors -->
                        <div style="display:flex; gap:8px; margin-bottom:10px;">
                            <select class="form-control form-control-sm" id="filterCategoria" style="flex:1;">
                                <option value="">Filtrar por categoría...</option>
                            </select>
                            <select class="form-control form-control-sm" id="filterSubcategoria" style="flex:1;" disabled>
                                <option value="">Subcategoría...</option>
                            </select>
                        </div>

                        <!-- Filtered materials list -->
                        <div id="filteredMaterials" style="max-height:180px; overflow-y:auto; border:1px solid var(--border-light); border-radius:6px; display:none;">
                        </div>
                    </div>

                    <div id="listaMaterialesVenta"></div>
                    <div class="total-row"><h5>Total: $<span id="totalVenta">0.00</span></h5></div>
                    <button type="submit" class="btn btn-primary-green" style="font-size:13px;">Registrar Venta</button>
                </form>
            </div>

            <!-- Table Card -->
            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="list"></i>
                    <h5>Ventas Registradas</h5>
                </div>
                <table id="ventasTable" class="table table-sm" style="width:100%">
                    <thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Material</th><th>Cantidad</th><th>P. Unit.</th><th>Total</th><th>Estado</th><th style="width:80px;text-align:center;">Acciones</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        `;
    }

    async afterMount() {
        this.initDataTable();
        this.attachEvents();
        await this.loadVentas();
        await this.loadCategorias();
        await this.loadAllMateriales();
    }

    initDataTable() {
        if (!window.$ || !window.$.fn || !window.$.fn.DataTable) {
            setTimeout(() => this.initDataTable(), 200);
            return;
        }
        const self = this;
        this.ventasTable = $('#ventasTable').DataTable({
            language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
            ordering: false,
            columns: [
                { data: 'id', render: d => `<strong>#V${String(d).padStart(3, '0')}</strong>` },
                { data: 'fechaVenta', render: d => d ? new Date(d).toLocaleDateString('es-CO') : '—' },
                { data: 'cliente', render: d => d || '—' },
                { data: 'materialNombre', render: d => d || '—' },
                { data: 'cantidad', render: d => `${Number(d).toFixed(2)} kg` },
                { data: 'precioUnitario', render: d => `$${Number(d).toFixed(2)}` },
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
                        return `<button class="action-btn action-btn-danger btn-cancel" data-id="${d.id}" title="Cancelar venta"><i data-lucide="x"></i></button>`;
                    }
                }
            ]
        });

        // Cancel button handler
        $('#ventasTable tbody').on('click', '.btn-cancel', (e) => {
            const id = $(e.currentTarget).data('id');
            self.handleCancel(id);
        });
    }

    async loadVentas() {
        try {
            const ventas = await ApiClient.ventas.getAll();
            if (this.ventasTable) this.ventasTable.clear().rows.add(ventas).draw();
        } catch (err) {
            console.error('Error cargando ventas:', err);
        }
    }

    async loadCategorias() {
        try {
            const cats = await ApiClient.categorias.getActivas();
            const sel = this.element.querySelector('#filterCategoria');
            sel.innerHTML = '<option value="">Filtrar por categoría...</option>' +
                cats.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
        } catch (err) {
            console.error('Error cargando categorías:', err);
        }
    }

    async loadAllMateriales() {
        try {
            this.allMateriales = await ApiClient.materiales.getAll();
        } catch (err) {
            console.error('Error cargando materiales:', err);
            this.allMateriales = [];
        }
    }

    attachEvents() {
        // Client search
        const searchCliente = this.element.querySelector('#searchCliente');
        searchCliente?.addEventListener('input', (e) => {
            clearTimeout(this.searchClienteTimeout);
            this.searchClienteTimeout = setTimeout(() => this.handleSearchCliente(e.target.value), 300);
        });

        this.element.querySelector('#btnClearCliente')?.addEventListener('click', () => {
            this.clienteSeleccionado = null;
            this.element.querySelector('#searchCliente').value = '';
            this.element.querySelector('#clienteInfo').style.display = 'none';
        });

        // Code/name search
        const searchCodigo = this.element.querySelector('#searchCodigo');
        searchCodigo?.addEventListener('input', (e) => {
            this.handleSearchCodigo(e.target.value.trim());
        });

        // Category filter
        this.element.querySelector('#filterCategoria').addEventListener('change', (e) => {
            this.handleFilterCategoria(e.target.value);
        });

        // Subcategory filter
        this.element.querySelector('#filterSubcategoria').addEventListener('change', () => {
            this.showFilteredMaterials();
        });

        // Form submit
        const form = this.element.querySelector('#formVenta');
        form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // Close search results on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-box')) {
                this.element.querySelectorAll('.search-results').forEach(r => r.classList.remove('show'));
            }
        });
    }

    // ========================================
    //  CLIENT SEARCH (unchanged logic)
    // ========================================
    async handleSearchCliente(query) {
        const results = this.element.querySelector('#clienteResults');
        results.innerHTML = '';
        if (query.length < 1) { results.classList.remove('show'); return; }

        try {
            const clientes = await ApiClient.clientes.buscar(query);
            if (!clientes || clientes.length === 0) {
                results.innerHTML = '<div class="search-result-item text-muted">Sin resultados</div>';
            } else {
                results.innerHTML = clientes.map(c => `
                    <div class="search-result-item" data-id="${c.id}">
                        <strong>${c.nombre}</strong>
                        <small class="text-muted">Doc: ${c.documento}</small>
                        <br><small class="text-muted" style="font-size:10px">${c.email || ''}</small>
                    </div>
                `).join('');
            }
            results.classList.add('show');
            results.querySelectorAll('.search-result-item[data-id]').forEach(item => {
                item.addEventListener('click', () => this.selectCliente(item.dataset.id, clientes));
            });
        } catch (err) {
            console.error('Error buscando clientes:', err);
            results.innerHTML = '<div class="search-result-item text-danger">Error al buscar</div>';
            results.classList.add('show');
        }
    }

    selectCliente(id, list) {
        const cliente = list.find(c => c.id == id);
        if (!cliente) return;
        this.clienteSeleccionado = cliente;
        this.element.querySelector('#searchCliente').value = cliente.nombre;
        this.element.querySelector('#clienteResults').classList.remove('show');
        this.element.querySelector('#clienteInfo').style.display = 'flex';
        this.element.querySelector('#infoClienteNombre').textContent = cliente.nombre;
        this.element.querySelector('#infoClienteDoc').textContent = cliente.documento;
        this.element.querySelector('#infoClienteTel').textContent = cliente.telefono || '—';
        this.element.querySelector('#infoClienteEmail').textContent = cliente.email || '—';
        if (window.lucide) lucide.createIcons();
    }

    // ========================================
    //  MATERIAL SEARCH BY CODE/NAME
    // ========================================
    handleSearchCodigo(query) {
        const results = this.element.querySelector('#codigoResults');
        results.innerHTML = '';
        if (query.length < 1) { results.classList.remove('show'); return; }

        const q = query.toLowerCase();
        const matches = this.allMateriales.filter(m =>
            m.activo &&
            !this.materialesVenta.find(mv => mv.id === m.id) &&
            ((m.codigo && m.codigo.toLowerCase().includes(q)) || m.nombre.toLowerCase().includes(q))
        ).slice(0, 8);

        if (matches.length === 0) {
            results.innerHTML = '<div class="search-result-item text-muted" style="font-size:12px;">Sin resultados</div>';
        } else {
            results.innerHTML = matches.map(m => `
                <div class="search-result-item" data-id="${m.id}" style="font-size:12px; padding:6px 10px; cursor:pointer;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span>
                            ${m.codigo ? `<span style="color:var(--text-muted); margin-right:6px;">${m.codigo}</span>` : ''}
                            <strong>${m.nombre}</strong>
                        </span>
                        <span style="color:var(--primary); font-weight:600;">$${Number(m.precioVenta).toFixed(2)}/${m.unidad || 'kg'}</span>
                    </div>
                    <div style="font-size:10px; color:var(--text-muted);">${m.categoriaNombre || ''}${m.subcategoriaNombre ? ' › ' + m.subcategoriaNombre : ''}</div>
                </div>
            `).join('');
        }
        results.classList.add('show');
        results.querySelectorAll('.search-result-item[data-id]').forEach(item => {
            item.addEventListener('click', () => {
                this.addMaterialById(parseInt(item.dataset.id));
                this.element.querySelector('#searchCodigo').value = '';
                results.classList.remove('show');
            });
        });
    }

    // ========================================
    //  MATERIAL FILTER BY CATEGORY
    // ========================================
    async handleFilterCategoria(catId) {
        const subSel = this.element.querySelector('#filterSubcategoria');
        const panel = this.element.querySelector('#filteredMaterials');

        if (!catId) {
            subSel.innerHTML = '<option value="">Subcategoría...</option>';
            subSel.disabled = true;
            panel.style.display = 'none';
            return;
        }

        // Load subcategories
        try {
            const subs = await ApiClient.subcategorias.getByCategoria(catId);
            if (subs.length === 0) {
                subSel.innerHTML = '<option value="">Sin subcategorías</option>';
                subSel.disabled = true;
            } else {
                subSel.innerHTML = '<option value="">Todas las subcategorías</option>' +
                    subs.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('');
                subSel.disabled = false;
            }
        } catch (err) {
            subSel.innerHTML = '<option value="">Error</option>';
            subSel.disabled = true;
        }

        this.showFilteredMaterials();
    }

    showFilteredMaterials() {
        const catId = parseInt(this.element.querySelector('#filterCategoria').value);
        const subcatVal = this.element.querySelector('#filterSubcategoria').value;
        const subcatId = subcatVal ? parseInt(subcatVal) : null;
        const panel = this.element.querySelector('#filteredMaterials');

        if (!catId) { panel.style.display = 'none'; return; }

        let filtered = this.allMateriales.filter(m =>
            m.activo &&
            m.categoriaId === catId &&
            !this.materialesVenta.find(mv => mv.id === m.id)
        );

        if (subcatId) {
            filtered = filtered.filter(m => m.subcategoriaId === subcatId);
        }

        if (filtered.length === 0) {
            panel.innerHTML = '<div style="padding:12px; text-align:center; color:var(--text-muted); font-size:12px;">No hay materiales disponibles</div>';
        } else {
            panel.innerHTML = filtered.map(m => `
                <div class="filtered-mat-item" data-id="${m.id}"
                     style="display:flex; justify-content:space-between; align-items:center; padding:7px 12px; border-bottom:1px solid var(--border-light); cursor:pointer; font-size:12px; transition: background 0.15s;">
                    <div>
                        ${m.codigo ? `<span style="color:var(--text-muted); margin-right:4px;">${m.codigo}</span>` : ''}
                        <strong>${m.nombre}</strong>
                        ${m.subcategoriaNombre ? `<span style="color:var(--text-muted); font-size:10px; margin-left:4px;">› ${m.subcategoriaNombre}</span>` : ''}
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:var(--text-muted); font-size:11px;">Stock: ${m.stock} kg</span>
                        <span style="color:var(--primary); font-weight:600;">$${Number(m.precioVenta).toFixed(2)}</span>
                        <button type="button" class="btn btn-primary-green btn-add-filtered" data-id="${m.id}" style="padding:2px 8px; font-size:10px; line-height:1.4;">
                            + Agregar
                        </button>
                    </div>
                </div>
            `).join('');

            // Hover effect
            panel.querySelectorAll('.filtered-mat-item').forEach(item => {
                item.addEventListener('mouseenter', () => item.style.background = 'var(--primary-light)');
                item.addEventListener('mouseleave', () => item.style.background = '');
            });

            // Add material on button click
            panel.querySelectorAll('.btn-add-filtered').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addMaterialById(parseInt(btn.dataset.id));
                    this.showFilteredMaterials(); // re-render to remove added item
                });
            });
        }

        panel.style.display = 'block';
    }

    // ========================================
    //  ADD MATERIAL (shared logic)
    // ========================================
    addMaterialById(id) {
        if (this.materialesVenta.length >= 10) {
            Swal.fire({ icon: 'warning', title: 'Límite alcanzado', text: 'Máximo 10 materiales por venta.' });
            return;
        }
        const material = this.allMateriales.find(m => m.id === id);
        if (!material || this.materialesVenta.find(m => m.id === id)) return;
        this.materialesVenta.push({ ...material, peso: 0 });
        this.renderMateriales();
    }

    renderMateriales() {
        const container = this.element.querySelector('#listaMaterialesVenta');
        container.innerHTML = this.materialesVenta.map((m, i) => `
            <div class="material-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <strong>${m.nombre}</strong>
                    <span class="text-muted" style="font-size:12px">$${Number(m.precioVenta).toFixed(2)}/${m.unidad || 'kg'}</span>
                    <button type="button" class="btn-remove" data-index="${i}">Quitar</button>
                </div>
                <div class="row g-2">
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Peso (${m.unidad || 'kg'})</label>
                        <input type="number" class="form-control form-control-sm weight-input" data-index="${i}" value="${m.peso}" min="0" step="0.1">
                    </div>
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Precio</label>
                        <input type="text" class="form-control form-control-sm" value="$${Number(m.precioVenta).toFixed(2)}" readonly>
                    </div>
                    <div class="col-4">
                        <label class="form-label" style="font-size:11px">Subtotal</label>
                        <input type="text" class="form-control form-control-sm" value="$${(m.peso * m.precioVenta).toFixed(2)}" readonly>
                    </div>
                </div>
            </div>
        `).join('');

        container.querySelectorAll('.btn-remove').forEach(btn => {
            btn.addEventListener('click', () => { this.materialesVenta.splice(btn.dataset.index, 1); this.renderMateriales(); this.showFilteredMaterials(); });
        });
        container.querySelectorAll('.weight-input').forEach(input => {
            input.addEventListener('input', (e) => { this.materialesVenta[input.dataset.index].peso = parseFloat(e.target.value) || 0; this.renderMateriales(); });
        });

        this.updateTotal();
    }

    updateTotal() {
        const total = this.materialesVenta.reduce((sum, m) => sum + (m.peso * m.precioVenta), 0);
        this.element.querySelector('#totalVenta').textContent = total.toFixed(2);
    }

    async handleSubmit(e) {
        e.preventDefault();
        if (!this.clienteSeleccionado) {
            Swal.fire({ icon: 'warning', title: 'Cliente requerido', text: 'Debe seleccionar un cliente.' });
            return;
        }
        if (this.materialesVenta.length === 0) {
            Swal.fire({ icon: 'warning', title: 'Materiales requeridos', text: 'Debe agregar al menos un material.' });
            return;
        }
        const invalidMaterials = this.materialesVenta.filter(m => m.peso <= 0);
        if (invalidMaterials.length > 0) {
            Swal.fire({ icon: 'warning', title: 'Peso inválido', text: 'Todos los materiales deben tener un peso mayor a 0.' });
            return;
        }

        try {
            const promises = this.materialesVenta.map(m =>
                ApiClient.ventas.create({
                    materialId: m.id,
                    cantidad: m.peso,
                    precioUnitario: m.precioVenta,
                    cliente: this.clienteSeleccionado.nombre,
                    clienteDocumento: this.clienteSeleccionado.documento || null,
                })
            );
            await Promise.all(promises);

            Swal.fire({ icon: 'success', title: 'Venta registrada', text: `Se registraron ${this.materialesVenta.length} material(es) correctamente.`, timer: 2500, showConfirmButton: false });

            // Reset form
            this.materialesVenta = [];
            this.clienteSeleccionado = null;
            this.element.querySelector('#formVenta').reset();
            this.element.querySelector('#clienteInfo').style.display = 'none';
            this.element.querySelector('#filterSubcategoria').disabled = true;
            this.element.querySelector('#filteredMaterials').style.display = 'none';
            this.renderMateriales();
            await this.loadVentas();
            await this.loadAllMateriales(); // refresh stock
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo registrar la venta. Intente nuevamente.' });
        }
    }

    async handleCancel(id) {
        const result = await Swal.fire({
            title: '¿Cancelar esta venta?',
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
            await ApiClient.ventas.cancelar(id);
            Swal.fire({ icon: 'success', title: 'Venta cancelada', text: 'El stock ha sido revertido correctamente.', timer: 2000, showConfirmButton: false });
            await this.loadVentas();
            await this.loadAllMateriales();
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cancelar la venta.' });
        }
    }
}
