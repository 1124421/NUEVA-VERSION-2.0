package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.EstadoTransaccion;
import com.planetapp.domain.entities.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByMaterialId(Long materialId);

    long countByEstado(EstadoTransaccion estado);

    @Query("SELECT v.material.nombre, SUM(v.cantidad) FROM Venta v WHERE v.estado = 'COMPLETADA' GROUP BY v.material.nombre ORDER BY SUM(v.cantidad) DESC")
    List<Object[]> findTopVendidos();

    List<Venta> findAllByOrderByFechaVentaDesc();

    @Query("SELECT v FROM Venta v LEFT JOIN FETCH v.material ORDER BY v.fechaVenta DESC")
    List<Venta> findAllWithDetailsOrderByFechaVentaDesc();
}
