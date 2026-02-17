/**
 * Web Component: Tabs (Pestañas)
 * Componente de pestañas estilo dashboard moderno
 */
class AppTabs extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    static get observedAttributes() {
        return ['active-tab'];
    }

    attributeChangedCallback() {
        if (this.shadowRoot.innerHTML) {
            this.updateActiveTab();
        }
    }

    get activeTab() {
        return this.getAttribute('active-tab') || '0';
    }

    render() {
        const tabs = Array.from(this.querySelectorAll('app-tab'));

        const tabHeaders = tabs.map((tab, index) => {
            const label = tab.getAttribute('label') || `Tab ${index + 1}`;
            const isActive = index.toString() === this.activeTab;
            return `<button class="tabs__item ${isActive ? 'tabs__item--active' : ''}" data-index="${index}">${label}</button>`;
        }).join('');

        this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        
        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #e0e0e0;
          margin-bottom: 16px;
        }
        
        .tabs__item {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #666;
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        
        .tabs__item:hover {
          color: #2d5a47;
        }
        
        .tabs__item--active {
          color: #2d5a47;
          border-bottom-color: #2d5a47;
          font-weight: 600;
        }
        
        .tabs__content {
          display: none;
        }
        
        .tabs__content--active {
          display: block;
        }
      </style>
      
      <div class="tabs" role="tablist">
        ${tabHeaders}
      </div>
      <div class="tabs__panels">
        <slot></slot>
      </div>
    `;

        this.updateActiveTab();
    }

    setupListeners() {
        this.shadowRoot.querySelectorAll('.tabs__item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setAttribute('active-tab', btn.dataset.index);
                this.dispatchEvent(new CustomEvent('tab-change', {
                    detail: { index: parseInt(btn.dataset.index) },
                    bubbles: true
                }));
            });
        });
    }

    updateActiveTab() {
        const activeIndex = parseInt(this.activeTab);

        // Update tab buttons
        this.shadowRoot.querySelectorAll('.tabs__item').forEach((btn, i) => {
            btn.classList.toggle('tabs__item--active', i === activeIndex);
        });

        // Update tab panels
        const tabs = Array.from(this.querySelectorAll('app-tab'));
        tabs.forEach((tab, i) => {
            tab.style.display = i === activeIndex ? 'block' : 'none';
        });
    }
}

/**
 * Web Component: Tab Panel
 * Panel individual para usar dentro de app-tabs
 */
class AppTab extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.style.display = 'none';
    }
}

customElements.define('app-tabs', AppTabs);
customElements.define('app-tab', AppTab);
