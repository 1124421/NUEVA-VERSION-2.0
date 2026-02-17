// API Base URL
const API_URL = 'http://localhost:8082/api/auth';

// Función de registro (con pregunta secreta)
async function register(nombre, email, password, rol, preguntaSecreta, respuestaSecreta) {
    try {
        const response = await fetch(API_URL + '/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password, rol, preguntaSecreta, respuestaSecreta })
        });

        if (response.ok) {
            var user = await response.json();
            return { success: true, user: user };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'Error al registrar usuario' };
        }
    } catch (error) {
        console.error('Error en registro:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Función de login
async function login(email, password) {
    try {
        var response = await fetch(API_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        if (response.ok) {
            var user = await response.json();
            localStorage.setItem('user-id', user.id);
            localStorage.setItem('user-name', user.nombre);
            localStorage.setItem('user-email', user.email);
            localStorage.setItem('user-role', user.rol);
            localStorage.setItem('user-telefono', user.telefono || '');
            return { success: true, user: user };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'Credenciales inválidas' };
        }
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Función de logout
function logout() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-email');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-telefono');
    localStorage.removeItem('planetapp_user');
    window.location.replace('../index.html');
}

// Verificar si el usuario está logueado
function checkAuth() {
    var userId = localStorage.getItem('user-id');
    if (!userId) {
        window.location.replace('../index.html');
        return false;
    }
    return true;
}

// Obtener datos del usuario actual
function getCurrentUser() {
    return {
        id: localStorage.getItem('user-id'),
        nombre: localStorage.getItem('user-name'),
        email: localStorage.getItem('user-email'),
        rol: localStorage.getItem('user-role'),
        telefono: localStorage.getItem('user-telefono')
    };
}

// Función para actualizar perfil
async function updateProfile(id, data) {
    try {
        var response = await fetch(API_URL + '/profile/' + id, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            var user = await response.json();
            localStorage.setItem('user-name', user.nombre);
            localStorage.setItem('user-email', user.email);
            localStorage.setItem('user-telefono', user.telefono || '');
            return { success: true, user: user };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'Error al actualizar perfil' };
        }
    } catch (error) {
        console.error('Error actualizando perfil:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Obtener pregunta secreta por email
async function getSecretQuestion(email) {
    try {
        var response = await fetch(API_URL + '/secret-question?email=' + encodeURIComponent(email));
        if (response.ok) {
            var data = await response.json();
            return { success: true, preguntaSecreta: data.preguntaSecreta };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'No se encontró el usuario' };
        }
    } catch (error) {
        console.error('Error obteniendo pregunta:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Validar respuesta secreta (sin cambiar contraseña)
async function validateSecretAnswer(email, respuestaSecreta) {
    try {
        var response = await fetch(API_URL + '/validate-secret-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, respuestaSecreta: respuestaSecreta })
        });

        if (response.ok) {
            var data = await response.json();
            return { success: true, valid: data.valid, message: data.message || '' };
        } else {
            var errorText = await response.text();
            return { success: false, valid: false, message: errorText || 'Error al validar respuesta' };
        }
    } catch (error) {
        console.error('Error validando respuesta:', error);
        return { success: false, valid: false, message: 'Error de conexión con el servidor' };
    }
}

// Recuperar contraseña
async function recoverPassword(email, respuestaSecreta, newPassword) {
    try {
        var response = await fetch(API_URL + '/recover-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, respuestaSecreta: respuestaSecreta, newPassword: newPassword })
        });

        if (response.ok) {
            return { success: true };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'Error al recuperar contraseña' };
        }
    } catch (error) {
        console.error('Error recuperando contraseña:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}

// Actualizar pregunta secreta
async function updateSecretQuestion(userId, preguntaSecreta, respuestaSecreta) {
    try {
        var response = await fetch(API_URL + '/update-secret-question/' + userId, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preguntaSecreta: preguntaSecreta, respuestaSecreta: respuestaSecreta })
        });

        if (response.ok) {
            return { success: true };
        } else {
            var errorText = await response.text();
            return { success: false, message: errorText || 'Error al actualizar pregunta secreta' };
        }
    } catch (error) {
        console.error('Error actualizando pregunta secreta:', error);
        return { success: false, message: 'Error de conexión con el servidor' };
    }
}
