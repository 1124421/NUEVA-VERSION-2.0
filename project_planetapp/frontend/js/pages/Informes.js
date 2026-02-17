import { Component } from '../core/Component.js';
import { ApiClient } from '../services/ApiClient.js';
import { LibraryInit } from '../services/LibraryInit.js';

export class Informes extends Component {
    constructor() {
        super('informes');
        this.allData = [];
        this.dataTable = null;
    }

    template() {
        return `
            <!-- Filters Section -->
            <div class="card mb-3" style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <div class="row g-2 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label" style="font-size: 12px; font-weight: 600; color: #475569;">Tipo de registro</label>
                        <select class="form-select" id="tipoRegistro" style="height: 38px; border-radius: 8px; font-size: 13px;">
                            <option value="todos">Todos los registros</option>
                            <option value="compras">Registro de compra</option>
                            <option value="ventas">Registro de venta</option>
                            <option value="hoy">Registro diario</option>
                            <option value="semana">Registro semanal</option>
                            <option value="mes">Registro mensual</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <label class="form-label" style="font-size: 12px; font-weight: 600; color: #475569;">Fecha desde</label>
                        <input type="text" class="form-control" id="fechaDesde" placeholder="Desde" style="height: 38px; border-radius: 8px; font-size: 13px;">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label" style="font-size: 12px; font-weight: 600; color: #475569;">Fecha hasta</label>
                        <input type="text" class="form-control" id="fechaHasta" placeholder="Hasta" style="height: 38px; border-radius: 8px; font-size: 13px;">
                    </div>
                    <div class="col-md-2">
                        <label class="form-label" style="font-size: 12px; font-weight: 600; color: #475569;">Estado</label>
                        <select class="form-select" id="filtroEstado" style="height: 38px; border-radius: 8px; font-size: 13px;">
                            <option value="todos">Todos</option>
                            <option value="COMPLETADA">Completada</option>
                            <option value="CANCELADA">Cancelada</option>
                        </select>
                    </div>
                    <div class="col-md-3 d-flex gap-1 align-items-end">
                        <button class="btn btn-outline-secondary d-flex align-items-center justify-content-center" id="btn-clear" style="height: 38px; border-radius: 8px; font-size: 13px; flex: 1;">
                             Limpiar
                        </button>
                        <button class="btn d-flex align-items-center justify-content-center" id="btn-apply" style="height: 38px; border-radius: 8px; font-size: 13px; flex: 1; background-color: #2d5a47; color: white; border: none;">
                             Aplicar
                        </button>
                        <button class="btn d-flex align-items-center justify-content-center" id="btn-export" style="height: 38px; border-radius: 8px; font-size: 13px; flex: 1; background-color: #3b82f6; color: white; border: none;">
                            <i data-lucide="download" style="width: 14px; height: 14px; margin-right: 4px;"></i> Exportar
                        </button>
                    </div>
                </div>
            </div>

            <!-- Data Table -->
            <div class="table-container">
                <table id="informesTable" class="table table-sm" style="width: 100%; margin: 0;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Material</th>
                            <th>Persona</th>
                            <th>Documento</th>
                            <th>Cantidad (KG)</th>
                            <th>Precio Unit.</th>
                            <th>Total ($)</th>
                            <th>Carreta</th>
                            <th>Ruta</th>
                            <th>Rechazado</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody id="informesBody"></tbody>
                </table>
            </div>
        `;
    }

    async afterMount() {
        this.bindEvents();
        try { this.initLibraries(); } catch (e) { console.warn('[Informes] initLibraries failed:', e.message); }
        await this.loadData();
        if (window.lucide) window.lucide.createIcons();
    }

    initLibraries() {
        // Air Datepicker on date inputs
        LibraryInit.initDatePickers(['#fechaDesde', '#fechaHasta']);
        // Tom Select on select filters
        LibraryInit.initSelects(['#tipoRegistro', '#filtroEstado']);
    }

    bindEvents() {
        this.element.querySelector('#btn-clear')?.addEventListener('click', () => this.clearFilters());
        this.element.querySelector('#btn-apply')?.addEventListener('click', () => this.applyFilters());
        this.element.querySelector('#btn-export')?.addEventListener('click', () => this.showExportDialog());

        // Automatic filtering
        this.element.querySelector('#tipoRegistro')?.addEventListener('change', (e) => {
            const val = e.target.value;
            if (['hoy', 'semana', 'mes'].includes(val)) {
                this.setPeriod(val);
            } else {
                this.applyFilters();
            }
        });
        this.element.querySelector('#filtroEstado')?.addEventListener('change', () => this.applyFilters());
        this.element.querySelector('#fechaDesde')?.addEventListener('change', () => this.applyFilters());
        this.element.querySelector('#fechaHasta')?.addEventListener('change', () => this.applyFilters());
    }

