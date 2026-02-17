package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Asociado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsociadoRepository extends JpaRepository<Asociado, Long> {
    Optional<Asociado> findByDocumento(String documento);

    List<Asociado> findByActivoTrue();

    @Query("SELECT a FROM Asociado a WHERE " +
            "LOWER(a.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(a.apellido) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(CONCAT(a.nombre, ' ', a.apellido)) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(a.documento) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(a.email) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Asociado> buscarPorTermino(@Param("termino") String termino);

    boolean existsByDocumento(String documento);
}
