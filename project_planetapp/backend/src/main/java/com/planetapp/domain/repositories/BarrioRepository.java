package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Barrio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarrioRepository extends JpaRepository<Barrio, Long> {

    Optional<Barrio> findByCodigo(String codigo);

    List<Barrio> findByActivoTrue();

    @Query("SELECT b FROM Barrio b WHERE " +
            "LOWER(b.codigo) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(b.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(b.comuna) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Barrio> buscarPorTermino(@Param("termino") String termino);

    boolean existsByCodigo(String codigo);
}
