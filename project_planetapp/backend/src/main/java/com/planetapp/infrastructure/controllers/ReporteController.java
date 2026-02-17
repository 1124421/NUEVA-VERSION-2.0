package com.planetapp.infrastructure.controllers;

import com.planetapp.application.services.ReporteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reportes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Reportes", description = "API para estadísticas y reportes del dashboard")
public class ReporteController {

    private final ReporteService reporteService;

    @GetMapping("/dashboard-stats")
    @Operation(summary = "Obtener estadísticas del dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        return ResponseEntity.ok(reporteService.getDashboardStats());
    }

    @GetMapping("/top-vendidos")
    @Operation(summary = "Obtener materiales más vendidos")
    public ResponseEntity<List<Map<String, Object>>> getTopVendidos() {
        return ResponseEntity.ok(reporteService.getTopVendidos());
    }

    @GetMapping("/top-comprados")
    @Operation(summary = "Obtener materiales más comprados")
    public ResponseEntity<List<Map<String, Object>>> getTopComprados() {
        return ResponseEntity.ok(reporteService.getTopComprados());
    }

    @GetMapping("/transacciones-recientes")
    @Operation(summary = "Obtener últimas transacciones (compras + ventas)")
    public ResponseEntity<List<Map<String, Object>>> getTransaccionesRecientes() {
        return ResponseEntity.ok(reporteService.getTransaccionesRecientes());
    }

    @GetMapping("/informes")
    @Operation(summary = "Obtener informe completo de todas las transacciones")
    public ResponseEntity<List<Map<String, Object>>> getInformes() {
        return ResponseEntity.ok(reporteService.getInformes());
    }
}
