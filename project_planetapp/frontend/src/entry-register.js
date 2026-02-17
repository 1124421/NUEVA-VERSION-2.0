/**
 * Entry point: Página de Registro
 * Compone puertos, adaptadores y vista (Arquitectura Hexagonal).
 */

import { AuthApiAdapter } from './adapters/api/AuthApiAdapter.js';
import { initRegisterView } from './adapters/ui/RegisterView.js';

const authPort = new AuthApiAdapter();

function showError(message) {
  const el = document.getElementById('errorMessage');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
  const successEl = document.getElementById('successMessage');
  if (successEl) successEl.style.display = 'none';
}

function showSuccess(message) {
  const el = document.getElementById('successMessage');
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
  }
  const errorEl = document.getElementById('errorMessage');
  if (errorEl) errorEl.style.display = 'none';
}

function onSuccess() {
  window.location.href = 'login.html';
}

const form = document.getElementById('registerForm');
initRegisterView(form, authPort, { onSuccess, showError, showSuccess });
