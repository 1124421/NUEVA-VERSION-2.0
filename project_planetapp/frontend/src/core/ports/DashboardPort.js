/**
 * Puerto (interfaz): Dashboard
 * Define qué datos necesita la aplicación del panel.
 */

import { DashboardStats } from '../domain/Dashboard.js';

/**
 * @interface
 */
export class DashboardPort {
  /**
   * Obtiene estadísticas para las tarjetas del panel.
   * @returns {Promise<DashboardStats>}
   */
  async getStats() {
    throw new Error('DashboardPort.getStats() must be implemented');
  }

  /**
   * Datos para gráficas (opcional).
   * @returns {Promise<{ pie?: { labels: string[], values: number[] }, bar?: { labels: string[], values: number[] }, lowStock?: { labels: string[], values: number[] } }>}
   */
  async getChartData() {
    throw new Error('DashboardPort.getChartData() must be implemented');
  }
}
