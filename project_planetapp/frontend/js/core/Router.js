/**
 * Basic Hash-Based Router for the modular application.
 */
export class Router {
    constructor(routes, containerId) {
        this.routes = routes;
        this.container = document.getElementById(containerId);
        this.currentPage = null;

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    async handleRoute() {
        const hash = window.location.hash || '#dashboard';
        const route = this.routes.find(r => r.path === hash);

        // Dispatch route change event for PageHeader
        window.dispatchEvent(new CustomEvent('routeChange', { detail: { hash } }));

        if (route) {
            if (this.currentPage) {
                this.currentPage.destroy();
            }

            try {
                // Instantiate the page component
                this.currentPage = new route.component();
                await this.currentPage.mount(this.container);
            } catch (error) {
                console.error('Error loading route:', error);
                this.container.innerHTML = `<div class="alert alert-danger">Error al cargar la ruta: ${hash}</div>`;
            }
        } else {
            this.container.innerHTML = '<div class="alert alert-warning">Página no encontrada</div>';
        }
    }

    /**
     * Programmatically navigate to a path.
     * @param {string} path 
     */
    navigate(path) {
        window.location.hash = path;
    }
}
