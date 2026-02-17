import { Component } from '../core/Component.js';
import { ApiClient } from '../services/ApiClient.js';

export class Inventario extends Component {
    constructor() {
        super('inventario');
        this.stockTable = null;
        this.movTable = null;
        this.activeTab = 'stock';
    }

    template() {
        return `
            <style>
                .inv-tabs { display: flex; gap: 0; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
                .inv-tab { padding: 10px 24px; font-size: 13px; font-weight: 600; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all 0.2s; background: none; border-top: none; border-left: none; border-right: none; }
                .inv-tab:hover { color: #2d5a47; }
                .inv-tab.active { color: #2d5a47; border-bottom-color: #2d5a47; }
                .inv-panel { display: none; }
                .inv-panel.active { display: block; }
                .mov-compra { background: #e8f5e9; color: #2e7d32; padding: 3px 8px; border-radius: 10px; font-weight: 600; font-size: 11px; }
                .mov-venta { background: #ffebee; color: #c62828; padding: 3px 8px; border-radius: 10px; font-weight: 600; font-size: 11px; }
                .mov-ajuste { background: #fff3e0; color: #e65100; padding: 3px 8px; border-radius: 10px; font-weight: 600; font-size: 11px; }
                .cant-pos { color: #2e7d32; font-weight: 600; }
                .cant-neg { color: #c62828; font-weight: 600; }
                .stock-badge { padding: 4px 10px; border-radius: 12px; font-weight: 600; font-size: 10px; display: inline-block; }
                .st-alto { background: #e8f5e9; color: #2d5a47; }
                .st-medio { background: #fff3e0; color: #f57c00; }
                .st-bajo { background: #ffebee; color: #d32f2f; }
            </style>

            <div class="module-card">
                <div class="card-header-row">
                    <i data-lucide="package"></i>
                    <h5>Inventario de Materiales</h5>
                </div>

                <div class="inv-tabs">
                    <button class="inv-tab active" data-tab="stock">
                        <i data-lucide="box" style="width:14px;height:14px;margin-right:4px;"></i>
                        Stock Actual
                    </button>
                    <button class="inv-tab" data-tab="movimientos">
                        <i data-lucide="history" style="width:14px;height:14px;margin-right:4px;"></i>
                        Historial de Movimientos
                    </button>
                </div>

                <div id="panelStock" class="inv-panel active">
                    <table id="stockTable" class="table table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Material</th>
                                <th>Categoría</th>
                                <th>Stock Actual (Kg)</th>
                                <th>Precio Compra</th>
                                <th>Precio Venta</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

                <div id="panelMovimientos" class="inv-panel">
                    <table id="movimientosTable" class="table table-hover" style="width:100%">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Material</th>
                                <th>Subcategoría</th>
                                <th>Stock Anterior</th>
                                <th>Movimiento</th>
                                <th>Tipo</th>
                                <th>Precio</th>
                                <th>Stock Actual</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        `;
    }

    async afterMount() {
        this.bindTabs();
        await this.loadStock();
        await this.loadMovimientos();
        if (window.lucide) lucide.createIcons();
    }

    bindTabs() {
        const tabs = this.element.querySelectorAll('.inv-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.activeTab = tab.dataset.tab;
                this.element.querySelectorAll('.inv-panel').forEach(p => p.classList.remove('active'));
                if (this.activeTab === 'stock') {
                    this.element.querySelector('#panelStock').classList.add('active');
                } else {
                    this.element.querySelector('#panelMovimientos').classList.add('active');
                }
            });
        });
    }

    async loadStock() {
        try {
            const data = await ApiClient.inventario.stock();
            const tbody = this.element.querySelector('#stockTable tbody');
            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94a3b8;padding:20px;">No hay materiales</td></tr>';
                return;
            }
            tbody.innerHTML = data.map(m => {
                let badge = '<span class="stock-badge st-alto">Disponible</span>';
                if (m.stock <= 0) badge = '<span class="stock-badge st-bajo">Sin Stock</span>';
                else if (m.stock < 10) badge = '<span class="stock-badge st-bajo">Stock Bajo</span>';
                else if (m.stock < 50) badge = '<span class="stock-badge st-medio">Stock Medio</span>';
                return `<tr>
                    <td><code>${m.codigo || '—'}</code></td>
                    <td><strong>${m.nombre}</strong></td>
                    <td>${m.categoria || '—'}</td>
                    <td>${Number(m.stock).toLocaleString('es-CO')} kg</td>
                    <td>$${Number(m.precioCompra).toLocaleString('es-CO')}</td>
                    <td>$${Number(m.precioVenta).toLocaleString('es-CO')}</td>
                    <td>${badge}</td>
                </tr>`;
            }).join('');

            if (this.stockTable) { this.stockTable.destroy(); this.stockTable = null; }
            if (window.$ && window.$.fn.DataTable) {
                this.stockTable = $('#stockTable').DataTable({
                    language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
                    paging: false, dom: 'rt', ordering: true, info: false
                });
            }
        } catch (err) {
            console.error('[Inventario] Error cargando stock:', err);
        }
    }

    async loadMovimientos() {
        try {
            const data = await ApiClient.inventario.movimientos();
            const tbody = this.element.querySelector('#movimientosTable tbody');
            if (!data || data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94a3b8;padding:20px;">No hay movimientos registrados</td></tr>';
                return;
            }
            tbody.innerHTML = data.map(m => {
                const fecha = m.fecha ? new Date(m.fecha).toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : '';
                let tipoBadge = '';
                if (m.tipo === 'COMPRA') tipoBadge = '<span class="mov-compra">Compra</span>';
                else if (m.tipo === 'VENTA') tipoBadge = '<span class="mov-venta">Venta</span>';
                else tipoBadge = '<span class="mov-ajuste">Ajuste</span>';

                const cantNum = Number(m.cantidad);
                const cantClass = cantNum >= 0 ? 'cant-pos' : 'cant-neg';
                const cantText = cantNum >= 0 ? `+${cantNum.toLocaleString('es-CO')} kg` : `${cantNum.toLocaleString('es-CO')} kg`;
                const stockAnt = m.stockAnterior != null ? `${Number(m.stockAnterior).toLocaleString('es-CO')} kg` : '—';
                const stockAct = m.stockActual != null ? `${Number(m.stockActual).toLocaleString('es-CO')} kg` : '—';
                const precio = m.precioUnitario != null ? `$${Number(m.precioUnitario).toLocaleString('es-CO')}` : '—';

                return `<tr>
                    <td><code>${m.codigo || '—'}</code></td>
                    <td><strong>${m.material}</strong></td>
                    <td>${m.subcategoria || '—'}</td>
                    <td>${stockAnt}</td>
                    <td><span class="${cantClass}">${cantText}</span></td>
                    <td>${tipoBadge}</td>
                    <td>${precio}</td>
                    <td>${stockAct}</td>
                    <td>${fecha}</td>
                </tr>`;
            }).join('');

            if (this.movTable) { this.movTable.destroy(); this.movTable = null; }
            if (window.$ && window.$.fn.DataTable) {
                this.movTable = $('#movimientosTable').DataTable({
                    language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
                    paging: false, dom: 'rt', order: [[8, 'desc']], info: false
                });
            }
        } catch (err) {
            console.error('[Inventario] Error cargando movimientos:', err);
        }
    }

    destroy() {
        if (this.stockTable) { this.stockTable.destroy(); this.stockTable = null; }
        if (this.movTable) { this.movTable.destroy(); this.movTable = null; }
        super.destroy();
    }
}
