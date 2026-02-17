import { Router } from './core/Router.js';
import { Dashboard } from './pages/Dashboard.js';
import { Sidebar } from './components/Sidebar.js';
import { PageHeader } from './components/PageHeader.js';
import { Asociados } from './pages/Asociados.js';
import { Materiales } from './pages/Materiales.js';
import { Venta } from './pages/Venta.js';
import { Compra } from './pages/Compra.js';
import { Informes } from './pages/Informes.js';
import { Inventario } from './pages/Inventario.js';
import { Configuracion } from './pages/Configuracion.js';
import { Profile } from './pages/Profile.js';

const routes = [
    { path: '#dashboard', component: Dashboard },
    { path: '#asociados', component: Asociados },
    { path: '#materiales', component: Materiales },
    { path: '#venta', component: Venta },
    { path: '#compra', component: Compra },
    { path: '#informes', component: Informes },
    { path: '#inventario', component: Inventario },
    { path: '#configuracion', component: Configuracion },
    { path: '#perfil', component: Profile },
];

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Sidebar
    const sidebar = new Sidebar();
    sidebar.mount(document.querySelector('.sidebar'));

    // Initialize PageHeader
    const pageHeader = new PageHeader();
    const headerContainer = document.getElementById('page-header');
    if (headerContainer) {
        pageHeader.mount(headerContainer);
    }

    // Initialize the router
    window.appRouter = new Router(routes, 'dynamic-content');
});
