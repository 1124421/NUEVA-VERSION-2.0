/**
 * Pagination Component
 * A Pure JS component that controls a DataTable instance to provide
 * a custom pagination UI with the format: < 1 2 ... 5 6 7 >
 */
export class Pagination {
    constructor(dataTable, containerId) {
        this.dataTable = dataTable;
        this.containerInfo = document.getElementById(containerId);

        if (!this.containerInfo) {
            console.error(`Pagination container #${containerId} not found.`);
            return;
        }

        this.render();
        this.bindEvents();
    }

    bindEvents() {
        // Listen for table draw events (page change, search, sort, filter)
        this.dataTable.on('draw', () => {
            this.update();
        });
    }

    render() {
        // Create the pagination container structure
        this.containerInfo.innerHTML = '';
        this.paginationContainer = document.createElement('div');
        this.paginationContainer.className = 'custom-pagination-container';
        this.containerInfo.appendChild(this.paginationContainer);
        this.update();
    }

    update() {
        if (!this.paginationContainer) return;

        const info = this.dataTable.page.info();
        const current = info.page; // 0-indexed
        const total = info.pages;

        this.paginationContainer.innerHTML = '';

        // If no pages or single page (and we want to hide it), we can return.
        // But usually we show it if > 1 page.
        if (total <= 1) return;

        // Prev Button (<)
        const prevBtn = this.createButton('<', () => this.dataTable.page('previous').draw('page'), current === 0);
        this.paginationContainer.appendChild(prevBtn);

        // Page Numbers
        const pages = this.calculatePages(current, total);

        pages.forEach(p => {
            if (p === '...') {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'custom-page-ellipsis';
                ellipsis.textContent = '...';
                this.paginationContainer.appendChild(ellipsis);
            } else {
                // Determine if this is the active page
                // Note: 'p' from calculation is 1-indexed, 'current' is 0-indexed
                const isActive = (p - 1) === current;
                const pageBtn = this.createButton(p, () => this.dataTable.page(p - 1).draw('page'), false, isActive);
                this.paginationContainer.appendChild(pageBtn);
            }
        });

        // Next Button (>)
        const nextBtn = this.createButton('>', () => this.dataTable.page('next').draw('page'), current === (total - 1));
        this.paginationContainer.appendChild(nextBtn);
    }

    createButton(text, onClick, disabled = false, active = false) {
        const btn = document.createElement('button');
        btn.className = `custom-page-btn ${active ? 'active' : ''}`;
        btn.textContent = text;
        btn.disabled = disabled;

        if (!disabled && !active) {
            btn.onclick = onClick;
        }

        return btn;
    }

    calculatePages(current, total) {
        // Logic to show: 1 2 3 ... 7
        // current is 0-indexed, so we convert to 1-indexed for display
        const c = current + 1;
        const delta = 2; // Number of pages to show around current
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);

        if (total <= 1) return range;

        for (let i = c - delta; i <= c + delta; i++) {
            if (i < total && i > 1) {
                range.push(i);
            }
        }
        range.push(total);

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
        return rangeWithDots;
    }
}
