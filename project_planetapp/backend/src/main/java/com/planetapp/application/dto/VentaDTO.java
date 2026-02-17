package com.planetapp.application.dto;

import com.planetapp.domain.entities.EstadoTransaccion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VentaDTO {
    private Long id;
    private Long materialId;
    private String materialNombre;
    private Double cantidad;
    private Double precioUnitario;
    private Double total;
    private EstadoTransaccion estado;
    private LocalDateTime fechaVenta;
    private String cliente;
    private String clienteDocumento;
    private String observaciones;
}
