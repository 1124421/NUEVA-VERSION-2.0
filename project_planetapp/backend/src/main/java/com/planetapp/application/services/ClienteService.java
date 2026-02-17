package com.planetapp.application.services;

import com.planetapp.application.dto.ClienteDTO;
import com.planetapp.domain.entities.Cliente;
import com.planetapp.domain.repositories.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    @Transactional(readOnly = true)
    public List<ClienteDTO> obtenerTodos() {
        return clienteRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ClienteDTO obtenerPorId(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        return convertirADTO(cliente);
    }

    @Transactional
    public ClienteDTO crear(ClienteDTO dto) {
        if (clienteRepository.findByDocumento(dto.getDocumento()).isPresent()) {
            throw new RuntimeException("Ya existe un cliente con el documento: " + dto.getDocumento());
        }
        Cliente cliente = convertirAEntidad(dto);
        Cliente guardado = clienteRepository.save(cliente);
        return convertirADTO(guardado);
    }

    @Transactional
    public ClienteDTO actualizar(Long id, ClienteDTO dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));

        clienteRepository.findByDocumento(dto.getDocumento())
                .ifPresent(c -> {
                    if (!c.getId().equals(id)) {
                        throw new RuntimeException("El documento ya está siendo usado por otro cliente");
                    }
                });

        cliente.setNombre(dto.getNombre());
        cliente.setDocumento(dto.getDocumento());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setActivo(dto.getActivo());

        Cliente actualizado = clienteRepository.save(cliente);
        return convertirADTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        throw new RuntimeException("No se permite eliminación física de clientes. Use el método desactivar.");
    }

    @Transactional
    public ClienteDTO toggleActivo(Long id) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        cliente.setActivo(!cliente.getActivo());
        Cliente actualizado = clienteRepository.save(cliente);
        return convertirADTO(actualizado);
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> obtenerActivos() {
        return clienteRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClienteDTO> buscarPorNombre(String nombre) {
        return clienteRepository.buscarPorTermino(nombre).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private ClienteDTO convertirADTO(Cliente cliente) {
        return new ClienteDTO(
                cliente.getId(),
                cliente.getNombre(),
                cliente.getDocumento(),
                cliente.getTelefono(),
                cliente.getEmail(),
                cliente.getFechaRegistro(),
                cliente.getActivo());
    }

    private Cliente convertirAEntidad(ClienteDTO dto) {
        Cliente cliente = new Cliente();
        cliente.setId(dto.getId());
        cliente.setNombre(dto.getNombre());
        cliente.setDocumento(dto.getDocumento());
        cliente.setTelefono(dto.getTelefono());
        cliente.setEmail(dto.getEmail());
        cliente.setFechaRegistro(dto.getFechaRegistro());
        cliente.setActivo(dto.getActivo());
        return cliente;
    }
}
