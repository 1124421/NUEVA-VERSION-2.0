/**
 * Componente Web: Modal Reutilizable
 * Modal genérico que puede usarse en cualquier página
 */
class AppModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    static get observedAttributes() {
        return ['open', 'title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'open') {
            this.updateVisibility();
        }
        if (name === 'title') {
            this.updateTitle();
        }
    }

    render() {
        const title = this.getAttribute('title') || 'Modal';
        const isOpen = this.hasAttribute('open');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: ${isOpen ? 'flex' : 'none'};
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideDown {
                    from {
                        transform: translateY(-50px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .modal-content {
                    background: white;
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    animation: slideDown 0.4s ease;
                    position: relative;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #f0f0f0;
                }

                .modal-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2C3E50;
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 32px;
                    color: #7F8C8D;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                .close-btn:hover {
                    background: #f0f0f0;
                    color: #E74C3C;
                    transform: rotate(90deg);
                }

                .modal-body {
                    margin-bottom: 20px;
                }

                ::slotted(*) {
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .modal-content {
                        width: 95%;
                        padding: 25px;
                    }

                    .modal-title {
                        font-size: 20px;
                    }
                }
            </style>

            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 class="modal-title">${title}</h2>
                        <button class="close-btn" aria-label="Cerrar">&times;</button>
                    </div>
                    <div class="modal-body">
                        <slot></slot>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Cerrar al hacer clic en el botón de cerrar
        const closeBtn = this.shadowRoot.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.close());

        // Cerrar al hacer clic en el overlay
        const overlay = this.shadowRoot.querySelector('.modal-overlay');
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.close();
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.hasAttribute('open')) {
                this.close();
            }
        });
    }

    open() {
        this.setAttribute('open', '');
        this.dispatchEvent(new CustomEvent('modal-opened'));
    }

    close() {
        this.removeAttribute('open');
        this.dispatchEvent(new CustomEvent('modal-closed'));
    }

    updateVisibility() {
        const isOpen = this.hasAttribute('open');
        this.style.display = isOpen ? 'flex' : 'none';
    }

    updateTitle() {
        const titleElement = this.shadowRoot.querySelector('.modal-title');
        if (titleElement) {
            titleElement.textContent = this.getAttribute('title') || 'Modal';
        }
    }
}

// Registrar el componente
customElements.define('app-modal', AppModal);
