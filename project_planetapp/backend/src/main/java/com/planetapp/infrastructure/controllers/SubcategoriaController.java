package com.planetapp.infrastructure.controllers;

import com.planetapp.application.services.SubcategoriaService;
import com.planetapp.domain.entities.Subcategoria;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/subcategorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubcategoriaController {

    private final SubcategoriaService service;

    @GetMapping
    public ResponseEntity<List<Subcategoria>> getAll() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/activas")
    public ResponseEntity<List<Subcategoria>> getActivas() {
        return ResponseEntity.ok(service.listarActivas());
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<Subcategoria>> getByCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(service.listarPorCategoria(categoriaId));
    }

    @PostMapping
    public ResponseEntity<Subcategoria> create(@RequestBody Subcategoria subcategoria) {
        return ResponseEntity.ok(service.guardar(subcategoria));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Subcategoria> update(@PathVariable Long id, @RequestBody Subcategoria subcategoria) {
        return ResponseEntity.ok(service.actualizar(id, subcategoria));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
