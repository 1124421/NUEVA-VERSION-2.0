package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Compra;
import com.planetapp.domain.entities.EstadoTransaccion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByAsociadoId(Long asociadoId);

    boolean existsByAsociadoId(Long asociadoId);

    long countByEstado(EstadoTransaccion estado);

    @Query("SELECT c.material.nombre, SUM(c.cantidad) FROM Compra c WHERE c.estado = 'COMPLETADA' GROUP BY c.material.nombre ORDER BY SUM(c.cantidad) DESC")
    List<Object[]> findTopComprados();

    List<Compra> findAllByOrderByFechaCompraDesc();

    @Query("SELECT c FROM Compra c LEFT JOIN FETCH c.material LEFT JOIN FETCH c.asociado ORDER BY c.fechaCompra DESC")
    List<Compra> findAllWithDetailsOrderByFechaCompraDesc();
}
