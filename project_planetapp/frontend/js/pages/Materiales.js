import { Component } from '../core/Component.js';
import { Pagination } from '../components/Pagination.js';
import { ApiClient } from '../services/ApiClient.js';

export class Materiales extends Component {
    constructor() {
        super('materiales');
        this.dataTable = null;
        this.categorias = [];
        this.selectedCatId = null;
    }

    template() {
        return `
            <!-- Action Bar -->
            <div class="module-card" style="margin-bottom: 16px; padding: 14px;">
                <!-- Search row -->
                <div class="asoc-search-wrapper" style="margin-bottom: 10px;">
                    <i data-lucide="search" class="asoc-search-icon"></i>
                    <input type="text" class="form-control form-control-sm" id="searchMaterial" placeholder="Buscar material...">
                </div>
                <!-- Buttons row -->
                <div style="display: flex; justify-content: flex-end; gap: 8px;">
                    <button class="btn btn-outline-secondary btn-sm" id="btnCategorias">
                        Categorías
                    </button>
                    <button class="btn btn-primary-green btn-sm" id="btnNuevoMaterial">
                        Nuevo material
                    </button>
                </div>
            </div>

            <!-- Materials Table -->
            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="package"></i>
                    <h5>Listado de Materiales</h5>
                </div>
                <table id="materialesTable" class="table table-hover" style="width:100%">
                    <!-- DataTables will populate this -->
                </table>
                <!-- Custom Pagination Container -->
                <div id="materialesPagination"></div>
            </div>

            <!-- Modal: Nuevo/Editar Material -->
            <div class="modal fade" id="modalMaterial" tabindex="-1">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content" style="border:none; border-radius:12px; overflow:hidden;">
                        <div class="modal-header" style="background: var(--primary-gradient); color: white; border:none; padding: 14px 20px;">
                            <h5 class="modal-title" id="modalMaterialTitle" style="font-size:14px; font-weight:700;">
                                Registrar Material
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" style="padding:18px;">
                            <form id="formMaterial" novalidate>
                                <input type="hidden" id="materialId">
                                <div class="row g-3">
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="form-label">Código <span style="color:#94a3b8;font-weight:400;">(opcional)</span></label>
                                            <input type="text" class="form-control form-control-sm" id="codigo" placeholder="Ej: MAT-001">
                                        </div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="form-group">
                                            <label class="form-label">Nombre del material <span style="color:var(--accent-red);">*</span></label>
                                            <input type="text" class="form-control form-control-sm" id="nombre" placeholder="Ej: Cartón corrugado">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="form-label">Categoría <span style="color:var(--accent-red);">*</span></label>
                                            <select class="form-control form-control-sm" id="categoriaId">
                                                <option value="">Seleccione categoría...</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="form-label">Subcategoría <span style="color:#94a3b8;font-weight:400;">(opcional)</span></label>
                                            <select class="form-control form-control-sm" id="subcategoriaId" disabled>
                                                <option value="">Seleccione categoría primero</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="form-label">Precio unitario de compra <span style="color:var(--accent-red);">*</span></label>
                                            <div class="input-group input-group-sm">
                                                <span class="input-group-text" style="font-size:12px;">$</span>
                                                <input type="number" class="form-control form-control-sm" id="precioCompra" min="0" step="any" placeholder="0">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="form-label">Precio unitario de venta <span style="color:var(--accent-red);">*</span></label>
                                            <div class="input-group input-group-sm">
                                                <span class="input-group-text" style="font-size:12px;">$</span>
                                                <input type="number" class="form-control form-control-sm" id="precioVenta" min="0" step="any" placeholder="0">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="form-group">
                                            <label class="form-label">Stock (KG) <span style="color:var(--accent-red);">*</span></label>
                                            <input type="number" class="form-control form-control-sm" id="stock" min="0" step="any" placeholder="0">
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div class="form-group">
                                            <label class="form-label">Descripción <span style="color:#94a3b8;font-weight:400;">(opcional)</span></label>
                                            <textarea class="form-control form-control-sm" id="descripcion" rows="2" placeholder="Descripción del material..." style="resize:none;"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer" style="border-top: 1px solid var(--border-light); padding: 10px 20px;">
                            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" style="font-size:12px;">Cancelar</button>
                            <button type="button" class="btn btn-primary-green btn-sm" id="btnGuardarMaterial" style="font-size:12px;">
                                <i data-lucide="save" style="width:13px;height:13px;"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal: Gestión de Categorías -->
            <div class="modal fade" id="modalCategorias" tabindex="-1">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content" style="border:none; border-radius:12px; overflow:hidden;">
                        <div class="modal-header" style="background: var(--primary-gradient); color: white; border:none; padding: 14px 20px;">
                            <h5 class="modal-title" style="font-size:14px; font-weight:700;">
                                Gestión de Categorías y Subcategorías
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" style="padding:18px;">
                            <div class="row g-3">
                                <!-- Left: Categories -->
                                <div class="col-md-5">
                                    <div style="background: var(--bg-page); border: 1px solid var(--border); border-radius: 8px; padding: 12px;">
                                        <div class="card-header-row" style="margin-bottom:8px;">
                                            <i data-lucide="folder"></i>
                                            <h5>Categorías</h5>
                                        </div>
                                        <!-- New Category Input -->
                                        <div style="display:flex; gap:6px; margin-bottom:10px;">
                                            <input type="text" class="form-control form-control-sm" id="newCatName"
                                                   placeholder="Nombre de categoría..." style="font-size:12px;">
                                            <button class="btn btn-primary-green" id="btnAddCat" style="white-space:nowrap; padding:4px 12px; font-size:11px;">
                                                <i data-lucide="plus" style="width:12px;height:12px;"></i> Crear
                                            </button>
                                        </div>
                                        <!-- Categories List -->
                                        <div class="list-group" id="listCategorias" style="max-height:320px; overflow-y:auto;">
                                            <div class="text-center p-3" style="color:var(--text-muted);font-size:12px;">Cargando...</div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Right: Subcategories -->
                                <div class="col-md-7">
                                    <div style="background: var(--bg-page); border: 1px solid var(--border); border-radius: 8px; padding: 12px;">
                                        <div class="card-header-row" style="margin-bottom:8px;">
                                            <i data-lucide="git-branch"></i>
                                            <h5 id="selectedCatTitle">Subcategorías</h5>
                                        </div>
                                        <!-- Empty state -->
                                        <div id="subcatEmpty" style="text-align:center; padding: 30px 16px; color: var(--text-muted);">
                                            <i data-lucide="arrow-left" style="width:28px;height:28px;margin-bottom:6px;opacity:0.4;"></i>
                                            <p style="font-size:12px;margin:0;">Seleccione una categoría para ver sus subcategorías</p>
                                        </div>
                                        <!-- Subcategory Panel (hidden initially) -->
                                        <div id="subcatPanel" style="display:none;">
                                            <!-- New Subcategory Input -->
                                            <div style="display:flex; gap:6px; margin-bottom:10px;">
                                                <input type="text" class="form-control form-control-sm" id="newSubcatName"
                                                       placeholder="Nombre de subcategoría..." style="font-size:12px;">
                                                <button class="btn btn-primary-green" id="btnAddSubcat" style="white-space:nowrap; padding:4px 12px; font-size:11px;">
                                                    <i data-lucide="plus" style="width:12px;height:12px;"></i> Crear
                                                </button>
                                            </div>
                                            <!-- Subcategories Table -->
                                            <div style="overflow-y:auto; max-height:280px;">
                                                <table class="table table-sm" style="margin:0;">
                                                    <thead>
                                                        <tr>
                                                            <th style="font-size:11px;">Nombre</th>
                                                            <th style="font-size:11px;width:70px;">Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="tbodySubcats"></tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer" style="border-top: 1px solid var(--border-light); padding: 10px 20px;">
                            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-dismiss="modal" style="font-size:12px;">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterMount() {
        this.initDataTable();
        this.attachEvents();
        await this.loadData();
        if (window.lucide) window.lucide.createIcons();
    }

    initDataTable() {
        if (window.$ && window.$.fn.DataTable) {
            this.dataTable = $('#materialesTable').DataTable({
                language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
                language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
                paging: false,
                dom: 'rt', // Hide default pagination (p) and info (i), keep processing (r) and table (t)
                pageLength: 10,
                columns: [
                    { title: 'Código', data: 'codigo', defaultContent: '—' },
                    { title: 'Nombre', data: 'nombre' },
                    { title: 'Categoría', data: 'categoriaNombre', defaultContent: '—' },
                    { title: 'Subcategoría', data: 'subcategoriaNombre', defaultContent: '—' },
                    { title: 'P. Compra', data: 'precioCompra', render: v => `$${(v || 0).toLocaleString('es-CO')}` },
                    { title: 'P. Venta', data: 'precioVenta', render: v => `$${(v || 0).toLocaleString('es-CO')}` },
                    { title: 'Stock (KG)', data: 'stock', render: v => `${(v || 0)} KG` },
                    {
                        title: 'Acciones', data: null, orderable: false, render: (data) => `
                        <button class="action-btn action-btn-edit btn-edit" data-id="${data.id}" title="Editar">
                            <i data-lucide="edit-2"></i>
                        </button>
                    ` }
                ]
            });
            // Initialize Custom Pagination
            new Pagination(this.dataTable, 'materialesPagination');
        }
    }

    attachEvents() {
        // Material buttons
        this.element.querySelector('#btnNuevoMaterial').addEventListener('click', () => this.openModalMaterial());
        this.element.querySelector('#btnCategorias').addEventListener('click', () => this.openModalCategorias());
        this.element.querySelector('#btnGuardarMaterial').addEventListener('click', () => this.handleSaveMaterial());
        this.element.querySelector('#categoriaId').addEventListener('change', (e) => this.handleCategoryChange(e.target.value));

        // Category manager
        this.element.querySelector('#btnAddCat').addEventListener('click', () => this.addCategory());
        this.element.querySelector('#btnAddSubcat').addEventListener('click', () => this.addSubcategory());

        // Table edit
        $('#materialesTable tbody').on('click', '.btn-edit', (e) => {
            const data = this.dataTable.row($(e.currentTarget).closest('tr')).data();
            this.openModalMaterial(data);
        });

        // Search
        this.element.querySelector('#searchMaterial')?.addEventListener('input', (e) => {
            if (this.dataTable) this.dataTable.search(e.target.value).draw();
        });

        // Enter key for category/subcategory inputs
        this.element.querySelector('#newCatName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this.addCategory(); }
        });
        this.element.querySelector('#newSubcatName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); this.addSubcategory(); }
        });
    }

    async loadData() {
        try {
            const materiales = await ApiClient.materiales.getAll();
            if (this.dataTable) {
                this.dataTable.clear().rows.add(materiales).draw();
                setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
            }
        } catch (err) {
            console.error('Error loading materials:', err);
        }
    }

    // ==========================================
    //  MATERIAL MODAL
    // ==========================================
    async openModalMaterial(material = null) {
        const form = this.element.querySelector('#formMaterial');
        form.classList.remove('was-validated');
        form.reset();
        // Clear any previous is-invalid
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
        this.element.querySelector('#subcategoriaId').disabled = true;
        this.element.querySelector('#subcategoriaId').innerHTML = '<option value="">Seleccione categoría primero</option>';

        // Load categories
        try {
            const categorias = await ApiClient.categorias.getActivas();
            const catSelect = this.element.querySelector('#categoriaId');
            catSelect.innerHTML = '<option value="">Seleccione categoría...</option>' +
                categorias.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

            if (material) {
                this.element.querySelector('#materialId').value = material.id;
                this.element.querySelector('#codigo').value = material.codigo || '';
                this.element.querySelector('#nombre').value = material.nombre;
                this.element.querySelector('#precioCompra').value = material.precioCompra;
                this.element.querySelector('#precioVenta').value = material.precioVenta;
                this.element.querySelector('#stock').value = material.stock;
                this.element.querySelector('#descripcion').value = material.descripcion || '';
                this.element.querySelector('#modalMaterialTitle').textContent = 'Editar Material';

                if (material.categoriaId) {
                    catSelect.value = material.categoriaId;
                    await this.handleCategoryChange(material.categoriaId);
                    if (material.subcategoriaId) {
                        this.element.querySelector('#subcategoriaId').value = material.subcategoriaId;
                    }
                }
            } else {
                this.element.querySelector('#materialId').value = '';
                this.element.querySelector('#modalMaterialTitle').textContent = 'Registrar Material';
            }

            const modal = new bootstrap.Modal(document.getElementById('modalMaterial'));
            modal.show();
            setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar las categorías. ¿Hay categorías creadas?', 'error');
        }
    }

    async handleCategoryChange(catId) {
        const subSelect = this.element.querySelector('#subcategoriaId');

        if (!catId) {
            subSelect.innerHTML = '<option value="">Seleccione categoría primero</option>';
            subSelect.disabled = true;
            return;
        }

        subSelect.innerHTML = '<option value="">Cargando...</option>';
        subSelect.disabled = true;

        try {
            const subcats = await ApiClient.subcategorias.getByCategoria(catId);
            if (subcats.length === 0) {
                subSelect.innerHTML = '<option value="">Sin subcategorías (opcional)</option>';
                subSelect.disabled = true;
            } else {
                subSelect.innerHTML = '<option value="">Ninguna (opcional)</option>' +
                    subcats.map(s => `<option value="${s.id}">${s.nombre}</option>`).join('');
                subSelect.disabled = false;
            }
        } catch (err) {
            console.error(err);
            subSelect.innerHTML = '<option value="">Error al cargar</option>';
        }
    }

    async handleSaveMaterial() {
        const form = this.element.querySelector('#formMaterial');
        // Clear previous states
        form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        let hasError = false;

        // Only validate the essential required fields: nombre and categoría
        const nombre = this.element.querySelector('#nombre').value.trim();
        if (!nombre) {
            this.element.querySelector('#nombre').classList.add('is-invalid');
            hasError = true;
        }

        const catId = this.element.querySelector('#categoriaId').value;
        if (!catId) {
            this.element.querySelector('#categoriaId').classList.add('is-invalid');
            hasError = true;
        }

        // Prices and stock: just check they are filled (HTML5 handles type=number)
        const precioCompra = this.element.querySelector('#precioCompra').value;
        const precioVenta = this.element.querySelector('#precioVenta').value;
        const stock = this.element.querySelector('#stock').value;

        if (!precioCompra) {
            this.element.querySelector('#precioCompra').classList.add('is-invalid');
            hasError = true;
        }
        if (!precioVenta) {
            this.element.querySelector('#precioVenta').classList.add('is-invalid');
            hasError = true;
        }
        if (!stock) {
            this.element.querySelector('#stock').classList.add('is-invalid');
            hasError = true;
        }

        if (hasError) {
            Swal.fire('Campos incompletos', 'Por favor complete los campos obligatorios', 'warning');
            return;
        }

        const id = this.element.querySelector('#materialId').value;
        const data = {
            codigo: this.element.querySelector('#codigo').value || null,
            nombre: nombre,
            categoriaId: parseInt(catId),
            subcategoriaId: this.element.querySelector('#subcategoriaId').value ? parseInt(this.element.querySelector('#subcategoriaId').value) : null,
            precioCompra: parseFloat(precioCompra),
            precioVenta: parseFloat(precioVenta),
            stock: parseFloat(stock),
            descripcion: this.element.querySelector('#descripcion').value || null
        };

        try {
            if (id) {
                await ApiClient.materiales.update(id, data);
            } else {
                await ApiClient.materiales.create(data);
            }
            bootstrap.Modal.getInstance(document.getElementById('modalMaterial')).hide();
            Swal.fire({ icon: 'success', title: 'Éxito', text: id ? 'Material actualizado' : 'Material registrado', timer: 2000, showConfirmButton: false });
            this.loadData();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', err.message || 'No se pudo guardar el material', 'error');
        }
    }

    // ==========================================
    //  CATEGORIES MODAL
    // ==========================================
    async openModalCategorias() {
        this.selectedCatId = null;
        this.element.querySelector('#subcatPanel').style.display = 'none';
        this.element.querySelector('#subcatEmpty').style.display = 'block';
        this.element.querySelector('#selectedCatTitle').textContent = 'Subcategorías';
        const modal = new bootstrap.Modal(document.getElementById('modalCategorias'));
        modal.show();
        await this.loadCategoriesList();
        setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
    }

    async loadCategoriesList() {
        const list = this.element.querySelector('#listCategorias');
        list.innerHTML = '<div class="text-center p-2" style="color:var(--text-muted);font-size:12px;"><div class="spinner-border spinner-border-sm"></div> Cargando...</div>';

        try {
            const cats = await ApiClient.categorias.getAll();
            this.categorias = cats;

            if (cats.length === 0) {
                list.innerHTML = '<div class="text-center p-3" style="color:var(--text-muted);font-size:12px;">No hay categorías creadas</div>';
                return;
            }

            list.innerHTML = cats.map(c => `
                <div class="d-flex align-items-center cat-item ${this.selectedCatId === c.id ? 'active' : ''}"
                   data-cat-id="${c.id}" style="font-size:12px; padding: 6px 10px; border-radius: 6px; margin-bottom: 2px; border: 1px solid var(--border-light); cursor:pointer; transition: all 0.15s ease;">
                    <span style="flex:1; display:flex; align-items:center; gap:6px;">
                        <i data-lucide="folder" style="width:13px;height:13px;flex-shrink:0;"></i>
                        ${c.nombre}
                    </span>
                    <span style="display:flex; align-items:center; gap:4px;">
                        <button class="action-btn action-btn-edit btn-edit-cat" data-cat-id="${c.id}" title="Editar" style="width:26px;height:26px;">
                            <i data-lucide="edit-2"></i>
                        </button>
                    </span>
                </div>
            `).join('');

            // Attach click events — select category
            list.querySelectorAll('.cat-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    // Don't select if clicking the edit button
                    if (e.target.closest('.btn-edit-cat')) return;
                    e.preventDefault();
                    const catId = parseInt(item.dataset.catId);
                    this.selectCategory(catId);
                });
            });

            // Attach edit events
            list.querySelectorAll('.btn-edit-cat').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const catId = parseInt(btn.dataset.catId);
                    this.editCategory(catId);
                });
            });

            setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
        } catch (err) {
            console.error(err);
            list.innerHTML = '<p class="text-danger p-2" style="font-size:11px;">Error cargando categorías</p>';
        }
    }

    async addCategory() {
        const nameInput = this.element.querySelector('#newCatName');
        const name = nameInput.value.trim();

        if (!name) {
            nameInput.classList.add('is-invalid');
            return;
        }

        nameInput.classList.remove('is-invalid');

        try {
            await ApiClient.categorias.create({ nombre: name, activo: true });
            nameInput.value = '';
            Swal.fire({ icon: 'success', title: 'Categoría creada', timer: 1500, showConfirmButton: false });
            this.loadCategoriesList();
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear la categoría', 'error');
        }
    }

    async editCategory(catId) {
        const cat = this.categorias.find(c => c.id === catId);
        if (!cat) return;

        const { value: newName } = await Swal.fire({
            title: 'Editar categoría',
            input: 'text',
            inputValue: cat.nombre,
            inputPlaceholder: 'Nombre de la categoría',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#2d5a47',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'El nombre no puede estar vacío';
            }
        });

        if (newName) {
            try {
                await ApiClient.categorias.update(catId, { ...cat, nombre: newName.trim() });
                Swal.fire({ icon: 'success', title: 'Categoría actualizada', timer: 1500, showConfirmButton: false });
                this.loadCategoriesList();
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'No se pudo actualizar la categoría', 'error');
            }
        }
    }

    async selectCategory(id) {
        this.selectedCatId = id;

        // Update active state visually
        this.element.querySelectorAll('.cat-item').forEach(item => {
            const isActive = parseInt(item.dataset.catId) === id;
            item.classList.toggle('active', isActive);
            item.style.background = isActive ? 'var(--primary-light)' : '';
            item.style.borderColor = isActive ? 'var(--primary)' : '';
        });

        const cat = this.categorias.find(c => c.id === id);
        this.element.querySelector('#selectedCatTitle').textContent = `Subcategorías: ${cat.nombre}`;
        this.element.querySelector('#subcatEmpty').style.display = 'none';
        this.element.querySelector('#subcatPanel').style.display = 'block';

        await this.loadSubcategoriesList(id);
    }

    async loadSubcategoriesList(catId) {
        const tbody = this.element.querySelector('#tbodySubcats');
        tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="font-size:11px;color:var(--text-muted);">Cargando...</td></tr>';

        try {
            const subs = await ApiClient.subcategorias.getByCategoria(catId);
            if (subs.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center" style="font-size:11px;color:var(--text-muted);padding:16px;">Sin subcategorías</td></tr>';
            } else {
                tbody.innerHTML = subs.map(s => `
                    <tr>
                        <td style="font-size:11px;vertical-align:middle;">${s.nombre}</td>
                        <td style="vertical-align:middle;">
                            <div style="display:flex; gap:4px;">
                                <button class="action-btn action-btn-edit btn-edit-subcat" data-subcat-id="${s.id}" title="Editar" style="width:26px;height:26px;">
                                    <i data-lucide="edit-2"></i>
                                </button>
                                <button class="action-btn action-btn-danger btn-del-subcat" data-subcat-id="${s.id}" title="Eliminar" style="width:26px;height:26px;">
                                    <i data-lucide="trash-2"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');

                // Attach edit events
                tbody.querySelectorAll('.btn-edit-subcat').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const subcatId = parseInt(btn.dataset.subcatId);
                        const sub = subs.find(s => s.id === subcatId);
                        this.editSubcategory(subcatId, sub);
                    });
                });

                // Attach delete events
                tbody.querySelectorAll('.btn-del-subcat').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const subcatId = parseInt(btn.dataset.subcatId);
                        this.deleteSubcategory(subcatId);
                    });
                });

                setTimeout(() => { if (window.lucide) window.lucide.createIcons(); }, 100);
            }
        } catch (err) {
            console.error(err);
            tbody.innerHTML = '<tr><td colspan="3" class="text-danger" style="font-size:11px;">Error cargando</td></tr>';
        }
    }

    async addSubcategory() {
        if (!this.selectedCatId) return;

        const nameInput = this.element.querySelector('#newSubcatName');
        const name = nameInput.value.trim();

        if (!name) {
            nameInput.classList.add('is-invalid');
            return;
        }

        nameInput.classList.remove('is-invalid');

        try {
            await ApiClient.subcategorias.create({
                nombre: name,
                categoria: { id: this.selectedCatId },
                activo: true
            });
            nameInput.value = '';
            Swal.fire({ icon: 'success', title: 'Subcategoría creada', timer: 1500, showConfirmButton: false });
            this.loadSubcategoriesList(this.selectedCatId);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudo crear la subcategoría', 'error');
        }
    }

    async editSubcategory(subcatId, sub) {
        if (!sub) return;

        const { value: newName } = await Swal.fire({
            title: 'Editar subcategoría',
            input: 'text',
            inputValue: sub.nombre,
            inputPlaceholder: 'Nombre de la subcategoría',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar',
            confirmButtonColor: '#2d5a47',
            inputValidator: (value) => {
                if (!value || !value.trim()) return 'El nombre no puede estar vacío';
            }
        });

        if (newName) {
            try {
                await ApiClient.subcategorias.update(subcatId, {
                    ...sub,
                    nombre: newName.trim(),
                    categoria: { id: this.selectedCatId }
                });
                Swal.fire({ icon: 'success', title: 'Subcategoría actualizada', timer: 1500, showConfirmButton: false });
                this.loadSubcategoriesList(this.selectedCatId);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'No se pudo actualizar la subcategoría', 'error');
            }
        }
    }

    async deleteSubcategory(id) {
        const result = await Swal.fire({
            title: '¿Eliminar subcategoría?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, eliminar'
        });

        if (result.isConfirmed) {
            try {
                await ApiClient.subcategorias.delete(id);
                Swal.fire({ icon: 'success', title: 'Eliminada', timer: 1500, showConfirmButton: false });
                this.loadSubcategoriesList(this.selectedCatId);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'No se pudo eliminar la subcategoría', 'error');
            }
        }
    }

    destroy() {
        if (this.dataTable) { this.dataTable.destroy(); this.dataTable = null; }
        super.destroy();
    }
}
