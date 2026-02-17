package com.planetapp.application.services;

import com.planetapp.domain.entities.Subcategoria;
import com.planetapp.domain.entities.Categoria;
import com.planetapp.domain.repositories.SubcategoriaRepository;
import com.planetapp.domain.repositories.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubcategoriaService {

    private final SubcategoriaRepository repository;
    private final CategoriaRepository categoriaRepository;

    public List<Subcategoria> listarTodas() {
        return repository.findAll();
    }

    public List<Subcategoria> listarActivas() {
        return repository.findByActivoTrue();
    }

    public List<Subcategoria> listarPorCategoria(Long categoriaId) {
        return repository.findByCategoriaIdAndActivoTrue(categoriaId);
    }

    public Subcategoria guardar(Subcategoria subcategoria) {
        if (subcategoria.getCategoria() != null && subcategoria.getCategoria().getId() != null) {
            Categoria cat = categoriaRepository.findById(subcategoria.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            subcategoria.setCategoria(cat);
        }
        return repository.save(subcategoria);
    }

    public Subcategoria actualizar(Long id, Subcategoria data) {
        Subcategoria sub = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
        sub.setNombre(data.getNombre());
        sub.setDescripcion(data.getDescripcion());
        sub.setActivo(data.getActivo());
        if (data.getCategoria() != null && data.getCategoria().getId() != null) {
            Categoria cat = categoriaRepository.findById(data.getCategoria().getId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            sub.setCategoria(cat);
        }
        return repository.save(sub);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