    setPeriod(period) {
        const hoy = new Date();
        let desde = new Date();

        if (period === 'hoy') {
            desde = hoy;
        } else if (period === 'semana') {
            desde.setDate(hoy.getDate() - 7);
        } else if (period === 'mes') {
            desde.setMonth(hoy.getMonth() - 1);
        }

        const format = (d) => d.toISOString().split('T')[0];

        // Update input values (Air Datepicker instances will see these)
        const desdeEl = this.element.querySelector('#fechaDesde');
        const hastaEl = this.element.querySelector('#fechaHasta');

        if (desdeEl) desdeEl.value = format(desde);
        if (hastaEl) hastaEl.value = format(hoy);

        this.applyFilters();
    }

    async loadData() {
        try {
            console.log('[Informes] Loading data from API...');
            const txs = await ApiClient.reportes.informes();
            this.allData = txs || [];
            console.log('[Informes] Received', this.allData.length, 'records');
            this.renderTable(this.allData);
        } catch (err) {
            console.error('[Informes] Error loading data:', err);
            const tbody = this.element.querySelector('#informesBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;color:#ef4444;padding:20px;">Error al cargar datos. Verifique la conexión con el servidor.</td></tr>';
            }
        }
    }

    renderTable(data) {
        const tbody = this.element.querySelector('#informesBody');
        if (!tbody) {
            console.error('[Informes] Cannot find #informesBody element');
            return;
        }

        if (this.dataTable) {
            this.dataTable.destroy();
            this.dataTable = null;
        }

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="13" style="text-align:center;color:#94a3b8;padding:20px;">No hay registros</td></tr>';
            return;
        }

        console.log('[Informes] Rendering', data.length, 'records');

        tbody.innerHTML = data.map(tx => {
            const fecha = tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            const estadoClass = tx.estado === 'COMPLETADA' ? 'badge bg-success' : 'badge bg-danger';
            const tipoClass = tx.tipo === 'Compra' ? 'badge bg-warning text-dark' : 'badge bg-info';
            const precioUnit = tx.precioUnitario != null ? Number(tx.precioUnitario).toFixed(0) : (tx.total && tx.cantidad ? (tx.total / tx.cantidad).toFixed(0) : 0);
            return `<tr>
                <td>${tx.id}</td>
                <td><span class="${tipoClass}">${tx.tipo}</span></td>
                <td>${tx.material}</td>
                <td>${tx.persona || 'N/A'}</td>
                <td>${tx.documento || '—'}</td>
                <td>${tx.cantidad}</td>
                <td>$${Number(precioUnit).toLocaleString('es-CO')}</td>
                <td>$${(tx.total || 0).toLocaleString('es-CO')}</td>
                <td>${tx.carreta || '—'}</td>
                <td>${tx.ruta || '—'}</td>
                <td>${tx.rechazado != null ? tx.rechazado + ' kg' : '—'}</td>
                <td>${fecha}</td>
                <td><span class="${estadoClass}">${tx.estado}</span></td>
            </tr>`;
        }).join('');

