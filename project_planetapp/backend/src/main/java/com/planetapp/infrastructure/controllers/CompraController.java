package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.CompraDTO;
import com.planetapp.application.services.CompraService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/compras")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Compras", description = "API para gestión de compras a asociados")
public class CompraController {

    private final CompraService compraService;

    @GetMapping
    @Operation(summary = "Obtener todas las compras")
    public ResponseEntity<List<CompraDTO>> obtenerTodas() {
        return ResponseEntity.ok(compraService.obtenerTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener compra por ID")
    public ResponseEntity<CompraDTO> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(compraService.obtenerPorId(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @Operation(summary = "Registrar nueva compra")
    public ResponseEntity<CompraDTO> crear(@RequestBody CompraDTO compraDTO) {
        try {
            CompraDTO creada = compraService.crear(compraDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/cancelar")
    @Operation(summary = "Cancelar compra - NO elimina, solo cambia estado")
    public ResponseEntity<String> cancelar(@PathVariable Long id) {
        try {
            compraService.cancelar(id);
            return ResponseEntity.ok("Compra cancelada correctamente. El historial se conserva.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar compra - NO PERMITIDO")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        try {
            compraService.eliminar(id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("No se permite eliminación de transacciones. Use PATCH /compras/{id}/cancelar");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }
}
