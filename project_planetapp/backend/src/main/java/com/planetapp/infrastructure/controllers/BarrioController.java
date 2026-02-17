package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.BarrioDTO;
import com.planetapp.application.services.BarrioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/barrios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Barrios", description = "API para gestión de barrios y comunas")
public class BarrioController {

    private final BarrioService barrioService;

    @GetMapping
    @Operation(summary = "Obtener todos los barrios")
    public ResponseEntity<List<BarrioDTO>> obtenerTodos() {
        return ResponseEntity.ok(barrioService.obtenerTodos());
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar barrios por código, nombre o comuna")
    public ResponseEntity<List<BarrioDTO>> buscar(@RequestParam String termino) {
        return ResponseEntity.ok(barrioService.buscar(termino));
    }

    @PostMapping
    @Operation(summary = "Crear nuevo barrio")
    public ResponseEntity<BarrioDTO> crear(@RequestBody BarrioDTO dto) {
        try {
            BarrioDTO creado = barrioService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
