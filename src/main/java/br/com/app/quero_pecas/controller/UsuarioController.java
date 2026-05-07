package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.UsuarioDTO;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;
    @PostMapping("/")
    public ResponseEntity<String> save(@RequestBody @Valid UsuarioDTO.Save dados) {
        try{
            this.usuarioService.save(dados);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuario cadastrado com sucesso!");
        }catch (Exception e){
            return ResponseEntity.badRequest().body("Erro ao cadastrar usuario!");
        }
    }
}

