import { Component } from '../core/Component.js';
import { ApiClient } from '../services/ApiClient.js';

export class Configuracion extends Component {
    constructor() {
        super('configuracion');
    }

    template() {
        const savedMode = localStorage.getItem('daltonismo-mode') || 'none';
        const savedFontSize = localStorage.getItem('app-font-size') || '14';

        return `
            <!-- Accessibility Settings -->
            <div class="module-card" style="max-width: 640px;">
                <div class="card-header-row">
                    <h5>Configuración de Accesibilidad</h5>
                </div>

                <!-- Colorblind Section -->
                <div style="margin-bottom: 28px;">
                    <h6 style="font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 12px;">
                        Modo Daltónico
                    </h6>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 14px;">
                        Seleccione un filtro para adaptar los colores de la interfaz a su tipo de visión.
                    </p>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label class="config-radio" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                            <input type="radio" name="daltonismo" value="none" ${savedMode === 'none' ? 'checked' : ''}>
                            <div>
                                <strong style="font-size: 13px; color: #1e293b;">Sin filtro</strong>
                                <span style="font-size: 11px; color: #94a3b8; display: block;">Visión normal (por defecto)</span>
                            </div>
                        </label>
                        <label class="config-radio" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                            <input type="radio" name="daltonismo" value="protanopia" ${savedMode === 'protanopia' ? 'checked' : ''}>
                            <div>
                                <strong style="font-size: 13px; color: #1e293b;">Protanopía</strong>
                                <span style="font-size: 11px; color: #94a3b8; display: block;">Dificultad para distinguir el rojo</span>
                            </div>
                        </label>
                        <label class="config-radio" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                            <input type="radio" name="daltonismo" value="deuteranopia" ${savedMode === 'deuteranopia' ? 'checked' : ''}>
                            <div>
                                <strong style="font-size: 13px; color: #1e293b;">Deuteranopía</strong>
                                <span style="font-size: 11px; color: #94a3b8; display: block;">Dificultad para distinguir el verde</span>
                            </div>
                        </label>
                        <label class="config-radio" style="display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s;">
                            <input type="radio" name="daltonismo" value="tritanopia" ${savedMode === 'tritanopia' ? 'checked' : ''}>
                            <div>
                                <strong style="font-size: 13px; color: #1e293b;">Tritanopía</strong>
                                <span style="font-size: 11px; color: #94a3b8; display: block;">Dificultad para distinguir el azul</span>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Divider -->
                <div style="border-top: 1px solid #e2e8f0; margin-bottom: 24px;"></div>

                <!-- Font Size Section -->
                <div>
                    <h6 style="font-size: 14px; font-weight: 600; color: #334155; margin-bottom: 12px;">
                        Tamaño de Letra
                    </h6>
                    <p style="font-size: 12px; color: #64748b; margin-bottom: 14px;">
                        Ajuste el tamaño de la fuente en toda la aplicación.
                    </p>
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <span style="font-size: 11px; color: #94a3b8;">A</span>
                        <input type="range" id="fontSizeSlider" min="12" max="24" step="1" value="${savedFontSize}"
                            style="flex: 1; accent-color: #334155; cursor: pointer;">
                        <span style="font-size: 18px; color: #94a3b8; font-weight: 600;">A</span>
                        <div style="display: flex; align-items: center; gap: 4px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 2px 8px;">
                            <input type="number" id="fontSizeInput" min="12" max="24" value="${savedFontSize}" 
                                style="width: 45px; border: none; background: transparent; font-size: 13px; font-weight: 600; color: #334155; outline: none; text-align: right;">
                            <span style="font-size: 12px; color: #64748b; font-weight: 500;">px</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div style="height: 20px;"></div>

            <!-- Secret Question Section -->
            <div class="module-card" style="max-width: 640px;">
                <div class="card-header-row">
                    <h5>Pregunta Secreta</h5>
                </div>

                <p style="font-size: 12px; color: #64748b; margin-bottom: 18px;">
                    Configure su pregunta secreta para recuperar su contraseña en caso de olvidarla.
                    La respuesta será encriptada de forma segura.
                </p>

                <div style="margin-bottom: 16px;">
                    <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">
                        Pregunta secreta
                    </label>
                    <select id="secretQuestionSelect" style="width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #334155; background: white; cursor: pointer; outline: none; transition: border-color 0.2s;">
                        <option value="">-- Seleccione una pregunta --</option>
                        <option value="¿Cuál es el nombre de tu primera mascota?">¿Cuál es el nombre de tu primera mascota?</option>
                        <option value="¿En qué ciudad naciste?">¿En qué ciudad naciste?</option>
                        <option value="¿Cuál es el nombre de tu mejor amigo de la infancia?">¿Cuál es el nombre de tu mejor amigo de la infancia?</option>
                        <option value="¿Cuál es tu comida favorita?">¿Cuál es tu comida favorita?</option>
                        <option value="¿Cuál es el nombre de tu escuela primaria?">¿Cuál es el nombre de tu escuela primaria?</option>
                        <option value="¿Cuál es tu color favorito?">¿Cuál es tu color favorito?</option>
                        <option value="¿Cuál es el segundo nombre de tu madre?">¿Cuál es el segundo nombre de tu madre?</option>
                    </select>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">
                        Respuesta secreta
                    </label>
                    <div style="position: relative;">
                        <input type="password" id="secretAnswerInput" placeholder="Escriba su respuesta secreta..."
                            style="width: 100%; padding: 10px 40px 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #334155; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                            autocomplete="off">
                        <button type="button" id="toggleSecretAnswer" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 16px; padding: 4px; display: flex; align-items: center;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <label style="font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 6px; display: block;">
                        Confirmar respuesta
                    </label>
                    <div style="position: relative;">
                        <input type="password" id="secretAnswerConfirm" placeholder="Confirme su respuesta secreta..."
                            style="width: 100%; padding: 10px 40px 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #334155; outline: none; transition: border-color 0.2s; box-sizing: border-box;"
                            autocomplete="off">
                        <button type="button" id="toggleSecretConfirm" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 16px; padding: 4px; display: flex; align-items: center;">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>

                <div id="secretQuestionMessage" style="display: none; padding: 10px 14px; border-radius: 8px; font-size: 12px; margin-bottom: 14px;"></div>

                <button type="button" id="btnSaveSecretQuestion"
                    style="background: #2d5a47; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: inline-flex; align-items: center; gap: 8px;">
                    💾 Guardar Pregunta Secreta
                </button>
            </div>
        `;
    }

