package com.planetapp.application.services;

import com.planetapp.application.dto.BarrioDTO;
import com.planetapp.domain.entities.Barrio;
import com.planetapp.domain.repositories.BarrioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BarrioService {

    private final BarrioRepository barrioRepository;

    @Transactional(readOnly = true)
    public List<BarrioDTO> obtenerTodos() {
        return barrioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BarrioDTO> buscar(String termino) {
        return barrioRepository.buscarPorTermino(termino).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public BarrioDTO crear(BarrioDTO dto) {
        Barrio barrio = new Barrio();
        barrio.setCodigo(dto.getCodigo());
        barrio.setNombre(dto.getNombre());
        barrio.setComuna(dto.getComuna());
        barrio.setActivo(true);
        Barrio guardado = barrioRepository.save(barrio);
        return convertirADTO(guardado);
    }

    private BarrioDTO convertirADTO(Barrio b) {
        return new BarrioDTO(b.getId(), b.getCodigo(), b.getNombre(), b.getComuna(), b.getActivo());
    }
}
