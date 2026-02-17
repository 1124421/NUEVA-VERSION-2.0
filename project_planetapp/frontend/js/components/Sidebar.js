import { Component } from '../core/Component.js';
import { AuthService } from '../services/AuthService.js';

export class Sidebar extends Component {
    constructor() {
        super('sidebar');
    }

    template() {
        const userName = localStorage.getItem('user-name') || 'Usuario';
        const userRole = localStorage.getItem('user-role') || 'Administrador';
        const initials = this.getInitials(userName);

        return `
            <!-- Logo Renacer -->
            <div class="sidebar-logo">
                <img src="../assets/img/logo.PNG" alt="Logo Renacer" class="sidebar-logo-img" />
                <div class="sidebar-logo-text">
                    <h1>Renacer</h1>
                    <p>Gestión de Reciclaje</p>
                </div>
            </div>
            
            <!-- Navigation (unified single section) -->
            <nav class="sidebar-nav">
                <a class="nav-link" href="#dashboard" data-section="dashboard">
                    <i data-lucide="layout-dashboard"></i>
                    <span>
                        <span class="nav-title">Dashboard</span>
                        <span class="nav-subtitle">Panel principal</span>
                    </span>
                </a>
                <a class="nav-link" href="#venta" data-section="venta">
                    <i data-lucide="shopping-bag"></i>
                    <span>
                        <span class="nav-title">Venta</span>
                        <span class="nav-subtitle">Registrar ventas</span>
                    </span>
                </a>
                <a class="nav-link" href="#compra" data-section="compra">
                    <i data-lucide="shopping-cart"></i>
                    <span>
                        <span class="nav-title">Compra</span>
                        <span class="nav-subtitle">Registrar compras</span>
                    </span>
                </a>
                <a class="nav-link" href="#asociados" data-section="asociados">
                    <i data-lucide="users"></i>
                    <span>
                        <span class="nav-title">Asociados</span>
                        <span class="nav-subtitle">Recolectores y socios</span>
                    </span>
                </a>
                <a class="nav-link" href="#informes" data-section="informes">
                    <i data-lucide="file-text"></i>
                    <span>
                        <span class="nav-title">Informes</span>
                        <span class="nav-subtitle">Reportes y datos</span>
                    </span>
                </a>
                <a class="nav-link" href="#materiales" data-section="materiales">
                    <i data-lucide="layers"></i>
                    <span>
                        <span class="nav-title">Materiales</span>
                        <span class="nav-subtitle">Tipos y precios</span>
                    </span>
                </a>
                <a class="nav-link" href="#inventario" data-section="inventario">
                    <i data-lucide="package"></i>
                    <span>
                        <span class="nav-title">Inventario</span>
                        <span class="nav-subtitle">Stock de materiales</span>
                    </span>
                </a>
            </nav>

            <div class="sidebar-bottom" style="border-top: 1px solid rgba(255,255,255,0.1); padding: 8px 0; margin-top: auto;">
                <a class="nav-link" href="#configuracion" data-section="configuracion">
                    <i data-lucide="settings"></i>
                    <span class="nav-title">Configuración</span>
                </a>
                <a class="nav-link logout-btn" href="#">
                    <i data-lucide="log-out"></i>
                    <span class="nav-title">Cerrar sesión</span>
                </a>
            </div>
        `;
    }

    getInitials(name) {
        if (!name || name === 'Usuario') return 'U';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 4) {
            // Case: Name Name Surname Surname -> First Name (0) and First Surname (2)
            return (parts[0][0] + parts[2][0]).toUpperCase();
        } else if (parts.length >= 2) {
            // Case: Name Surname or Name Surname Surname -> First Name (0) and First Surname (1)
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    }

    afterMount() {
        this.element.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                this.updateActiveLink(href);
                // If clicking the same route, hashchange won't fire.
                // Force the Router to reload the current page.
                if (href && href === window.location.hash) {
                    e.preventDefault();
                    if (window.appRouter) {
                        window.appRouter.handleRoute();
                    }
                }
            });
        });

        const logoutBtn = this.element.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Clear ALL session data
                localStorage.removeItem('planetapp_user');
                localStorage.removeItem('user-id');
                localStorage.removeItem('user-name');
                localStorage.removeItem('user-email');
                localStorage.removeItem('user-role');
                localStorage.removeItem('user-telefono');
                window.location.replace('../index.html');
            });
        }

        window.addEventListener('hashchange', () => {
            this.updateActiveLink(window.location.hash || '#dashboard');
        });

        this.updateActiveLink(window.location.hash || '#dashboard');
    }

    updateActiveLink(hash) {
        this.element.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}
