/**
 * Componente Web: Header de la Aplicación
 * Encabezado reutilizable con título y avatar simplificado
 */
class AppHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachLogoutListener();
    }

    static get observedAttributes() {
        return ['title', 'user-name', 'user-role'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            const userName = this.getAttribute('user-name') || localStorage.getItem('user-name') || '';
            const userRole = this.getAttribute('user-role') || localStorage.getItem('user-role') || '';
            this.render(userName, userRole);
        }
    }

    render(userNameFromCallback = '', userRoleFromCallback = '') {
        const title = this.getAttribute('title') || 'Panel Principal';
        const userName = userNameFromCallback || this.getAttribute('user-name') || localStorage.getItem('user-name') || '';
        const userRole = userRoleFromCallback || this.getAttribute('user-role') || localStorage.getItem('user-role') || '';

        // Build initials from name
        const initials = userName
            ? userName.split(' ').map(w => w.charAt(0).toUpperCase()).slice(0, 2).join('')
            : '?';
        // Display role label (simplified)
        const roleLabel = userRole || 'Admin';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 64px;
                    padding: 12px 32px;
                    background: #ffffff;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
                    box-sizing: border-box;
                }

                h1 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 700;
                    line-height: 1;
                    color: #1e293b;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: default;
                }

                .avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #2d5a47 0%, #3d7a5a 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 11px;
                    letter-spacing: 0.5px;
                    flex-shrink: 0;
                    box-shadow: 0 2px 6px rgba(45, 90, 71, 0.25);
                }

                .role-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #64748b;
                }

                @media (max-width: 768px) {
                    .header {
                        padding: 12px 16px;
                    }

                    h1 {
                        font-size: 18px;
                    }
                }
            </style>

            <header class="header">
                <h1>${title}</h1>
                <div class="user-info" title="${userName} — ${roleLabel}">
                    <div class="avatar">${initials}</div>
                    <span class="role-label">${roleLabel}</span>
                </div>
            </header>
        `;
    }
}

// Registrar el componente
customElements.define('app-header', AppHeader);
