package com.planetapp.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateSecretAnswerRequest {
    private String email;
    private String respuestaSecreta;
}
