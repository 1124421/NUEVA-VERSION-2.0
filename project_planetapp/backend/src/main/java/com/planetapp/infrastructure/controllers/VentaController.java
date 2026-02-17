package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.VentaDTO;
import com.planetapp.application.services.VentaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ventas")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Ventas", description = "API para gestión de ventas de materiales")
public class VentaController {

    private final VentaService ventaService;

    @GetMapping
    @Operation(summary = "Obtener todas las ventas")
    public ResponseEntity<List<VentaDTO>> obtenerTodas() {
        return ResponseEntity.ok(ventaService.obtenerTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener venta por ID")
    public ResponseEntity<VentaDTO> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ventaService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Registrar nueva venta")
    public ResponseEntity<VentaDTO> crear(@RequestBody VentaDTO ventaDTO) {
        try {
            VentaDTO creada = ventaService.crear(ventaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar venta - NO elimina, solo cambia estado")
    public ResponseEntity<String> cancelar(@PathVariable Long id) {
        try {
            ventaService.cancelar(id);
            return ResponseEntity.ok("Venta cancelada correctamente. El historial se conserva.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar venta - NO PERMITIDO")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            ventaService.eliminar(id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No se permite eliminación de transacciones. Use PATCH /ventas/{id}/cancelar");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
