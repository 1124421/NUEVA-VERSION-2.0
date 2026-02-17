package com.planetapp.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BarrioDTO {
    private Long id;
    private String codigo;
    private String nombre;
    private String comuna;
    private Boolean activo;
}
