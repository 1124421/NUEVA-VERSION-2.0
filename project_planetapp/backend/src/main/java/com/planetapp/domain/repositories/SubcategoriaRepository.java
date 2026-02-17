package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Subcategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, Long> {
    List<Subcategoria> findByActivoTrue();

    List<Subcategoria> findByCategoriaIdAndActivoTrue(Long categoriaId);
}
