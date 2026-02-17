/**
 * Adaptador UI: Vista de Login
 * Conecta el formulario con el caso de uso LoginUser.
 */

import { LoginUser } from '../../application/LoginUser.js';

/**
 * @param {HTMLElement} formElement
 * @param {import('../../core/ports/AuthPort.js').AuthPort} authPort
 * @param {{ onSuccess: () => void, showError: (msg: string) => void, showSuccess: (msg: string) => void }} callbacks
 */
export function initLoginView(formElement, authPort, { onSuccess, showError, showSuccess }) {
  if (!formElement) return;

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = formElement.querySelector('#email')?.value?.trim() || '';
    const password = formElement.querySelector('#password')?.value || '';

    const result = await LoginUser(authPort, email, password);

    if (result.success) {
      showSuccess('¡Inicio de sesión exitoso! Redirigiendo...');
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      showError(result.message || 'Error al iniciar sesión');
    }
  });
}
