package com.planetapp.infrastructure.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(@NonNull ViewControllerRegistry registry) {
        // Redirige la raíz al archivo index.html
        registry.addViewController("/").setViewName("forward:/index.html");
        
        // Manejo de rutas para SPA: Cualquier ruta que no contenga un punto (archivo) 
        // se redirige a index.html para que el frontend maneje el routing.
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}
