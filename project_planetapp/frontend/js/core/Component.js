/**
 * Base class for all UI components in the modular architecture.
 */
export class Component {
    constructor(id, data = {}) {
        this.id = id;
        this.data = data;
        this.element = null;
    }

    /**
     * Renders the HTML template for the component.
     * @returns {string} The HTML content.
     */
    template() {
        return '';
    }

    /**
     * Mounts the component into a container.
     * @param {HTMLElement} container 
     */
    async mount(container) {
        this.element = container;
        this.render();
        try {
            await this.afterMount();
        } catch (err) {
            console.error(`[Component:${this.id}] Error in afterMount:`, err);
        }
    }

    /**
     * Updates the container content with the template.
     */
    render() {
        if (!this.element) return;
        this.element.innerHTML = this.template();
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    /**
     * Called after the component is mounted and rendered.
     * Useful for attaching event listeners.
     */
    afterMount() { }

    /**
     * Cleans up before the component is destroyed.
     */
    destroy() {
        this.element = null;
    }
}
