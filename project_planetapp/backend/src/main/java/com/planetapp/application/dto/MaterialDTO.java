package com.planetapp.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaterialDTO {
    private Long id;
    private String nombre;
    private String codigo;
    private Double precioCompra;
    private Double precioVenta;
    private Double stock;
    private Long categoriaId;
    private String categoriaNombre;
    private Long subcategoriaId;
    private String subcategoriaNombre;
    private String unidad;
    private String descripcion;
    private LocalDate fechaRegistro;
    private Boolean activo;
}
