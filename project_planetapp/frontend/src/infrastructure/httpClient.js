/**
 * Cliente HTTP reutilizable (infraestructura).
 * Centraliza fetch para que los adaptadores no repitan lógica.
 */

/**
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function request(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });
  return response;
}

/**
 * GET y parsear JSON
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>}
 */
export async function getJSON(url, options = {}) {
  const res = await request(url, { ...options, method: 'GET' });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * POST con body JSON
 * @param {string} url
 * @param {Object} body
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
export async function postJSON(url, body, options = {}) {
  return request(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}
