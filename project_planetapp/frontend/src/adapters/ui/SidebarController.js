/**
 * Adaptador UI: Controlador del Sidebar
 * Maneja navegación y enlace de logout (eventos DOM).
 * El sidebar puede ser el componente <app-sidebar> o el HTML del panel-inicio.
 */

import { LogoutUser } from '../../application/LogoutUser.js';

/**
 * Configura el enlace/botón de logout para usar el caso de uso.
 * @param {HTMLElement} logoutElement - Enlace o botón "Salir" / "Cerrar sesión"
 * @param {import('../../core/ports/AuthPort.js').AuthPort} authPort
 */
export function initSidebarLogout(logoutElement, authPort) {
  if (!logoutElement) return;
  logoutElement.addEventListener('click', (e) => {
    e.preventDefault();
    LogoutUser(authPort);
  });
}
