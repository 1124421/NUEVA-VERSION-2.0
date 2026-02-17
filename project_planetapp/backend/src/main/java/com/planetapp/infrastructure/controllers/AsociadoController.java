package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.AsociadoDTO;
import com.planetapp.application.services.AsociadoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/asociados")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Asociados", description = "API para gestión de asociados")
public class AsociadoController {

    private final AsociadoService asociadoService;

    @GetMapping
    @Operation(summary = "Obtener todos los asociados")
    public ResponseEntity<List<AsociadoDTO>> obtenerTodos() {
        return ResponseEntity.ok(asociadoService.obtenerTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener asociado por ID")
    public ResponseEntity<AsociadoDTO> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(asociadoService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/documento/{documento}")
    @Operation(summary = "Obtener asociado por documento")
    public ResponseEntity<AsociadoDTO> obtenerPorDocumento(@PathVariable String documento) {
        try {
            return ResponseEntity.ok(asociadoService.obtenerPorDocumento(documento));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Crear nuevo asociado")
    public ResponseEntity<AsociadoDTO> crear(@RequestBody AsociadoDTO asociadoDTO) {
        try {
            AsociadoDTO creado = asociadoService.crear(asociadoDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar asociado existente")
    public ResponseEntity<AsociadoDTO> actualizar(
            @PathVariable Long id,
            @RequestBody AsociadoDTO asociadoDTO) {
        try {
            AsociadoDTO actualizado = asociadoService.actualizar(id, asociadoDTO);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar asociado")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        try {
            asociadoService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/toggle-activo")
    @Operation(summary = "Activar/Desactivar asociado")
    public ResponseEntity<AsociadoDTO> toggleActivo(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(asociadoService.toggleActivo(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/activos")
    @Operation(summary = "Obtener asociados activos")
    public ResponseEntity<List<AsociadoDTO>> obtenerActivos() {
        return ResponseEntity.ok(asociadoService.obtenerActivos());
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar asociados por nombre")
    public ResponseEntity<List<AsociadoDTO>> buscarPorNombre(@RequestParam String nombre) {
        return ResponseEntity.ok(asociadoService.buscarPorNombre(nombre));
    }
}
