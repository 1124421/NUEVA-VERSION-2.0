package com.planetapp.application.services;

import com.planetapp.application.dto.CompraDTO;
import com.planetapp.domain.entities.Asociado;
import com.planetapp.domain.entities.Compra;
import com.planetapp.domain.entities.EstadoTransaccion;
import com.planetapp.domain.entities.Material;
import com.planetapp.domain.repositories.AsociadoRepository;
import com.planetapp.domain.repositories.CompraRepository;
import com.planetapp.domain.repositories.MaterialRepository;
import com.planetapp.domain.entities.MovimientoInventario;
import com.planetapp.domain.entities.TipoMovimiento;
import com.planetapp.domain.repositories.MovimientoInventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompraService {

    private final CompraRepository compraRepository;
    private final AsociadoRepository asociadoRepository;
    private final MaterialRepository materialRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    @Transactional(readOnly = true)
    public List<CompraDTO> obtenerTodas() {
        return compraRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CompraDTO obtenerPorId(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada con id: " + id));
        return convertirADTO(compra);
    }

    @Transactional
    public CompraDTO crear(CompraDTO dto) {
        Asociado asociado = asociadoRepository.findById(dto.getAsociadoId())
                .orElseThrow(() -> new RuntimeException("Asociado no encontrado"));
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        Compra compra = new Compra();
        compra.setAsociado(asociado);
        compra.setMaterial(material);
        compra.setCantidad(dto.getCantidad());
        compra.setPrecioUnitario(dto.getPrecioUnitario());
        compra.setTotal(dto.getCantidad() * dto.getPrecioUnitario());
        compra.setEstado(EstadoTransaccion.COMPLETADA);
        compra.setObservaciones(dto.getObservaciones());
        compra.setCarreta(dto.getCarreta());
        compra.setRuta(dto.getRuta());
        compra.setRechazado(dto.getRechazado());

        Compra guardada = compraRepository.save(compra);

        // Inventario automático: SUMAR stock al material
        Double stockAnterior = material.getStock();
        material.setStock(stockAnterior + dto.getCantidad());
        materialRepository.save(material);

        // Registrar Movimiento de Inventario
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setMaterial(material);
        movimiento.setTipoMovimiento(TipoMovimiento.COMPRA);
        movimiento.setCantidad(dto.getCantidad());
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockActual(material.getStock());
        movimiento.setPrecioUnitario(dto.getPrecioUnitario());
        movimiento.setUsuario("Sistema");
        movimiento.setObservacion("Compra ID: " + guardada.getId() + " - Asociado: " + asociado.getNombre());
        movimientoInventarioRepository.save(movimiento);

        return convertirADTO(guardada);
    }

    @Transactional
    public void cancelar(Long id) {
        Compra compra = compraRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada con id: " + id));

        if (compra.getEstado() == EstadoTransaccion.CANCELADA) {
            throw new RuntimeException("La compra ya está cancelada");
        }

        // Inventario automático: RESTAR stock (revertir la compra)
        Material material = compra.getMaterial();
        Double stockAnterior = material.getStock();
        material.setStock(Math.max(0, stockAnterior - compra.getCantidad()));
        materialRepository.save(material);

        // Registrar Movimiento de Inventario (Ajuste por cancelación)
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setMaterial(material);
        movimiento.setTipoMovimiento(TipoMovimiento.AJUSTE);
        movimiento.setCantidad(-compra.getCantidad());
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockActual(material.getStock());
        movimiento.setPrecioUnitario(compra.getPrecioUnitario());
        movimiento.setUsuario("Sistema");
        movimiento.setObservacion("Cancelación Compra ID: " + compra.getId());
        movimientoInventarioRepository.save(movimiento);

        compra.setEstado(EstadoTransaccion.CANCELADA);
        compraRepository.save(compra);
    }

    @Transactional
    public void eliminar(Long id) {
        throw new RuntimeException("No se permite eliminación de transacciones. Use el método cancelar.");
    }

    private CompraDTO convertirADTO(Compra compra) {
        CompraDTO dto = new CompraDTO();
        dto.setId(compra.getId());
        dto.setAsociadoId(compra.getAsociado().getId());
        dto.setAsociadoNombre(compra.getAsociado().getNombre() + " " + compra.getAsociado().getApellido());
        dto.setMaterialId(compra.getMaterial().getId());
        dto.setMaterialNombre(compra.getMaterial().getNombre());
        dto.setCantidad(compra.getCantidad());
        dto.setPrecioUnitario(compra.getPrecioUnitario());
        dto.setTotal(compra.getTotal());
        dto.setEstado(compra.getEstado());
        dto.setFechaCompra(compra.getFechaCompra());
        dto.setObservaciones(compra.getObservaciones());
        dto.setCarreta(compra.getCarreta());
        dto.setRuta(compra.getRuta());
        dto.setRechazado(compra.getRechazado());
        return dto;
    }
}
