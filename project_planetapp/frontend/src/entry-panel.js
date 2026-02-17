/**
 * Entry point: Panel principal (dashboard)
 * Verifica auth (API o legacy planetapp_user), muestra usuario y datos del dashboard.
 * La lógica de gráficas y DataTable se mantiene en la página; aquí solo composición hexagonal.
 */

import { AuthApiAdapter } from './adapters/api/AuthApiAdapter.js';
import { DashboardApiAdapter } from './adapters/api/DashboardApiAdapter.js';
import { GetCurrentUser } from './application/GetCurrentUser.js';
import { GetDashboardData } from './application/GetDashboardData.js';
import { LogoutUser } from './application/LogoutUser.js';
import { renderWelcomeUser, renderDashboardStats } from './adapters/ui/DashboardView.js';

const authPort = new AuthApiAdapter();
const dashboardPort = new DashboardApiAdapter();

const hasApiAuth = Boolean(localStorage.getItem('user-id'));
const hasLegacyAuth = Boolean(localStorage.getItem('planetapp_user'));
if (!hasApiAuth && !hasLegacyAuth) {
  window.location.href = '../login.html';
} else {
  const user = GetCurrentUser(authPort);
  const displayName = user?.nombre || localStorage.getItem('user-name') || localStorage.getItem('planetapp_user') || 'Usuario';
  renderWelcomeUser(displayName);

  GetDashboardData(dashboardPort).then(({ stats }) => {
    renderDashboardStats(stats);
  });

  const panelUser = document.getElementById('panelHeaderUser');
  if (panelUser) panelUser.textContent = displayName;
  const panelDate = document.getElementById('panelHeaderDate');
  if (panelDate) {
    panelDate.textContent = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  document.querySelector('app-sidebar')?.addEventListener('sidebar-logout', () => LogoutUser(authPort));
}
