/**
 * Web Component: Accordion (Acordeón)
 * Componente de acordeón estilo dashboard moderno con numeración automática
 */
class AppAccordion extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupListeners();
    }

    render() {
        const items = Array.from(this.querySelectorAll('app-accordion-item'));

        const itemsHtml = items.map((item, index) => {
            const title = item.getAttribute('title') || `Sección ${index + 1}`;
            const isOpen = item.hasAttribute('open');
            const content = item.innerHTML;

            return `
        <div class="accordion__item ${isOpen ? 'accordion__item--open' : ''}" data-index="${index}">
          <button class="accordion__header" type="button">
            <span class="accordion__number">${index + 1}.</span>
            <span class="accordion__title">${title}</span>
            <span class="accordion__icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>
          <div class="accordion__content">
            <slot name="item-${index}"></slot>
          </div>
        </div>
      `;
        }).join('');

        // Move content to named slots
        items.forEach((item, index) => {
            item.setAttribute('slot', `item-${index}`);
        });

        this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        
        .accordion {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
        }
        
        .accordion__item {
          border-bottom: 1px solid #e8e8e8;
        }
        
        .accordion__item:last-child {
          border-bottom: none;
        }
        
        .accordion__header {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 14px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          background: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease;
          font-family: inherit;
          text-align: left;
        }
        
        .accordion__header:hover {
          background: #f8f9fa;
        }
        
        .accordion__number {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          margin-right: 12px;
          font-size: 13px;
          font-weight: 600;
          color: #666;
        }
        
        .accordion__title {
          flex: 1;
        }
        
        .accordion__icon {
          margin-left: auto;
          color: #666;
          transition: transform 0.2s ease;
        }
        
        .accordion__item--open .accordion__icon {
          transform: rotate(180deg);
        }
        
        .accordion__content {
          display: none;
          padding: 0 16px 16px 52px;
          background: #f8f9fa;
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }
        
        .accordion__item--open .accordion__content {
          display: block;
        }
      </style>
      
      <div class="accordion">
        ${itemsHtml}
      </div>
    `;
    }

    setupListeners() {
        this.shadowRoot.querySelectorAll('.accordion__header').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.closest('.accordion__item');
                const index = item.dataset.index;
                const isOpen = item.classList.contains('accordion__item--open');

                // Toggle current item
                item.classList.toggle('accordion__item--open');

                // Dispatch event
                this.dispatchEvent(new CustomEvent('accordion-toggle', {
                    detail: { index: parseInt(index), isOpen: !isOpen },
                    bubbles: true
                }));
            });
        });
    }
}

/**
 * Web Component: Accordion Item
 * Item individual para usar dentro de app-accordion
 */
class AppAccordionItem extends HTMLElement {
    constructor() {
        super();
    }
}

customElements.define('app-accordion', AppAccordion);
customElements.define('app-accordion-item', AppAccordionItem);
