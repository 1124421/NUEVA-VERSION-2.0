package com.planetapp.domain.repositories;

import com.planetapp.domain.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByDocumento(String documento);

    @Query("SELECT c FROM Cliente c WHERE " +
            "LOWER(c.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(c.documento) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Cliente> buscarPorTermino(@Param("termino") String termino);

    List<Cliente> findByActivoTrue();
}
