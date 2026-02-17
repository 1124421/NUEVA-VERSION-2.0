package com.planetapp.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "asociados")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Asociado {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 100)
    private String nombre;
    
    @Column(nullable = false, length = 100)
    private String apellido;
    
    @Column(nullable = false, unique = true, length = 20)
    private String documento;
    
    @Column(length = 20)
    private String telefono;
    
    @Column(length = 100)
    private String email;
    
    @Column(length = 200)
    private String direccion;
    
    @Column(nullable = false)
    private LocalDate fechaRegistro;
    
    @Column(nullable = false)
    private Boolean activo = true;

    @Column
    private LocalDate fechaInicio;

    @Column(length = 100)
    private String tipoContrato;

    @Column(length = 100)
    private String cargo;

    @Column(length = 100)
    private String tipo;
    
    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDate.now();
        }
        if (fechaInicio == null) {
            fechaInicio = LocalDate.now();
        }
        if (activo == null) {
            activo = true;
        }
    }
}
