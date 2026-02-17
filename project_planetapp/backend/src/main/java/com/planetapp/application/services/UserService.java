package com.planetapp.application.services;

import com.planetapp.application.dto.LoginRequest;
import com.planetapp.application.dto.RecoverPasswordRequest;
import com.planetapp.application.dto.RegisterRequest;
import com.planetapp.application.dto.UpdateProfileRequest;
import com.planetapp.application.dto.UserDTO;
import com.planetapp.domain.models.User;
import com.planetapp.domain.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public UserDTO register(RegisterRequest request) {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        User user = new User();
        user.setNombre(request.getNombre());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRol(request.getRol() != null ? request.getRol() : "USER");
        user.setActivo(true);

        // Secret question
        if (request.getPreguntaSecreta() != null && request.getRespuestaSecreta() != null) {
            user.setPreguntaSecreta(request.getPreguntaSecreta());
            user.setRespuestaSecreta(passwordEncoder.encode(request.getRespuestaSecreta().trim().toLowerCase()));
        }

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    public UserDTO login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (!user.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return convertToDTO(user);
    }

    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return convertToDTO(user);
    }

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Validate name
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new RuntimeException("El nombre es requerido");
        }

        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new RuntimeException("El email es requerido");
        }

        // Check if email is already used by another user
        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está en uso por otro usuario");
        }

        // Update fields
        user.setNombre(request.getNombre().trim());
        user.setEmail(request.getEmail().trim());
        user.setTelefono(request.getTelefono() != null ? request.getTelefono().trim() : null);

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setEmail(user.getEmail());
        dto.setRol(user.getRol());
        dto.setActivo(user.getActivo());
        dto.setTelefono(user.getTelefono());
        return dto;
    }

    public String getSecretQuestion(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No se encontró usuario con ese correo"));
        if (user.getPreguntaSecreta() == null) {
            throw new RuntimeException("Este usuario no tiene pregunta secreta configurada");
        }
        return user.getPreguntaSecreta();
    }

    public boolean validateSecretAnswer(String email, String respuestaSecreta) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No se encontró usuario con ese correo"));

        if (user.getRespuestaSecreta() == null) {
            throw new RuntimeException("Este usuario no tiene pregunta secreta configurada");
        }

        return passwordEncoder.matches(respuestaSecreta.trim().toLowerCase(), user.getRespuestaSecreta());
    }

    public void recoverPassword(RecoverPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No se encontró usuario con ese correo"));

        if (user.getRespuestaSecreta() == null) {
            throw new RuntimeException("Este usuario no tiene pregunta secreta configurada");
        }

        if (!passwordEncoder.matches(request.getRespuestaSecreta().trim().toLowerCase(), user.getRespuestaSecreta())) {
            throw new RuntimeException("La respuesta secreta es incorrecta");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("La nueva contraseña debe tener al menos 6 caracteres");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public void updateSecretQuestion(Long userId, String preguntaSecreta, String respuestaSecreta) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (preguntaSecreta == null || preguntaSecreta.trim().isEmpty()) {
            throw new RuntimeException("La pregunta secreta es requerida");
        }
        if (respuestaSecreta == null || respuestaSecreta.trim().isEmpty()) {
            throw new RuntimeException("La respuesta secreta es requerida");
        }

        user.setPreguntaSecreta(preguntaSecreta.trim());
        user.setRespuestaSecreta(passwordEncoder.encode(respuestaSecreta.trim().toLowerCase()));
        userRepository.save(user);
    }
}
