package com.planetapp.application.services;

import com.planetapp.application.dto.AsociadoDTO;
import com.planetapp.domain.entities.Asociado;
import com.planetapp.domain.repositories.AsociadoRepository;
import com.planetapp.domain.repositories.CompraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsociadoService {

    private final AsociadoRepository asociadoRepository;
    private final CompraRepository compraRepository;

    @Transactional(readOnly = true)
    public List<AsociadoDTO> obtenerTodos() {
        return asociadoRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AsociadoDTO obtenerPorId(Long id) {
        Asociado asociado = asociadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asociado no encontrado con id: " + id));
        return convertirADTO(asociado);
    }

    @Transactional(readOnly = true)
    public AsociadoDTO obtenerPorDocumento(String documento) {
        Asociado asociado = asociadoRepository.findByDocumento(documento)
                .orElseThrow(() -> new RuntimeException("Asociado no encontrado con documento: " + documento));
        return convertirADTO(asociado);
    }

    @Transactional
    public AsociadoDTO crear(AsociadoDTO dto) {
        // Validar que no exista un asociado con el mismo documento
        if (asociadoRepository.findByDocumento(dto.getDocumento()).isPresent()) {
            throw new RuntimeException("Ya existe un asociado con el documento: " + dto.getDocumento());
        }

        Asociado asociado = convertirAEntidad(dto);
        Asociado guardado = asociadoRepository.save(asociado);
        return convertirADTO(guardado);
    }

    @Transactional
    public AsociadoDTO actualizar(Long id, AsociadoDTO dto) {
        Asociado asociado = asociadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asociado no encontrado con id: " + id));

        // Validar que el documento no esté siendo usado por otro asociado
        asociadoRepository.findByDocumento(dto.getDocumento())
                .ifPresent(a -> {
                    if (!a.getId().equals(id)) {
                        throw new RuntimeException("El documento ya está siendo usado por otro asociado");
                    }
                });

        asociado.setNombre(dto.getNombre());
        asociado.setApellido(dto.getApellido());
        asociado.setDocumento(dto.getDocumento());
        asociado.setTelefono(dto.getTelefono());
        asociado.setEmail(dto.getEmail());
        asociado.setDireccion(dto.getDireccion());
        asociado.setActivo(dto.getActivo());
        asociado.setFechaInicio(dto.getFechaInicio());
        asociado.setTipoContrato(dto.getTipoContrato());
        asociado.setCargo(dto.getCargo());
        asociado.setTipo(dto.getTipo());

        Asociado actualizado = asociadoRepository.save(asociado);
        return convertirADTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        throw new RuntimeException("No se permite eliminación física de asociados. Use el método desactivar.");
    }

    @Transactional
    public AsociadoDTO toggleActivo(Long id) {
        Asociado asociado = asociadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asociado no encontrado con id: " + id));

        asociado.setActivo(!asociado.getActivo());
        Asociado actualizado = asociadoRepository.save(asociado);
        return convertirADTO(actualizado);
    }

    @Transactional(readOnly = true)
    public List<AsociadoDTO> obtenerActivos() {
        return asociadoRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AsociadoDTO> buscarPorNombre(String nombre) {
        return asociadoRepository.buscarPorTermino(nombre).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private AsociadoDTO convertirADTO(Asociado asociado) {
        return new AsociadoDTO(
                asociado.getId(),
                asociado.getNombre(),
                asociado.getApellido(),
                asociado.getDocumento(),
                asociado.getTelefono(),
                asociado.getEmail(),
                asociado.getDireccion(),
                asociado.getFechaRegistro(),
                asociado.getActivo(),
                asociado.getFechaInicio(),
                asociado.getTipoContrato(),
                asociado.getCargo(),
                asociado.getTipo());
    }

    private Asociado convertirAEntidad(AsociadoDTO dto) {
        Asociado asociado = new Asociado();
        asociado.setId(dto.getId());
        asociado.setNombre(dto.getNombre());
        asociado.setApellido(dto.getApellido());
        asociado.setDocumento(dto.getDocumento());
        asociado.setTelefono(dto.getTelefono());
        asociado.setEmail(dto.getEmail());
        asociado.setDireccion(dto.getDireccion());
        asociado.setFechaRegistro(dto.getFechaRegistro());
        asociado.setActivo(dto.getActivo());
        asociado.setFechaInicio(dto.getFechaInicio());
        asociado.setTipoContrato(dto.getTipoContrato());
        asociado.setCargo(dto.getCargo());
        asociado.setTipo(dto.getTipo());
        return asociado;
    }
}
