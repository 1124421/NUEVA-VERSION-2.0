package com.planetapp.domain.entities;

/**
 * Estado para transacciones (Compra, Venta)
 * Las transacciones NO se eliminan, solo se cancelan
 */
public enum EstadoTransaccion {
    COMPLETADA,
    CANCELADA
}
