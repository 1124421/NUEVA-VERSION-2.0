/**
 * Cargador Centralizado de Componentes
 * Importa todos los Web Components para que estén disponibles
 */

// Importar todos los componentes
import './app-sidebar.js';
import './app-header.js';
import './app-modal.js';

// Exportar para uso en otros módulos si es necesario
export { AppSidebar } from './app-sidebar.js';
export { AppHeader } from './app-header.js';
export { AppModal } from './app-modal.js';

console.log('✅ Componentes Web cargados correctamente');
