import { Component } from '../core/Component.js';
import { Pagination } from '../components/Pagination.js';
import { ApiClient } from '../services/ApiClient.js';
import { AuthService } from '../services/AuthService.js';

export class Dashboard extends Component {
    constructor() {
        super('dashboard');
        this.pieChart = null;
        this.barChart = null;
    }

    template() {
        const username = AuthService.getUser() || 'Usuario';
        return `
            <!-- Welcome Banner Premium -->
            <div class="welcome-banner">
                <h3>Buen día, <span id="welcomeUserName">${username}</span> 👋</h3>
                <p>¿Qué haremos hoy para cuidar la Tierra?</p>
            </div>

            <!-- Statistics Cards Premium -->
            <div class="row g-2 mb-3">
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card green">
                        <div class="stat-icon"><i data-lucide="users"></i></div>
                        <h3 id="totalAsociados">—</h3>
                        <p>Asociados</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card blue">
                        <div class="stat-icon"><i data-lucide="trending-up"></i></div>
                        <h3 id="totalVentas">—</h3>
                        <p>Ventas</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card orange">
                        <div class="stat-icon"><i data-lucide="shopping-cart"></i></div>
                        <h3 id="totalCompras">—</h3>
                        <p>Compras</p>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6">
                    <div class="stat-card red">
                        <div class="stat-icon"><i data-lucide="alert-triangle"></i></div>
                        <h3 id="stockBajo">—</h3>
                        <p>Stock Bajo</p>
                    </div>
                </div>
            </div>

            <!-- Charts Row -->
            <div class="row g-2 mb-3">
                <div class="col-lg-6">
                    <div class="chart-card">
                        <h5><i data-lucide="pie-chart"></i> Productos Más Vendidos</h5>
                        <div id="pieChartEmpty" style="display:none;text-align:center;padding:30px;color:#94a3b8;">
                            <i data-lucide="info" style="width:32px;height:32px;margin-bottom:8px;"></i>
                            <p>Sin datos de ventas aún</p>
                        </div>
                        <canvas id="pieChart"></canvas>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="chart-card">
                        <h5><i data-lucide="bar-chart-2"></i> Productos Más Comprados</h5>
                        <div id="barChartEmpty" style="display:none;text-align:center;padding:30px;color:#94a3b8;">
                            <i data-lucide="info" style="width:32px;height:32px;margin-bottom:8px;"></i>
                            <p>Sin datos de compras aún</p>
                        </div>
                        <canvas id="barChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- Recent Transactions Table -->
            <div class="row">
                <div class="col-12">
                    <h5 class="section-title">
                        <i data-lucide="receipt"></i>
                        Transacciones Recientes
                    </h5>
                    <div class="table-container">
                        <table id="transactionsTable" class="table table-hover" style="width:100%; margin: 0;">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Material</th>
                                    <th>Cantidad (KG)</th>
                                    <th>Total ($)</th>
                                    <th>Persona</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody id="transactionsBody"></tbody>
                        </table>
                        <!-- Custom Pagination Container -->
                        <div id="dashboardPagination"></div>
                    </div>
                </div>
            </div>
        `;
    }

    async afterMount() {
        await this.loadDashboardData();
    }

    async loadDashboardData() {
        try {
            const [stats, topVendidos, topComprados, transacciones] = await Promise.all([
                ApiClient.reportes.dashboardStats(),
                ApiClient.reportes.topVendidos(),
                ApiClient.reportes.topComprados(),
                ApiClient.reportes.transaccionesRecientes()
            ]);

            document.getElementById('totalAsociados').textContent = stats.totalAsociados || 0;
            document.getElementById('totalVentas').textContent = stats.totalVentas || 0;
            document.getElementById('totalCompras').textContent = stats.totalCompras || 0;
            document.getElementById('stockBajo').textContent = stats.stockBajo || 0;

            this.renderPieChart(topVendidos);
            this.renderBarChart(topComprados);
            this.renderTransactions(transacciones);
        } catch (err) {
            console.error('[Dashboard] Error loading data:', err);
        }
    }

    renderPieChart(data) {
        if (!window.Chart) return;
        const canvas = document.getElementById('pieChart');
        const emptyMsg = document.getElementById('pieChartEmpty');
        if (!canvas) return;

        if (!data || data.length === 0) {
            canvas.style.display = 'none';
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        const colors = [
            '#2d5a47', // Verde Renacer
            '#8b5cf6', // Morado
            '#f59e0b', // Naranja/Amarillo
            '#ef4444', // Rojo
            '#06b6d4', // Cyan
            '#3b82f6', // Azul
            '#ec4899'  // Rosa
        ];
        const ctx = canvas.getContext('2d');
        this.pieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.nombre),
                datasets: [{
                    data: data.map(d => d.cantidad),
                    backgroundColor: colors.slice(0, data.length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } }
            }
        });
    }

    renderBarChart(data) {
        if (!window.Chart) return;
        const canvas = document.getElementById('barChart');
        const emptyMsg = document.getElementById('barChartEmpty');
        if (!canvas) return;

        if (!data || data.length === 0) {
            canvas.style.display = 'none';
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        const ctx = canvas.getContext('2d');
        this.barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.nombre),
                datasets: [{
                    label: 'Cantidad (KG)',
                    data: data.map(d => d.cantidad),
                    backgroundColor: '#3b82f6',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true },
                    x: {
                        grid: { display: false }
                    }
                },
                maxBarThickness: 100, // Even thicker for better visual weight
                barPercentage: 0.9,   // Use 90% of the available space
                categoryPercentage: 0.9
            }
        });
    }

    renderTransactions(data) {
        const tbody = document.getElementById('transactionsBody');
        if (!tbody) return;

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:20px;">No hay transacciones registradas</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(tx => {
            const fecha = tx.fecha ? new Date(tx.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
            const estadoClass = tx.estado === 'COMPLETADA' ? 'badge bg-success' : 'badge bg-danger';
            const tipoClass = tx.tipo === 'Compra' ? 'badge bg-warning text-dark' : 'badge bg-info';
            return `<tr>
                <td>${tx.id}</td>
                <td><span class="${tipoClass}">${tx.tipo}</span></td>
                <td>${tx.material}</td>
                <td>${tx.cantidad} KG</td>
                <td>$${(tx.total || 0).toLocaleString('es-CO')}</td>
                <td>${tx.persona || ''}</td>
                <td>${fecha}</td>
                <td><span class="${estadoClass}">${tx.estado}</span></td>
            </tr>`;
        }).join('');

        if (window.$ && window.$.fn.DataTable) {
            const table = $('#transactionsTable').DataTable({
                language: { url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json' },
                paging: false,
                dom: 'rt', // Custom pagination
                pageLength: 5,
                ordering: false
            });

            // Initialize Custom Pagination
            new Pagination(table, 'dashboardPagination');
        }
    }

    destroy() {
        if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
        if (this.barChart) { this.barChart.destroy(); this.barChart = null; }
        super.destroy();
    }
}
