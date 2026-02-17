/**
 * Punto de entrada principal (opcional).
 * Las páginas cargan su propio entry: entry-login.js, entry-register.js, entry-panel.js, entry-asociados.js
 */

export { AuthApiAdapter } from './adapters/api/AuthApiAdapter.js';
export { DashboardApiAdapter } from './adapters/api/DashboardApiAdapter.js';
export { AsociadosStorageAdapter } from './adapters/api/AsociadosStorageAdapter.js';
export { User } from './core/domain/User.js';
export { Asociado } from './core/domain/Asociado.js';
