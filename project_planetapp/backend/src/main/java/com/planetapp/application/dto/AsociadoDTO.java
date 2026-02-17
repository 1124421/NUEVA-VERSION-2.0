package com.planetapp.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AsociadoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String documento;
    private String telefono;
    private String email;
    private String direccion;
    private LocalDate fechaRegistro;
    private Boolean activo;
    private LocalDate fechaInicio;
    private String tipoContrato;
    private String cargo;
    private String tipo;
}
