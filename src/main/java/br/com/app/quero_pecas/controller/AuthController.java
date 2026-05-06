package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.AuthDTO;
import br.com.app.quero_pecas.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthService service;
    @PostMapping("/")
    public ResponseEntity<AuthDTO.Response> postAuth(@RequestBody @Valid AuthDTO.Request data) {
        try {
            AuthDTO.Response usuario = service.auth(data);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
