package com.planetapp.domain.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "compras")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asociado_id", nullable = false)
    private Asociado asociado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(nullable = false)
    private Double cantidad; // en kg, litros, unidades según el material

    @Column(nullable = false)
    private Double precioUnitario;

    @Column(nullable = false)
    private Double total;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoTransaccion estado = EstadoTransaccion.COMPLETADA;

    @Column(nullable = false)
    private LocalDateTime fechaCompra;

    @Column(length = 500)
    private String observaciones;

    @Column(length = 100)
    private String carreta;

    @Column(length = 200)
    private String ruta;

    private Double rechazado;

    @PrePersist
    protected void onCreate() {
        if (fechaCompra == null) {
            fechaCompra = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoTransaccion.COMPLETADA;
        }
        if (total == null && cantidad != null && precioUnitario != null) {
            total = cantidad * precioUnitario;
        }
    }
}
