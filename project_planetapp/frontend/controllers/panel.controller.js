document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. Gráfica de Dona (Ventas por categorías de material)
    // ----------------------------------------------------------------------
    const ctxDona = document.getElementById('ventasPorMaterialChart');

    if (ctxDona) {
        new Chart(ctxDona, {
            type: 'doughnut', // Tipo de gráfica de dona/anillo
            data: {
                labels: ['Papel', 'Cartón', 'Plástico', 'Vidrio'],
                datasets: [{
                    label: 'Ventas por Material (Kg)',
                    data: [300, 50, 100, 40], // Datos simulados
                    backgroundColor: [
                        '#2d5a47', // Verde Oscuro (Papel)
                        '#8DBC98', // Verde Claro (Cartón)
                        '#A0D2EB', // Azul (Plástico)
                        '#F1A9A0'  // Rojo/Salmón (Vidrio)
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom', // Leyendas debajo del gráfico
                    },
                    title: {
                        display: false
                    }
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 2. Gráfica de Línea (Materiales más vendidos)
    // ----------------------------------------------------------------------
    const ctxLinea = document.getElementById('materialesMasVendidosChart');

    if (ctxLinea) {
        new Chart(ctxLinea, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                datasets: [{
                    label: 'Plástico',
                    data: [12000, 19000, 3000, 5000, 2000, 3000, 15000, 25000, 18000, 22000, 10000, 20000],
                    borderColor: '#004085', // Azul
                    backgroundColor: 'rgba(0, 64, 133, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Cartón',
                    data: [15000, 12000, 25000, 15000, 18000, 10000, 20000, 10000, 22000, 15000, 25000, 19000],
                    borderColor: '#2d5a47', // Verde
                    backgroundColor: 'rgba(45, 90, 71, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }


    // ----------------------------------------------------------------------
    // Opcional: Funcionalidad de Modales (para abrir los formularios)
    // Esto es lo que te permite abrir los modales que agregaste antes.
    // ----------------------------------------------------------------------
    const openBtns = document.querySelectorAll('.actions .card');
    const closeBtns = document.querySelectorAll('.close-btn, .btn-cancelar');
    const modals = document.querySelectorAll('.modal');

    // Función para abrir el modal
    openBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let modalId = '';
            
            // Lógica para mapear el ID del card al ID del modal
            if (btn.classList.contains('card-green')) {
                modalId = 'modalCompra';
            } else if (btn.classList.contains('card-blue')) {
                modalId = 'modalVenta';
            } else if (btn.classList.contains('card-purple')) {
                modalId = 'modalAsociado';
            }
            
            if (modalId) {
                document.getElementById(modalId).style.display = 'flex';
            }
        });
    });

    // Función para cerrar el modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-target');
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // Cerrar si se hace clic fuera del modal
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

});