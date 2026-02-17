package com.planetapp.application.services;

import com.planetapp.domain.entities.Categoria;
import com.planetapp.domain.repositories.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository repository;

    public List<Categoria> listarTodas() {
        return repository.findAll();
    }

    public List<Categoria> listarActivas() {
        return repository.findByActivoTrue();
    }

    public Categoria guardar(Categoria categoria) {
        return repository.save(categoria);
    }

    public Categoria actualizar(Long id, Categoria data) {
        Categoria cat = repository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        cat.setNombre(data.getNombre());
        cat.setDescripcion(data.getDescripcion());
        cat.setActivo(data.getActivo());
        return repository.save(cat);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
