/**
 * Adaptador: datos del Dashboard.
 * Implementa DashboardPort. Por ahora devuelve datos estáticos/mock
 * (igual que el panel actual); luego se puede conectar a una API real.
 */

import { DashboardStats } from '../../core/domain/Dashboard.js';

/**
 * @implements {import('../../core/ports/DashboardPort.js').DashboardPort}
 */
export class DashboardApiAdapter {
  async getStats() {
    return new DashboardStats({
      totalAsociados: 0,
      totalVentas: 0,
      totalCompras: 0,
      stockBajo: 0,
    });
  }

  async getChartData() {
    return {
      pie: { labels: [], values: [] },
      bar: { labels: [], values: [] },
      lowStock: { labels: [], values: [] },
    };
  }
}
