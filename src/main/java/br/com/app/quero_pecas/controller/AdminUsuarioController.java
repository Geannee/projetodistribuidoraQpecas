package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/usuarios")
public class AdminUsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PatchMapping("/{id}/aprovar")
    public ResponseEntity<Void> aprovar(@PathVariable Long id) {
        usuarioService.aprovarUsuario(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/reprovar")
    public ResponseEntity<Void> reprovar(@PathVariable Long id, @RequestBody String motivo) {
        usuarioService.reprovarUsuario(id, motivo);
        return ResponseEntity.ok().build();
    }
}

