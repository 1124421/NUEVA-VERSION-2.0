/**
 * Entidad de dominio: Asociado
 * Solo reglas de negocio, sin DOM ni fetch.
 */
export class Asociado {
  /**
   * @param {Object} data
   */
  constructor({
    nombre = '',
    documento = '',
    contacto = '',
    fechaInicio = '',
    contrato = '',
    cargo = '',
    idUnico = '',
    tipoAsociado = '',
    ingresos = '',
    _backendId = null,
    _apellido = '',
    _email = '',
    _direccion = '',
  } = {}) {
    this.nombre = String(nombre).trim();
    this.documento = String(documento).trim();
    this.contacto = String(contacto).trim();
    this.fechaInicio = fechaInicio || '';
    this.contrato = String(contrato).trim();
    this.cargo = String(cargo).trim();
    this.idUnico = String(idUnico).trim();
    this.tipoAsociado = String(tipoAsociado).trim();
    this.ingresos = ingresos ?? '';
    // Backend round-trip fields
    this._backendId = _backendId;
    this._apellido = _apellido;
    this._email = _email;
    this._direccion = _direccion;
  }

  /**
   * @returns {boolean}
   */
  isValid() {
    return Boolean(this.nombre && this.documento && this.contacto);
  }

  /**
   * @returns {Object}
   */
  toJSON() {
    return {
      nombre: this.nombre,
      documento: this.documento,
      contacto: this.contacto,
      fechaInicio: this.fechaInicio,
      contrato: this.contrato,
      cargo: this.cargo,
      idUnico: this.idUnico,
      tipoAsociado: this.tipoAsociado,
      ingresos: this.ingresos,
    };
  }

  /**
   * @param {Object} data
   * @returns {Asociado}
   */
  static fromJSON(data) {
    return new Asociado(data);
  }
}