    afterMount() {
        // Colorblind radios
        this.element.querySelectorAll('input[name="daltonismo"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.applyColorblindMode(e.target.value);
            });
        });

        // Font size controls (Slider & Numeric Input)
        const slider = this.element.querySelector('#fontSizeSlider');
        const numInput = this.element.querySelector('#fontSizeInput');

        const updateFont = (val) => {
            if (val < 12) val = 12;
            if (val > 24) val = 24;
            slider.value = val;
            numInput.value = val;
            this.applyFontSize(val);
        };

        slider.addEventListener('input', () => updateFont(slider.value));
        numInput.addEventListener('input', () => updateFont(numInput.value));
        numInput.addEventListener('blur', () => {
            if (!numInput.value) updateFont(14);
        });

        // Secret question - toggle visibility
        this.element.querySelector('#toggleSecretAnswer').addEventListener('click', () => {
            const input = this.element.querySelector('#secretAnswerInput');
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        this.element.querySelector('#toggleSecretConfirm').addEventListener('click', () => {
            const input = this.element.querySelector('#secretAnswerConfirm');
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        // Secret question - focus styles
        ['#secretQuestionSelect', '#secretAnswerInput', '#secretAnswerConfirm'].forEach(sel => {
            const el = this.element.querySelector(sel);
            if (el) {
                el.addEventListener('focus', () => { el.style.borderColor = '#2d5a47'; });
                el.addEventListener('blur', () => { el.style.borderColor = '#e2e8f0'; });
            }
        });

        // Save button hover
        const saveBtn = this.element.querySelector('#btnSaveSecretQuestion');
        saveBtn.addEventListener('mouseenter', () => { saveBtn.style.background = '#245239'; saveBtn.style.transform = 'translateY(-1px)'; });
        saveBtn.addEventListener('mouseleave', () => { saveBtn.style.background = '#2d5a47'; saveBtn.style.transform = 'translateY(0)'; });

        // Save secret question
        saveBtn.addEventListener('click', () => this.saveSecretQuestion());
    }

    showMessage(type, text) {
        const msgEl = this.element.querySelector('#secretQuestionMessage');
        if (!msgEl) return;
        msgEl.style.display = 'block';
        if (type === 'success') {
            msgEl.style.background = '#f0fdf4';
            msgEl.style.color = '#166534';
            msgEl.style.border = '1px solid #bbf7d0';
        } else {
            msgEl.style.background = '#fef2f2';
            msgEl.style.color = '#dc2626';
            msgEl.style.border = '1px solid #fecaca';
        }
        msgEl.textContent = text;
        // Auto-hide after 5 seconds
        setTimeout(() => { if (msgEl) msgEl.style.display = 'none'; }, 5000);
    }

    async saveSecretQuestion() {
        const select = this.element.querySelector('#secretQuestionSelect');
        const answerInput = this.element.querySelector('#secretAnswerInput');
        const confirmInput = this.element.querySelector('#secretAnswerConfirm');
        const saveBtn = this.element.querySelector('#btnSaveSecretQuestion');

        const pregunta = select.value;
        const respuesta = answerInput.value.trim();
        const confirmacion = confirmInput.value.trim();

        // Validations
        if (!pregunta) {
            this.showMessage('error', 'Debe seleccionar una pregunta secreta.');
            select.focus();
            return;
        }

        if (!respuesta) {
            this.showMessage('error', 'Debe escribir una respuesta secreta.');
            answerInput.focus();
            return;
        }

        if (respuesta.length < 3) {
            this.showMessage('error', 'La respuesta debe tener al menos 3 caracteres.');
            answerInput.focus();
            return;
        }

        if (respuesta !== confirmacion) {
            this.showMessage('error', 'Las respuestas no coinciden. Verifique la confirmación.');
            confirmInput.focus();
            return;
        }

        const userId = localStorage.getItem('user-id');
        if (!userId) {
            this.showMessage('error', 'No se encontró sesión activa. Inicie sesión nuevamente.');
            return;
        }

        // Disable button while saving
        saveBtn.disabled = true;
        saveBtn.textContent = '⏳ Guardando...';
        saveBtn.style.opacity = '0.7';

        try {
            await ApiClient.auth.updateSecretQuestion(userId, {
                preguntaSecreta: pregunta,
                respuestaSecreta: respuesta
            });

            // Success
            this.showMessage('success', '✅ Pregunta secreta actualizada exitosamente.');
            answerInput.value = '';
            confirmInput.value = '';
            select.value = '';

            // SweetAlert if available
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'success',
                    title: '¡Guardado!',
                    text: 'Su pregunta secreta ha sido actualizada correctamente.',
                    confirmButtonColor: '#2d5a47',
                    timer: 3000,
                    timerProgressBar: true
                });
            }
        } catch (err) {
            console.error('Error al actualizar pregunta secreta:', err);
            this.showMessage('error', err.message || 'Error al guardar la pregunta secreta. Intente nuevamente.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = '💾 Guardar Pregunta Secreta';
            saveBtn.style.opacity = '1';
        }
    }

    applyColorblindMode(mode) {
        const html = document.documentElement;
        html.classList.remove('daltonismo-protanopia', 'daltonismo-deuteranopia', 'daltonismo-tritanopia');
        if (mode !== 'none') {
            html.classList.add(`daltonismo-${mode}`);
        }
        localStorage.setItem('daltonismo-mode', mode);
    }

    applyFontSize(size) {
        const html = document.documentElement;
        html.style.setProperty('--app-font-size', `${size}px`);
        if (parseInt(size) !== 14) {
            html.classList.add('app-font-custom');
        } else {
            html.classList.remove('app-font-custom');
        }
        localStorage.setItem('app-font-size', size);
    }
}
