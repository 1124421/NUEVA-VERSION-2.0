/**
 * ApiClient — Centralized HTTP service for all backend API calls.
 * Base URL is relative (same origin, Spring Boot serves frontend files).
 */

async function request(url, options = {}) {
    try {
        const res = await fetch(url, {
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
        }
        if (res.status === 204) return null;
        return await res.json();
    } catch (err) {
        console.error(`[ApiClient] ${options.method || 'GET'} ${url}`, err);
        throw err;
    }
}

function buildResource(basePath) {
    return {
        getAll: () => request(basePath),
        getById: (id) => request(`${basePath}/${id}`),
        create: (data) => request(basePath, { method: 'POST', body: JSON.stringify(data) }),
        update: (id, data) => request(`${basePath}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        delete: (id) => request(`${basePath}/${id}`, { method: 'DELETE' }),
        toggleActivo: (id) => request(`${basePath}/${id}/toggle-activo`, { method: 'PATCH' }),
        getActivos: () => request(`${basePath}/activos`),
        buscar: (nombre) => request(`${basePath}/buscar?nombre=${encodeURIComponent(nombre)}`),
    };
}

export const ApiClient = {
    asociados: buildResource('/asociados'),
    clientes: buildResource('/clientes'),
    materiales: {
        ...buildResource('/materiales'),
        stockBajo: (cantidad) => request(`/materiales/stock-bajo?cantidad=${cantidad}`),
    },
    categorias: {
        ...buildResource('/categorias'),
        getActivas: () => request('/categorias/activas'),
    },
    compras: {
        getAll: () => request('/compras'),
        getById: (id) => request(`/compras/${id}`),
        create: (data) => request('/compras', { method: 'POST', body: JSON.stringify(data) }),
        cancelar: (id) => request(`/compras/${id}/cancelar`, { method: 'PATCH' }),
    },
    ventas: {
        getAll: () => request('/ventas'),
        getById: (id) => request(`/ventas/${id}`),
        create: (data) => request('/ventas', { method: 'POST', body: JSON.stringify(data) }),
        cancelar: (id) => request(`/ventas/${id}/cancelar`, { method: 'PATCH' }),
    },
    subcategorias: {
        ...buildResource('/subcategorias'),
        getByCategoria: (catId) => request(`/subcategorias/categoria/${catId}`)
    },
    reportes: {
        dashboardStats: () => request('/reportes/dashboard-stats'),
        topVendidos: () => request('/reportes/top-vendidos'),
        topComprados: () => request('/reportes/top-comprados'),
        transaccionesRecientes: () => request('/reportes/transacciones-recientes'),
        informes: () => request('/reportes/informes'),
    },
    barrios: {
        getAll: () => request('/barrios'),
        buscar: (termino) => request(`/barrios/buscar?termino=${encodeURIComponent(termino)}`),
        create: (data) => request('/barrios', { method: 'POST', body: JSON.stringify(data) }),
    },
    inventario: {
        movimientos: () => request('/inventario/movimientos'),
        stock: () => request('/inventario/stock'),
    },
    auth: {
        updateSecretQuestion: (userId, data) => request(`/api/auth/update-secret-question/${userId}`, { method: 'PUT', body: JSON.stringify(data) }),
    }
};
