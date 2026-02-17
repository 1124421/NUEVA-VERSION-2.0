package com.planetapp.application.services;

import com.planetapp.domain.entities.EstadoTransaccion;
import com.planetapp.domain.entities.Compra;
import com.planetapp.domain.entities.Venta;
import com.planetapp.domain.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReporteService {

    private final AsociadoRepository asociadoRepository;
    private final MaterialRepository materialRepository;
    private final CompraRepository compraRepository;
    private final VentaRepository ventaRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAsociados", asociadoRepository.count());
        stats.put("totalVentas", ventaRepository.countByEstado(EstadoTransaccion.COMPLETADA));
        stats.put("totalCompras", compraRepository.countByEstado(EstadoTransaccion.COMPLETADA));
        stats.put("stockBajo", materialRepository.findByStockLessThan(10.0).size());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTopVendidos() {
        List<Object[]> rows = ventaRepository.findTopVendidos();
        List<Map<String, Object>> result = new ArrayList<>();
        int limit = Math.min(rows.size(), 6);
        for (int i = 0; i < limit; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", rows.get(i)[0]);
            item.put("cantidad", rows.get(i)[1]);
            result.add(item);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTopComprados() {
        List<Object[]> rows = compraRepository.findTopComprados();
        List<Map<String, Object>> result = new ArrayList<>();
        int limit = Math.min(rows.size(), 6);
        for (int i = 0; i < limit; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("nombre", rows.get(i)[0]);
            item.put("cantidad", rows.get(i)[1]);
            result.add(item);
        }
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTransaccionesRecientes() {
        List<Map<String, Object>> transactions = new ArrayList<>();

        // Get recent compras
        List<Compra> compras = compraRepository.findAllWithDetailsOrderByFechaCompraDesc();
        for (Compra c : compras) {
            Map<String, Object> tx = new HashMap<>();
            tx.put("id", c.getId());
            tx.put("tipo", "Compra");
            tx.put("material", c.getMaterial().getNombre());
            tx.put("cantidad", c.getCantidad());
            tx.put("total", c.getTotal());
            tx.put("fecha", c.getFechaCompra().toString());
            tx.put("estado", c.getEstado().name());
            tx.put("persona", c.getAsociado() != null
                    ? (c.getAsociado().getNombre() + " " + (c.getAsociado().getApellido() != null ? c.getAsociado().getApellido() : "")).trim()
                    : "N/A");
            transactions.add(tx);
        }

        // Get recent ventas
        List<Venta> ventas = ventaRepository.findAllWithDetailsOrderByFechaVentaDesc();
        for (Venta v : ventas) {
            Map<String, Object> tx = new HashMap<>();
            tx.put("id", v.getId());
            tx.put("tipo", "Venta");
            tx.put("material", v.getMaterial().getNombre());
            tx.put("cantidad", v.getCantidad());
            tx.put("total", v.getTotal());
            tx.put("fecha", v.getFechaVenta().toString());
            tx.put("estado", v.getEstado().name());
            tx.put("persona", v.getCliente() != null && !v.getCliente().isEmpty() ? v.getCliente() : "N/A");
            transactions.add(tx);
        }

        // Sort by date descending, take first 20
        transactions.sort((a, b) -> b.get("fecha").toString().compareTo(a.get("fecha").toString()));
        return transactions.stream().limit(20).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getInformes() {
        List<Map<String, Object>> transactions = new ArrayList<>();

        List<Compra> compras = compraRepository.findAllWithDetailsOrderByFechaCompraDesc();
        for (Compra c : compras) {
            Map<String, Object> tx = new HashMap<>();
            tx.put("id", c.getId());
            tx.put("tipo", "Compra");
            tx.put("material", c.getMaterial() != null ? c.getMaterial().getNombre() : "N/A");
            tx.put("cantidad", c.getCantidad());
            tx.put("precioUnitario", c.getPrecioUnitario());
            tx.put("total", c.getTotal());
            tx.put("fecha", c.getFechaCompra() != null ? c.getFechaCompra().toString() : "");
            tx.put("estado", c.getEstado() != null ? c.getEstado().name() : "");

            String persona = "N/A";
            String documento = "";
            if (c.getAsociado() != null) {
                persona = c.getAsociado().getNombre() + " "
                        + (c.getAsociado().getApellido() != null ? c.getAsociado().getApellido() : "");
                documento = c.getAsociado().getDocumento();
            }
            tx.put("persona", persona.trim());
            tx.put("documento", documento);

            tx.put("carreta", c.getCarreta());
            tx.put("ruta", c.getRuta());
            tx.put("rechazado", c.getRechazado());
            transactions.add(tx);
        }

        List<Venta> ventas = ventaRepository.findAllWithDetailsOrderByFechaVentaDesc();
        for (Venta v : ventas) {
            Map<String, Object> tx = new HashMap<>();
            tx.put("id", v.getId());
            tx.put("tipo", "Venta");
            tx.put("material", v.getMaterial() != null ? v.getMaterial().getNombre() : "N/A");
            tx.put("cantidad", v.getCantidad());
            tx.put("precioUnitario", v.getPrecioUnitario());
            tx.put("total", v.getTotal());
            tx.put("fecha", v.getFechaVenta() != null ? v.getFechaVenta().toString() : "");
            tx.put("estado", v.getEstado() != null ? v.getEstado().name() : "");
            tx.put("persona", v.getCliente() != null && !v.getCliente().isEmpty() ? v.getCliente() : "N/A");
            tx.put("documento", v.getClienteDocumento());
            tx.put("carreta", null);
            tx.put("ruta", null);
            tx.put("rechazado", null);
            transactions.add(tx);
        }

        transactions.sort((a, b) -> b.get("fecha").toString().compareTo(a.get("fecha").toString()));
        return transactions;
    }
}
