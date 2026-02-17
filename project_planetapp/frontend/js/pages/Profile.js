import { Component } from '../core/Component.js';

export class Profile extends Component {
    constructor() {
        super('profile');
    }

    template() {
        const userId = localStorage.getItem('user-id') || '';
        const userName = localStorage.getItem('user-name') || '';
        const userEmail = localStorage.getItem('user-email') || '';
        const userTelefono = localStorage.getItem('user-telefono') || '';
        const userRole = localStorage.getItem('user-role') || 'USER';

        return `
            <!-- Profile Content -->
            <div class="row g-3">
                <!-- Profile Card -->
                <div class="col-lg-4">
                    <div class="module-card profile-avatar-card">
                        <div class="profile-avatar-section">
                            <div class="profile-avatar">
                                <i data-lucide="user"></i>
                            </div>
                            <h4 id="profileDisplayName">${userName}</h4>
                            <span class="badge badge-success">${userRole}</span>
                        </div>
                        <div class="profile-stats">
                            <div class="profile-stat-item">
                                <i data-lucide="calendar"></i>
                                <span>Miembro desde 2026</span>
                            </div>
                            <div class="profile-stat-item">
                                <i data-lucide="mail"></i>
                                <span id="profileDisplayEmail">${userEmail}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Edit Form Card -->
                <div class="col-lg-8">
                    <div class="module-card">
                        <div class="card-header-row">
                            <i data-lucide="edit-3"></i>
                            <h5>Editar Información</h5>
                        </div>

                        <form id="profileForm">
                            <input type="hidden" id="userId" value="${userId}">
                            
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label" for="profileNombre">Nombre Completo *</label>
                                        <input type="text" class="form-control form-control-sm" id="profileNombre" 
                                               value="${userName}" required placeholder="Ingresa tu nombre">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label" for="profileEmail">Correo Electrónico *</label>
                                        <input type="email" class="form-control form-control-sm" id="profileEmail" 
                                               value="${userEmail}" required placeholder="correo@ejemplo.com">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label" for="profileTelefono">Teléfono</label>
                                        <input type="tel" class="form-control form-control-sm" id="profileTelefono" 
                                               value="${userTelefono}" placeholder="Ej: 3001234567">
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label class="form-label" for="profileRol">Rol</label>
                                        <input type="text" class="form-control form-control-sm" id="profileRol" 
                                               value="${userRole}" disabled>
                                        <small class="text-muted">El rol no puede ser modificado</small>
                                    </div>
                                </div>
                            </div>

                            <div class="profile-form-actions">
                                <button type="submit" class="btn btn-primary-green">
                                    <i data-lucide="save"></i>
                                    Guardar Cambios
                                </button>
                                <button type="button" class="btn btn-outline-secondary" id="btnCancelProfile">
                                    <i data-lucide="x"></i>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `;
    }

    afterMount() {
        // Initialize Lucide icons
        if (window.lucide) {
            window.lucide.createIcons();
        }

        // Form submission handler
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Cancel button handler
        const cancelBtn = document.getElementById('btnCancelProfile');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.resetForm());
        }
    }

    resetForm() {
        document.getElementById('profileNombre').value = localStorage.getItem('user-name') || '';
        document.getElementById('profileEmail').value = localStorage.getItem('user-email') || '';
        document.getElementById('profileTelefono').value = localStorage.getItem('user-telefono') || '';
    }

    async handleSubmit(e) {
        e.preventDefault();

        const userId = document.getElementById('userId').value;
        const nombre = document.getElementById('profileNombre').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        const telefono = document.getElementById('profileTelefono').value.trim();

        // Frontend validation
        if (!nombre) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El nombre es requerido'
            });
            return;
        }

        if (!email) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El correo electrónico es requerido'
            });
            return;
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor ingresa un correo electrónico válido'
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:8082/api/auth/profile/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    telefono
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();

                // Update localStorage
                localStorage.setItem('user-name', updatedUser.nombre);
                localStorage.setItem('user-email', updatedUser.email);
                localStorage.setItem('user-telefono', updatedUser.telefono || '');

                // Update display elements
                document.getElementById('profileDisplayName').textContent = updatedUser.nombre;
                document.getElementById('profileDisplayEmail').textContent = updatedUser.email;

                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'Tu perfil ha sido actualizado correctamente',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                const errorText = await response.text();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: errorText || 'No se pudo actualizar el perfil'
                });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    }
}
