package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {

    List<Material> findByNombreContainingIgnoreCase(String nombre);

    List<Material> findByStockLessThan(Double stock);

    List<Material> findByActivoTrue();

    java.util.Optional<Material> findByCodigo(String codigo);
}
