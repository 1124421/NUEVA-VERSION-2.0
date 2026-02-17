/**
 * Value objects / datos de negocio del Dashboard.
 * Sin dependencias del navegador.
 */

/**
 * Estadísticas resumidas del panel
 */
export class DashboardStats {
  /**
   * @param {Object} data
   */
  constructor({
    totalAsociados = 0,
    totalVentas = 0,
    totalCompras = 0,
    stockBajo = 0,
  } = {}) {
    this.totalAsociados = Number(totalAsociados) || 0;
    this.totalVentas = Number(totalVentas) || 0;
    this.totalCompras = Number(totalCompras) || 0;
    this.stockBajo = Number(stockBajo) || 0;
  }
}

/**
 * Datos para gráfica (etiquetas + valores)
 */
export class ChartData {
  /**
   * @param {string[]} labels
   * @param {number[]} values
   */
  constructor(labels = [], values = []) {
    this.labels = Array.isArray(labels) ? labels : [];
    this.values = Array.isArray(values) ? values : [];
  }
}
