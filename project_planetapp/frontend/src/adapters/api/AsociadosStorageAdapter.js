/**
 * Adaptador API: CRUD de Asociados contra el backend REST.
 * Implementa AsociadosPort. Conecta con GET/POST/PUT/DELETE /api/asociados.
 */

import { Asociado } from '../../core/domain/Asociado.js';

const API_URL = 'http://localhost:8082/api/asociados';

/**
 * Mapea un objeto del backend (AsociadoDTO) a un Asociado del dominio frontend.
 */
function fromBackend(dto) {
  return new Asociado({
    nombre: dto.nombre || '',
    documento: dto.documento || '',
    contacto: dto.telefono || dto.email || '',
    fechaInicio: dto.fechaRegistro || '',
    contrato: '',
    cargo: '',
    idUnico: dto.id != null ? String(dto.id) : '',
    tipoAsociado: dto.activo ? 'Activo' : 'Inactivo',
    ingresos: '',
    // Preserve backend fields for round-trip
    _backendId: dto.id,
    _apellido: dto.apellido || '',
    _email: dto.email || '',
    _direccion: dto.direccion || '',
  });
}

/**
 * Mapea un Asociado del dominio frontend a un DTO para el backend.
 */
function toBackend(asociado) {
  return {
    nombre: asociado.nombre,
    apellido: asociado._apellido || '',
    documento: asociado.documento,
    telefono: asociado.contacto,
    email: asociado._email || '',
    direccion: asociado._direccion || '',
    fechaRegistro: asociado.fechaInicio || null,
    activo: asociado.tipoAsociado !== 'Inactivo',
  };
}

/**
 * @implements {import('../../core/ports/AsociadosPort.js').AsociadosPort}
 */
export class AsociadosStorageAdapter {
  async list() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error HTTP ' + response.status);
      const data = await response.json();
      return (data || []).map(fromBackend);
    } catch (err) {
      console.error('[AsociadosAdapter] Error al listar:', err);
      return [];
    }
  }

  async create(asociado) {
    const body = toBackend(asociado);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al crear asociado');
    }
    const created = await response.json();
    return fromBackend(created);
  }

  async update(id, asociado) {
    const body = toBackend(asociado);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Error al actualizar asociado');
    }
    const updated = await response.json();
    return fromBackend(updated);
  }

  async delete(id) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok && response.status !== 204) {
      const text = await response.text();
      throw new Error(text || 'Error al eliminar asociado');
    }
  }
}
