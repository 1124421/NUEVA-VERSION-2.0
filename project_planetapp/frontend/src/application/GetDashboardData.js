/**
 * Caso de uso: Obtener datos del dashboard (estadísticas y gráficas)
 */

import { DashboardStats } from '../core/domain/Dashboard.js';

/**
 * @param {import('../core/ports/DashboardPort.js').DashboardPort} dashboardPort
 * @returns {Promise<{ stats: DashboardStats, chartData: Object }>}
 */
export async function GetDashboardData(dashboardPort) {
  const [stats, chartData] = await Promise.all([
    dashboardPort.getStats(),
    dashboardPort.getChartData(),
  ]);
  return { stats, chartData };
}
