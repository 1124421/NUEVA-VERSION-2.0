/**
 * Entidad de dominio: Usuario
 * Solo reglas de negocio, sin dependencias del navegador.
 */
export class User {
  /**
   * @param {string} id
   * @param {string} nombre
   * @param {string} email
   * @param {string} rol
   */
  constructor({ id, nombre, email, rol }) {
    this.id = id ?? '';
    this.nombre = nombre ?? '';
    this.email = email ?? '';
    this.rol = rol ?? 'USER';
  }

  /**
   * @returns {boolean}
   */
  isValid() {
    return Boolean(this.id && this.email?.trim());
  }

  /**
   * @returns {Object} Objeto plano para persistencia
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      rol: this.rol,
    };
  }

  /**
   * @param {Object} data
   * @returns {User}
   */
  static fromJSON(data) {
    return new User({
      id: data?.id,
      nombre: data?.nombre,
      email: data?.email,
      rol: data?.rol,
    });
  }
}
