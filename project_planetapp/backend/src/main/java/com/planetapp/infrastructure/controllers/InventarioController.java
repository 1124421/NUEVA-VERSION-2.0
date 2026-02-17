package com.planetapp.infrastructure.controllers;

import com.planetapp.domain.entities.MovimientoInventario;
import com.planetapp.domain.repositories.MovimientoInventarioRepository;
import com.planetapp.domain.repositories.MaterialRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/inventario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Tag(name = "Inventario", description = "API para consultar movimientos de inventario")
public class InventarioController {

    private final MovimientoInventarioRepository movimientoRepository;
    private final MaterialRepository materialRepository;

    @GetMapping("/movimientos")
    @Operation(summary = "Obtener historial completo de movimientos de inventario")
    public ResponseEntity<List<Map<String, Object>>> getMovimientos() {
        List<MovimientoInventario> movimientos = movimientoRepository.findAllByOrderByFechaMovimientoDesc();

        List<Map<String, Object>> result = movimientos.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", m.getId());
            map.put("materialId", m.getMaterial().getId());
            map.put("codigo", m.getMaterial().getCodigo());
            map.put("material", m.getMaterial().getNombre());
            map.put("subcategoria", m.getMaterial().getSubcategoria() != null
                    ? m.getMaterial().getSubcategoria().getNombre() : "—");
            map.put("stockAnterior", m.getStockAnterior());
            map.put("stockActual", m.getStockActual());
            map.put("cantidad", m.getCantidad());
            map.put("tipo", m.getTipoMovimiento().name());
            map.put("precioUnitario", m.getPrecioUnitario());
            map.put("fecha", m.getFechaMovimiento().toString());
            map.put("observacion", m.getObservacion());
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/stock")
    @Operation(summary = "Obtener stock actual de todos los materiales")
    public ResponseEntity<List<Map<String, Object>>> getStock() {
        List<Map<String, Object>> result = materialRepository.findAll().stream()
                .filter(m -> m.getActivo())
                .map(m -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", m.getId());
                    map.put("codigo", m.getCodigo());
                    map.put("nombre", m.getNombre());
                    map.put("stock", m.getStock());
                    map.put("precioCompra", m.getPrecioCompra());
                    map.put("precioVenta", m.getPrecioVenta());
                    map.put("subcategoria", m.getSubcategoria() != null
                            ? m.getSubcategoria().getNombre() : "—");
                    map.put("categoria", m.getCategoria() != null
                            ? m.getCategoria().getNombre() : "—");
                    return map;
                }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
