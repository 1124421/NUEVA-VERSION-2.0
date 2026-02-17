package com.planetapp.infrastructure.controllers;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object path = request.getAttribute(RequestDispatcher.FORWARD_REQUEST_URI);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);

        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());

        int statusCode = 500;
        if (status != null) {
            statusCode = Integer.valueOf(status.toString());
        }

        body.put("status", statusCode);
        body.put("path", path != null ? path : "/error");

        if (statusCode == HttpStatus.NOT_FOUND.value()) {
            body.put("error", "Not Found");
            body.put("message", "La ruta solicitada no existe. Verifique la URL.");
            body.put("hint", "Endpoints disponibles: /asociados, /materiales, /compras, /ventas");
        } else {
            body.put("error", "Error " + statusCode);
            body.put("message", message != null ? message : "Error inesperado");
        }

        return ResponseEntity.status(statusCode).body(body);
    }
}
