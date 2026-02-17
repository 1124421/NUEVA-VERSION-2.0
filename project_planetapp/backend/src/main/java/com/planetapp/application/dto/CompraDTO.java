package com.planetapp.application.dto;

import com.planetapp.domain.entities.EstadoTransaccion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompraDTO {
    private Long id;
    private Long asociadoId;
    private String asociadoNombre;
    private Long materialId;
    private String materialNombre;
    private Double cantidad;
    private Double precioUnitario;
    private Double total;
    private EstadoTransaccion estado;
    private LocalDateTime fechaCompra;
    private String observaciones;
    private String carreta;
    private String ruta;
    private Double rechazado;
}
