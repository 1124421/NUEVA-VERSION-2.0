import { Component } from '../core/Component.js';

/**
 * Reusable page header component that displays:
 * - Current module name (dynamic)
 * - Logged-in user name (from localStorage)
 */
export class PageHeader extends Component {
    constructor() {
        super('page-header');

        // Route to title/icon mapping
        this.routeConfig = {
            '#dashboard': { title: 'Dashboard', icon: 'layout-dashboard' },
            '#venta': { title: 'Venta', icon: 'shopping-bag' },
            '#compra': { title: 'Compra', icon: 'shopping-cart' },
            '#asociados': { title: 'Asociados', icon: 'users' },
            '#materiales': { title: 'Materiales', icon: 'layers' },
            '#informes': { title: 'Informes', icon: 'file-text' },
            '#inventario': { title: 'Inventario', icon: 'package' },
            '#configuracion': { title: 'Configuración', icon: 'settings' },
            '#perfil': { title: 'Mi Perfil', icon: 'user' }
        };

        // Listen for route changes
        this.handleRouteChange = this.handleRouteChange.bind(this);
        window.addEventListener('routeChange', this.handleRouteChange);
    }

    getCurrentRoute() {
        return window.location.hash || '#dashboard';
    }

    getRouteInfo() {
        const hash = this.getCurrentRoute();
        return this.routeConfig[hash] || { title: 'PlanetApp', icon: 'home' };
    }

    getUserName() {
        return localStorage.getItem('user-name') || 'Usuario';
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

    template() {
        const { title, icon } = this.getRouteInfo();
        const userName = this.getUserName();
        const userRole = localStorage.getItem('user-role') || 'Administrador';
        const initials = this.getInitials(userName);

        return `
            <div class="page-header-simple">
                <div class="header-content-row">
                    <div class="header-title-section">
                        <i data-lucide="${icon}"></i>
                        <h2 id="headerModuleName">${title}</h2>
                    </div>
                    <div class="header-user-badge" title="${userRole}">
                        <div class="header-user-avatar">
                            <span>${initials}</span>
                        </div>
                        <div class="header-user-details" style="display: flex; flex-direction: column;">
                            <span class="header-user-name" id="headerUserName" style="text-transform: capitalize;">${userName}</span>
                            <span class="header-user-subtitle" style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 0.5px; margin-top: -2px;">${userRole.toUpperCase()}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    handleRouteChange(event) {
        const { hash } = event.detail;
        const config = this.routeConfig[hash] || { title: 'PlanetApp', icon: 'home' };

        // Update title
        const titleEl = this.element?.querySelector('#headerModuleName');
        if (titleEl) {
            titleEl.textContent = config.title;
        }

        // Update icon correctly (Target the container and replace the element)
        const iconContainer = this.element?.querySelector('.header-title-section');
        if (iconContainer) {
            let iconEl = iconContainer.querySelector('i, svg');
            if (iconEl) {
                const newIcon = document.createElement('i');
                newIcon.setAttribute('data-lucide', config.icon);
                iconContainer.replaceChild(newIcon, iconEl);
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        }
    }

    destroy() {
        window.removeEventListener('routeChange', this.handleRouteChange);
        super.destroy();
    }
}
