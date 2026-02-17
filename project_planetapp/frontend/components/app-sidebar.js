/**
 * Componente Web: Sidebar estilo Apprky — Dark Theme
 * Logo + nombre, ítems sin subtítulos, activo con barra verde, Cerrar sesión y versión.
 */
const BASE = (path) => (path || '..');

const ICONS = {
  home: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  box: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  cart: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  users: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  file: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
  package: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/></svg>',
  layers: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/></svg>',
  settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  globe: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
};

class AppSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  static get observedAttributes() {
    return ['active', 'base-path', 'app-name', 'subtitle', 'version'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this.render();
  }

  get basePath() {
    return this.getAttribute('base-path') || '..';
  }

  get active() {
    return this.getAttribute('active') || '';
  }

  get appName() {
    return this.getAttribute('app-name') || 'PlanetApp';
  }

  get subtitle() {
    return this.getAttribute('subtitle') || 'Gestión de Reciclaje';
  }

  get version() {
    return this.getAttribute('version') || 'v1.0.0';
  }

  render() {
    const base = this.basePath;
    const active = this.active;
    const appName = this.appName;
    const subtitle = this.subtitle;
    const version = this.version;

    const items = [
      { id: 'dashboard', href: `${base}/pages/panel-inicio.html`, icon: ICONS.home, title: 'Inicio' },
      { id: 'venta', href: '#', icon: ICONS.cart, title: 'Venta' },
      { id: 'compra', href: '#', icon: ICONS.box, title: 'Compra' },
      { id: 'asociados', href: `${base}/pages/asociados.html`, icon: ICONS.users, title: 'Asociados' },
      { id: 'informes', href: `${base}/pages/informes.html`, icon: ICONS.file, title: 'Informes' },
      { id: 'inventario', href: '#', icon: ICONS.package, title: 'Inventario' },
      { id: 'materiales', href: `${base}/pages/nuevo-material.html`, icon: ICONS.layers, title: 'Materiales' },
      { id: 'configuracion', href: '#', icon: ICONS.settings, title: 'Configuración' },
    ];

    const menuHtml = items.map((it) => {
      const isActive = active === it.id;
      const cls = isActive ? 'nav-link active' : 'nav-link';
      return `<a class="${cls}" href="${it.href}">
        <span class="nav-icon">${it.icon}</span>
        <span class="nav-title">${it.title}</span>
      </a>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .sidebar {
          width: 260px;
          min-height: 100vh;
          background: #1e293b;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1000;
          box-shadow: 2px 0 12px rgba(0,0,0,0.15);
        }
        .logo {
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2d5a47 0%, #3d7a5c 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(45,90,71,0.3);
        }
        .logo-icon svg { width: 24px; height: 24px; }
        .logo-text h1 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
        }
        .logo-text p {
          margin: 2px 0 0 0;
          font-size: 12px;
          color: rgba(255,255,255,0.5);
        }
        .menu {
          flex: 1;
          padding: 16px 0;
          overflow-y: auto;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin: 2px 12px;
          border-radius: 8px;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          transition: background 0.2s, color 0.2s;
          border-left: 3px solid transparent;
        }
        .nav-link:hover {
          background: rgba(255,255,255,0.08);
          color: #ffffff;
        }
        .nav-link.active {
          background: rgba(45,90,71,0.35);
          color: #ffffff;
          font-weight: 600;
          border-left-color: #3cac34;
        }
        .nav-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }
        .nav-icon svg { width: 20px; height: 20px; }
        .nav-title { font-size: 14px; font-weight: 500; }
        .nav-link.active .nav-title { font-weight: 600; }
        .logout-wrap {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .nav-link.logout {
          color: #f87171;
          border-left: none;
        }
        .nav-link.logout:hover { background: rgba(248,113,113,0.12); color: #fca5a5; }
        .version {
          padding: 8px 16px 16px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
        }
        @media (max-width: 768px) {
          .sidebar { width: 72px; }
          .logo-text { display: none; }
          .logo { justify-content: center; padding: 16px 8px; }
          .nav-link { padding: 12px; justify-content: center; }
          .nav-title { display: none; }
        }
      </style>
      <div class="sidebar">
        <div class="logo">
          <div class="logo-icon">${ICONS.globe}</div>
          <div class="logo-text">
            <h1>${appName}</h1>
            <p>${subtitle}</p>
          </div>
        </div>
        <nav class="menu">
          ${menuHtml}
        </nav>
        <div class="logout-wrap">
          <a class="nav-link logout" href="#" id="sidebarLogout">
            <span class="nav-icon">${ICONS.logout}</span>
            <span class="nav-title">Cerrar sesión</span>
          </a>
        </div>
        <div class="version">${appName} ${version}</div>
      </div>
    `;
    const logoutBtn = this.shadowRoot.getElementById('sidebarLogout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.dispatchEvent(new CustomEvent('sidebar-logout', { bubbles: true, composed: true }));
      });
    }
  }
}

customElements.define('app-sidebar', AppSidebar);
