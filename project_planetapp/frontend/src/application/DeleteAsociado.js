/**
 * Caso de uso: Eliminar asociado
 */

/**
 * @param {import('../core/ports/AsociadosPort.js').AsociadosPort} asociadosPort
 * @param {number|string} id
 * @returns {Promise<void>}
 */
export async function DeleteAsociado(asociadosPort, id) {
  return asociadosPort.delete(id);
}
