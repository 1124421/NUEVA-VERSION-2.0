export class Pagination {
    constructor(dataTable, containerId) {
        this.dataTable = dataTable;
        this.containerId = containerId;
        this.container = document.getElementById(containerId);

        if (!this.container) return; // Guard clause if container is missing

        this.init();
    }

    init() {
        this.container.classList.add('custom-pagination-container');
        this.dataTable.on('draw.dt', () => {
            this.render();
        });
        // Initial render
        this.render();
    }

    render() {
        const pageInfo = this.dataTable.page.info();
        const { page, pages, recordsTotal } = pageInfo;

        // If no pages or just one page, hide container (optional, or show disabled)
        // User wanted minimalist. If 1 page, maybe hide?
        // Let's hide if pages <= 1
        if (pages <= 1) {
            this.container.innerHTML = '';
            return;
        }

        let html = '';

        // Previous Button
        const prevDisabled = page === 0 ? 'disabled' : '';
        html += `<button class="custom-page-btn" ${prevDisabled} data-action="prev">
            <i data-lucide="chevron-left" style="width:14px; height:14px;"></i>
        </button>`;

        // Page Numbers (Smart Ellipsis)
        html += this.getPaginationLinks(page, pages);

        // Next Button
        const nextDisabled = page === pages - 1 ? 'disabled' : '';
        html += `<button class="custom-page-btn" ${nextDisabled} data-action="next">
            <i data-lucide="chevron-right" style="width:14px; height:14px;"></i>
        </button>`;

        this.container.innerHTML = html;

        // Re-initialize icons (if using Lucide)
        if (window.lucide) {
            lucide.createIcons({
                root: this.container
            });
        }

        // Add event listeners
        this.container.querySelectorAll('[data-action="prev"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dataTable.page('previous').draw('page');
            });
        });

        this.container.querySelectorAll('[data-action="next"]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.dataTable.page('next').draw('page');
            });
        });

        this.container.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const p = parseInt(e.currentTarget.dataset.page);
                this.dataTable.page(p).draw('page');
            });
        });
    }

    getPaginationLinks(currentPage, totalPages) {
        let links = '';
        const maxVisible = 5; // Total numbers to show implies range

        // Logic for ellipsis: 1 ... 4 5 6 ... 10
        // We want: [1] ... [current-1] [current] [current+1] ... [last]

        let range = [];

        if (totalPages <= 7) {
            // If few pages, show all
            for (let i = 0; i < totalPages; i++) range.push(i);
        } else {
            // Always include first and last
            // Include current, prev, next
            let start = Math.max(0, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            if (currentPage < 3) {
                // Near start: 1 2 3 4 ... 10
                end = 3;
                start = 0;
            } else if (currentPage > totalPages - 4) {
                // Near end: 1 ... 7 8 9 10
                start = totalPages - 4;
                end = totalPages - 1;
            }

            range.push(0); // Always first
            if (start > 1) range.push('...');

            for (let i = start; i <= end; i++) {
                if (i !== 0 && i !== totalPages - 1) {
                    range.push(i);
                }
            }

            if (end < totalPages - 2) range.push('...');
            range.push(totalPages - 1); // Always last
        }

        range.forEach(p => {
            if (p === '...') {
                links += `<span class="custom-page-ellipsis">...</span>`;
            } else {
                const activeClass = p === currentPage ? 'active' : '';
                links += `<button class="custom-page-btn ${activeClass}" data-page="${p}">${p + 1}</button>`;
            }
        });

        return links;
    }
}
