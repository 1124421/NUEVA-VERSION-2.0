package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.MaterialDTO;
import com.planetapp.application.services.MaterialService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/materiales")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Materiales", description = "API para gestión de materiales")
public class MaterialController {

    private final MaterialService materialService;

    @GetMapping
    @Operation(summary = "Obtener todos los materiales")
    public ResponseEntity<List<MaterialDTO>> obtenerTodos() {
        return ResponseEntity.ok(materialService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener material por ID")
    public ResponseEntity<MaterialDTO> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(materialService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Crear nuevo material")
    public ResponseEntity<MaterialDTO> crear(@RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO creado = materialService.crear(materialDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar material existente")
    public ResponseEntity<MaterialDTO> actualizar(
            @PathVariable Long id,
            @RequestBody MaterialDTO materialDTO) {
        try {
            MaterialDTO actualizado = materialService.actualizar(id, materialDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar material")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            materialService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar materiales por nombre")
    public ResponseEntity<List<MaterialDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(materialService.buscarPorNombre(nombre));
    }

    @GetMapping("/stock-bajo")
    @Operation(summary = "Obtener materiales con stock bajo")
    public ResponseEntity<List<MaterialDTO>> obtenerStockBajo(@RequestParam(defaultValue = "10") Double cantidad) {
        return ResponseEntity.ok(materialService.obtenerStockBajo(cantidad));
    }

    @PatchMapping("/{id}/desactivar")
    @Operation(summary = "Desactivar material")
    public ResponseEntity<MaterialDTO> desactivar(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(materialService.desactivar(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/activos")
    @Operation(summary = "Obtener materiales activos")
    public ResponseEntity<List<MaterialDTO>> obtenerActivos() {
        return ResponseEntity.ok(materialService.obtenerActivos());
    }
}
