package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.MovimientoInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoInventarioRepository extends JpaRepository<MovimientoInventario, Long> {
    List<MovimientoInventario> findByMaterialIdOrderByFechaMovimientoDesc(Long materialId);
    List<MovimientoInventario> findAllByOrderByFechaMovimientoDesc();
}
