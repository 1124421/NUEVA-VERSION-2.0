/**
 * Entry point: Página de Asociados
 * Compone puertos, adaptadores y vista (Arquitectura Hexagonal).
 */

import { AuthApiAdapter } from './adapters/api/AuthApiAdapter.js';
import { AsociadosStorageAdapter } from './adapters/api/AsociadosStorageAdapter.js';
import { GetCurrentUser } from './application/GetCurrentUser.js';
import { LogoutUser } from './application/LogoutUser.js';
import { initAsociadosView } from './adapters/ui/AsociadosView.js';

const authPort = new AuthApiAdapter();
const asociadosPort = new AsociadosStorageAdapter();

const hasApiAuth = Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('user-id'));
const hasLegacyAuth = Boolean(typeof localStorage !== 'undefined' && localStorage.getItem('planetapp_user'));
if (!hasApiAuth && !hasLegacyAuth) {
  if (typeof window !== 'undefined') window.location.href = '../login.html';
} else {
  const user = GetCurrentUser(authPort);
  const userNameEl = document.getElementById('userName');
  const userRoleEl = document.getElementById('userRole');
  if (userNameEl) userNameEl.textContent = user?.nombre || localStorage.getItem('planetapp_user') || 'Usuario';
  if (userRoleEl) userRoleEl.textContent = user?.rol || 'Usuario';

  document.querySelector('app-sidebar')?.addEventListener('sidebar-logout', () => LogoutUser(authPort));

  initAsociadosView({
    asociadosPort,
    tbody: document.getElementById('asociadosTbody'),
    searchInput: document.getElementById('searchInput'),
    form: document.getElementById('asociadoForm'),
    modalForm: document.getElementById('modalForm'),
    modalVer: document.getElementById('modalVer'),
    btnNuevo: document.getElementById('btnNuevo'),
    btnCancelForm: document.getElementById('btnCancelForm'),
    btnCloseVer: document.getElementById('btnCloseVer'),
    confirmDelete: () => window.confirm('¿Eliminar este asociado?'),
  });
}
