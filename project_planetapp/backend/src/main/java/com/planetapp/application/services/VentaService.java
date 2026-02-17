package com.planetapp.application.services;

import com.planetapp.application.dto.VentaDTO;
import com.planetapp.domain.entities.EstadoTransaccion;
import com.planetapp.domain.entities.Material;
import com.planetapp.domain.entities.Venta;
import com.planetapp.domain.repositories.MaterialRepository;
import com.planetapp.domain.repositories.VentaRepository;
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
public class VentaService {

    private final VentaRepository ventaRepository;
    private final MaterialRepository materialRepository;
    private final MovimientoInventarioRepository movimientoInventarioRepository;

    @Transactional(readOnly = true)
    public List<VentaDTO> obtenerTodas() {
        return ventaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public VentaDTO obtenerPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con id: " + id));
        return convertirADTO(venta);
    }

    @Transactional
    public VentaDTO crear(VentaDTO dto) {
        Material material = materialRepository.findById(dto.getMaterialId())
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));

        // Validar stock suficiente
        if (material.getStock() < dto.getCantidad()) {
            throw new RuntimeException("Stock insuficiente. Disponible: " + material.getStock() + " KG");
        }

        Venta venta = new Venta();
        venta.setMaterial(material);
        venta.setCantidad(dto.getCantidad());
        venta.setPrecioUnitario(dto.getPrecioUnitario());
        venta.setTotal(dto.getCantidad() * dto.getPrecioUnitario());
        venta.setEstado(EstadoTransaccion.COMPLETADA);
        venta.setCliente(dto.getCliente());
        venta.setClienteDocumento(dto.getClienteDocumento());
        venta.setObservaciones(dto.getObservaciones());

        Venta guardada = ventaRepository.save(venta);

        // Inventario automático: RESTAR stock del material
        Double stockAnterior = material.getStock();
        material.setStock(stockAnterior - dto.getCantidad());
        materialRepository.save(material);

        // Registrar Movimiento de Inventario
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setMaterial(material);
        movimiento.setTipoMovimiento(TipoMovimiento.VENTA);
        movimiento.setCantidad(-dto.getCantidad());
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockActual(material.getStock());
        movimiento.setPrecioUnitario(dto.getPrecioUnitario());
        movimiento.setUsuario("Sistema");
        movimiento.setObservacion("Venta ID: " + guardada.getId() + " - Cliente: " + dto.getCliente());
        movimientoInventarioRepository.save(movimiento);

        return convertirADTO(guardada);
    }

    @Transactional
    public void cancelar(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada con id: " + id));

        if (venta.getEstado() == EstadoTransaccion.CANCELADA) {
            throw new RuntimeException("La venta ya está cancelada");
        }

        // Inventario automático: DEVOLVER stock al material
        Material material = venta.getMaterial();
        Double stockAnterior = material.getStock();
        material.setStock(stockAnterior + venta.getCantidad());
        materialRepository.save(material);

        // Registrar Movimiento de Inventario (Ajuste por cancelación)
        MovimientoInventario movimiento = new MovimientoInventario();
        movimiento.setMaterial(material);
        movimiento.setTipoMovimiento(TipoMovimiento.AJUSTE);
        movimiento.setCantidad(venta.getCantidad());
        movimiento.setStockAnterior(stockAnterior);
        movimiento.setStockActual(material.getStock());
        movimiento.setPrecioUnitario(venta.getPrecioUnitario());
        movimiento.setUsuario("Sistema");
        movimiento.setObservacion("Cancelación Venta ID: " + venta.getId());
        movimientoInventarioRepository.save(movimiento);

        venta.setEstado(EstadoTransaccion.CANCELADA);
        ventaRepository.save(venta);
    }

    @Transactional
    public void eliminar(Long id) {
        throw new RuntimeException("No se permite eliminación de transacciones. Use el método cancelar.");
    }

    private VentaDTO convertirADTO(Venta venta) {
        VentaDTO dto = new VentaDTO();
        dto.setId(venta.getId());
        dto.setMaterialId(venta.getMaterial().getId());
        dto.setMaterialNombre(venta.getMaterial().getNombre());
        dto.setCantidad(venta.getCantidad());
        dto.setPrecioUnitario(venta.getPrecioUnitario());
        dto.setTotal(venta.getTotal());
        dto.setEstado(venta.getEstado());
        dto.setFechaVenta(venta.getFechaVenta());
        dto.setCliente(venta.getCliente());
        dto.setClienteDocumento(venta.getClienteDocumento());
        dto.setObservaciones(venta.getObservaciones());
        return dto;
    }
}
