/**
 * Adaptador UI: Vista del Dashboard (panel)
 * Renderiza estadísticas y gráficas; no contiene lógica de negocio.
 */

/**
 * Actualiza los elementos del DOM con las estadísticas.
 * @param {Object} stats - { totalAsociados, totalVentas, totalCompras, stockBajo }
 * @param {Document} [doc=document]
 */
export function renderDashboardStats(stats, doc = document) {
  const setText = (id, value) => {
    const el = doc.getElementById(id);
    if (el) el.textContent = value;
  };
  setText('totalAsociados', stats?.totalAsociados ?? 0);
  setText('totalVentas', stats?.totalVentas ?? 0);
  setText('totalCompras', stats?.totalCompras ?? 0);
  setText('stockBajo', stats?.stockBajo ?? 0);
}

/**
 * Actualiza el nombre de bienvenida en el panel.
 * @param {string} userName
 * @param {Document} [doc=document]
 */
export function renderWelcomeUser(userName, doc = document) {
  const el = doc.getElementById('welcomeUserName');
  if (el) el.textContent = userName || 'Usuario';
}
