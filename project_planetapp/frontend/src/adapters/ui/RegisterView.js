/**
 * Adaptador UI: Vista de Registro
 * Conecta el formulario con el caso de uso RegisterUser.
 */

import { RegisterUser } from '../../application/RegisterUser.js';

/**
 * @param {HTMLElement} formElement
 * @param {import('../../core/ports/AuthPort.js').AuthPort} authPort
 * @param {{ onSuccess: () => void, showError: (msg: string) => void, showSuccess: (msg: string) => void }} callbacks
 */
export function initRegisterView(formElement, authPort, { onSuccess, showError, showSuccess }) {
  if (!formElement) return;

  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = formElement.querySelector('#nombre')?.value?.trim() || '';
    const email = formElement.querySelector('#email')?.value?.trim() || '';
    const password = formElement.querySelector('#password')?.value || '';
    const confirmPassword = formElement.querySelector('#confirmPassword')?.value || '';
    const rol = formElement.querySelector('#rol')?.value || 'USER';

    if (password !== confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }

    const result = await RegisterUser(authPort, nombre, email, password, rol);

    if (result.success) {
      showSuccess('¡Registro exitoso! Redirigiendo al login...');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      showError(result.message || 'Error al registrar');
    }
  });
}
