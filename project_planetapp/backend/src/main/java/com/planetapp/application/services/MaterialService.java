package com.planetapp.application.services;

import com.planetapp.application.dto.MaterialDTO;
import com.planetapp.domain.entities.Material;
import com.planetapp.domain.entities.Categoria;
import com.planetapp.domain.entities.Subcategoria;
import com.planetapp.domain.repositories.MaterialRepository;
import com.planetapp.domain.repositories.CategoriaRepository;
import com.planetapp.domain.repositories.SubcategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;

    @Transactional(readOnly = true)
    public List<MaterialDTO> obtenerTodos() {
        return materialRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MaterialDTO obtenerPorId(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado con id: " + id));
        return convertirADTO(material);
    }

    @Transactional
    public MaterialDTO crear(MaterialDTO dto) {
        if (dto.getCodigo() != null && materialRepository.findByCodigo(dto.getCodigo()).isPresent()) {
            throw new RuntimeException("Ya existe un material con el código: " + dto.getCodigo());
        }
        Material material = convertirAEntidad(dto);
        Material guardado = materialRepository.save(material);
        return convertirADTO(guardado);
    }

    @Transactional
    public MaterialDTO actualizar(Long id, MaterialDTO dto) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado con id: " + id));

        material.setNombre(dto.getNombre());
        material.setCodigo(dto.getCodigo());
        material.setPrecioCompra(dto.getPrecioCompra());
        material.setPrecioVenta(dto.getPrecioVenta());
        material.setStock(dto.getStock());
        material.setUnidad(dto.getUnidad());
        material.setDescripcion(dto.getDescripcion());

        if (dto.getCategoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            material.setCategoria(cat);
        } else {
            material.setCategoria(null);
        }

        if (dto.getSubcategoriaId() != null) {
            Subcategoria sub = subcategoriaRepository.findById(dto.getSubcategoriaId())
                    .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
            material.setSubcategoria(sub);
        } else {
            material.setSubcategoria(null);
        }

        Material actualizado = materialRepository.save(material);
        return convertirADTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        throw new RuntimeException("No se permite eliminación física de materiales. Use el método desactivar.");
    }

    @Transactional
    public MaterialDTO desactivar(Long id) {
        Material material = materialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado con id: " + id));
        material.setActivo(false);
        Material actualizado = materialRepository.save(material);
        return convertirADTO(actualizado);
    }

    @Transactional(readOnly = true)
    public List<MaterialDTO> obtenerActivos() {
        return materialRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaterialDTO> buscarPorNombre(String nombre) {
        return materialRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MaterialDTO> obtenerStockBajo(Double cantidad) {
        return materialRepository.findByStockLessThan(cantidad).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private MaterialDTO convertirADTO(Material material) {
        return new MaterialDTO(
                material.getId(),
                material.getNombre(),
                material.getCodigo(),
                material.getPrecioCompra(),
                material.getPrecioVenta(),
                material.getStock(),
                material.getCategoria() != null ? material.getCategoria().getId() : null,
                material.getCategoria() != null ? material.getCategoria().getNombre() : null,
                material.getSubcategoria() != null ? material.getSubcategoria().getId() : null,
                material.getSubcategoria() != null ? material.getSubcategoria().getNombre() : null,
                material.getUnidad(),
                material.getDescripcion(),
                material.getFechaRegistro(),
                material.getActivo());
    }

    private Material convertirAEntidad(MaterialDTO dto) {
        Material material = new Material();
        material.setId(dto.getId());
        material.setNombre(dto.getNombre());
        material.setCodigo(dto.getCodigo());
        material.setPrecioCompra(dto.getPrecioCompra());
        material.setPrecioVenta(dto.getPrecioVenta());
        material.setStock(dto.getStock());
        material.setUnidad(dto.getUnidad());
        material.setDescripcion(dto.getDescripcion());
        material.setFechaRegistro(dto.getFechaRegistro());
        material.setActivo(dto.getActivo());

        if (dto.getCategoriaId() != null) {
            Categoria cat = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
            material.setCategoria(cat);
        }

        if (dto.getSubcategoriaId() != null) {
            Subcategoria sub = subcategoriaRepository.findById(dto.getSubcategoriaId())
                    .orElseThrow(() -> new RuntimeException("Subcategoría no encontrada"));
            material.setSubcategoria(sub);
        }

        return material;
    }
}
