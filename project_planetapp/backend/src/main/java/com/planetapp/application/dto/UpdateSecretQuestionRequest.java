package com.planetapp.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSecretQuestionRequest {
    private String preguntaSecreta;
    private String respuestaSecreta;
}
