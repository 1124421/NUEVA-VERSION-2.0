/**
 * Adaptador API: implementa AuthPort con fetch y localStorage.
 */

import { User } from '../../core/domain/User.js';
import { postJSON } from '../../infrastructure/httpClient.js';

const API_URL = 'http://localhost:8082/api/auth';
const STORAGE_KEYS = {
  userId: 'user-id',
  userName: 'user-name',
  userEmail: 'user-email',
  userRole: 'user-role',
};

/**
 * @implements {import('../../core/ports/AuthPort.js').AuthPort}
 */
export class AuthApiAdapter {
  async login(email, password) {
    try {
      const response = await postJSON(`${API_URL}/login`, { email, password });
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, message: errorText || 'Credenciales inválidas' };
      }
      const userData = await response.json();
      const user = User.fromJSON(userData);
      this._saveSession(user);
      return { success: true, user };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }

  async register(nombre, email, password, rol) {
    try {
      const response = await postJSON(`${API_URL}/register`, {
        nombre,
        email,
        password,
        rol,
      });
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, message: errorText || 'Error al registrar usuario' };
      }
      const userData = await response.json();
      const user = User.fromJSON(userData);
      return { success: true, user };
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.userId);
      localStorage.removeItem(STORAGE_KEYS.userName);
      localStorage.removeItem(STORAGE_KEYS.userEmail);
      localStorage.removeItem(STORAGE_KEYS.userRole);
      localStorage.removeItem('planetapp_user');
    }
    if (typeof window !== 'undefined') {
      window.location.href = '../login.html';
    }
  }

  checkAuth() {
    const userId = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.userId) : null;
    if (!userId) {
      if (typeof window !== 'undefined') {
        window.location.href = '../login.html';
      }
      return false;
    }
    return true;
  }

  getCurrentUser() {
    if (typeof localStorage === 'undefined') return null;
    const id = localStorage.getItem(STORAGE_KEYS.userId);
    if (!id) return null;
    return new User({
      id,
      nombre: localStorage.getItem(STORAGE_KEYS.userName),
      email: localStorage.getItem(STORAGE_KEYS.userEmail),
      rol: localStorage.getItem(STORAGE_KEYS.userRole),
    });
  }

  _saveSession(user) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.userId, user.id);
    localStorage.setItem(STORAGE_KEYS.userName, user.nombre);
    localStorage.setItem(STORAGE_KEYS.userEmail, user.email);
    localStorage.setItem(STORAGE_KEYS.userRole, user.rol);
  }
}
