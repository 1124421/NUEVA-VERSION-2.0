package com.planetapp.infrastructure.controllers;

import com.planetapp.application.dto.LoginRequest;
import com.planetapp.application.dto.RecoverPasswordRequest;
import com.planetapp.application.dto.RegisterRequest;
import com.planetapp.application.dto.UpdateProfileRequest;
import com.planetapp.application.dto.UpdateSecretQuestionRequest;
import com.planetapp.application.dto.ValidateSecretAnswerRequest;
import com.planetapp.application.dto.UserDTO;
import com.planetapp.application.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            UserDTO user = userService.register(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            UserDTO user = userService.login(request);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserDTO user = userService.findById(id);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody UpdateProfileRequest request) {
        try {
            UserDTO updatedUser = userService.updateProfile(id, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/secret-question")
    public ResponseEntity<?> getSecretQuestion(@RequestParam String email) {
        try {
            String question = userService.getSecretQuestion(email);
            return ResponseEntity.ok(Collections.singletonMap("preguntaSecreta", question));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validate-secret-answer")
    public ResponseEntity<?> validateSecretAnswer(@RequestBody ValidateSecretAnswerRequest request) {
        try {
            boolean valid = userService.validateSecretAnswer(request.getEmail(), request.getRespuestaSecreta());
            Map<String, Object> response = new HashMap<>();
            response.put("valid", valid);
            if (!valid) {
                response.put("message", "La respuesta secreta es incorrecta");
            }
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/recover-password")
    public ResponseEntity<?> recoverPassword(@RequestBody RecoverPasswordRequest request) {
        try {
            userService.recoverPassword(request);
            return ResponseEntity.ok(Collections.singletonMap("message", "Contraseña actualizada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-secret-question/{id}")
    public ResponseEntity<?> updateSecretQuestion(@PathVariable Long id, @RequestBody UpdateSecretQuestionRequest request) {
        try {
            userService.updateSecretQuestion(id, request.getPreguntaSecreta(), request.getRespuestaSecreta());
            return ResponseEntity.ok(Collections.singletonMap("message", "Pregunta secreta actualizada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