        this._initDataTable();
    }

    _initDataTable() {
        if (!window.$ || !window.$.fn || !window.$.fn.DataTable) {
            setTimeout(() => this._initDataTable(), 200);
            return;
        }
        this.dataTable = $('#informesTable').DataTable({
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
            pageLength: 10,
            ordering: true
        });
    }

    applyFilters() {
        const tipo = this.element.querySelector('#tipoRegistro')?.value || 'todos';
        const desde = this.element.querySelector('#fechaDesde')?.value;
        const hasta = this.element.querySelector('#fechaHasta')?.value;
        const estado = this.element.querySelector('#filtroEstado')?.value || 'todos';

        let filtered = [...this.allData];

        if (tipo === 'compras') {
            filtered = filtered.filter(d => d.tipo === 'Compra');
        } else if (tipo === 'ventas') {
            filtered = filtered.filter(d => d.tipo === 'Venta');
        }

        if (estado !== 'todos') {
            filtered = filtered.filter(d => d.estado === estado);
        }
        if (desde) {
            filtered = filtered.filter(d => d.fecha >= desde);
        }
        if (hasta) {
            filtered = filtered.filter(d => d.fecha <= hasta + 'T23:59:59');
        }

        this.renderTable(filtered);
    }

    clearFilters() {
        // Reset Tom Select selects
        const tipoEl = this.element.querySelector('#tipoRegistro');
        const estadoEl = this.element.querySelector('#filtroEstado');
        if (tipoEl && tipoEl.tomselect) tipoEl.tomselect.setValue('todos');
        else if (tipoEl) tipoEl.value = 'todos';
        if (estadoEl && estadoEl.tomselect) estadoEl.tomselect.setValue('todos');
        else if (estadoEl) estadoEl.value = 'todos';
        // Clear Air Datepicker date inputs
        const desdeEl = this.element.querySelector('#fechaDesde');
        const hastaEl = this.element.querySelector('#fechaHasta');
        if (desdeEl) desdeEl.value = '';
        if (hastaEl) hastaEl.value = '';
        this.renderTable(this.allData);
    }

    showExportDialog() {
        if (!this.allData || this.allData.length === 0) {
            if (window.Swal) Swal.fire('Info', 'No hay datos para exportar', 'info');
            return;
        }

        Swal.fire({
            title: 'Exportar',
            html: `
                <div style="display: flex; justify-content: center; gap: 30px; padding: 20px 0;">
                    <div id="export-pdf-option" style="cursor:pointer; text-align:center; padding: 20px 25px; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                        <div style="width: 52px; height: 52px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; background: #fef2f2; border-radius: 10px;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                            </svg>
                        </div>
                        <span style="font-weight: 600; color: #1e293b; font-size: 14px;">PDF</span>
                    </div>
                    <div id="export-excel-option" style="cursor:pointer; text-align:center; padding: 20px 25px; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.2s ease;">
                        <div style="width: 52px; height: 52px; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; background: #f0fdf4; border-radius: 10px;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <rect x="8" y="12" width="8" height="6" rx="1"></rect>
                                <line x1="12" y1="12" x2="12" y2="18"></line>
                                <line x1="8" y1="15" x2="16" y2="15"></line>
                            </svg>
                        </div>
                        <span style="font-weight: 600; color: #1e293b; font-size: 14px;">Excel</span>
                    </div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            didOpen: () => {
                document.getElementById('export-pdf-option').addEventListener('click', () => {
                    Swal.close();
                    this.exportPDF();
                });
                document.getElementById('export-pdf-option').addEventListener('mouseenter', (e) => {
                    e.currentTarget.style.background = '#fef2f2';
                    e.currentTarget.style.borderColor = '#fca5a5';
                });
                document.getElementById('export-pdf-option').addEventListener('mouseleave', (e) => {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                });
                document.getElementById('export-excel-option').addEventListener('click', () => {
                    Swal.close();
                    this.exportExcel();
                });
                document.getElementById('export-excel-option').addEventListener('mouseenter', (e) => {
                    e.currentTarget.style.background = '#f0fdf4';
                    e.currentTarget.style.borderColor = '#86efac';
                });
                document.getElementById('export-excel-option').addEventListener('mouseleave', (e) => {
                    e.currentTarget.style.background = '';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                });
            }
        });
    }

    exportPDF() {
        const printWindow = window.open('', '_blank');
        const rows = this.allData.map(tx => {
            const fecha = tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO') : '';
            return `<tr>
                <td>${tx.id}</td><td>${tx.tipo}</td><td>${tx.material}</td>
                <td>${tx.persona || ''}</td><td>${tx.documento || ''}</td><td>${tx.cantidad} KG</td>
                <td>$${(tx.total || 0).toLocaleString('es-CO')}</td>
                <td>${tx.carreta || ''}</td><td>${tx.ruta || ''}</td>
                <td>${tx.rechazado != null ? tx.rechazado + ' kg' : ''}</td>
                <td>${fecha}</td><td>${tx.estado}</td>
            </tr>`;
        }).join('');

        printWindow.document.write(`<!DOCTYPE html><html><head>
            <title>Informe PlanetApp - ${new Date().toLocaleDateString('es-CO')}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { color: #2d5a47; font-size: 18px; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 15px; }
                th, td { border: 1px solid #ddd; padding: 4px 6px; text-align: left; }
                th { background: #2d5a47; color: white; }
                tr:nth-child(even) { background: #f9f9f9; }
                .meta { color: #666; font-size: 11px; margin-bottom: 10px; }
            </style>
        </head><body>
            <h1>📊 Informe de Transacciones — PlanetApp</h1>
            <p class="meta">Generado: ${new Date().toLocaleString('es-CO')} | Total registros: ${this.allData.length}</p>
            <table>
                <thead><tr><th>ID</th><th>Tipo</th><th>Material</th><th>Persona</th><th>Documento</th><th>Cantidad</th><th>Total</th><th>Carreta</th><th>Ruta</th><th>Rechazado</th><th>Fecha</th><th>Estado</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </body></html>`);
        printWindow.document.close();
        printWindow.print();
    }

    exportExcel() {
        const headers = ['ID', 'Tipo', 'Material', 'Persona', 'Documento', 'Cantidad KG', 'Precio Unit.', 'Total', 'Carreta', 'Ruta', 'Rechazado', 'Fecha', 'Estado'];
        const rows = this.allData.map(tx => [
            tx.id, tx.tipo, tx.material, tx.persona || '', tx.documento || '',
            tx.cantidad, tx.precioUnitario || '', tx.total || 0,
            tx.carreta || '', tx.ruta || '', tx.rechazado != null ? tx.rechazado : '',
            tx.fecha || '', tx.estado
        ]);

        const tsv = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');
        const blob = new Blob(['\ufeff' + tsv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `informe_${new Date().toISOString().slice(0, 10)}.xls`;
        link.click();
    }

    destroy() {
        if (this.dataTable) { this.dataTable.destroy(); this.dataTable = null; }
        LibraryInit.destroyAll();
        super.destroy();
    }
}
