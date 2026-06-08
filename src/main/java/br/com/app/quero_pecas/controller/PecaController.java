package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.PecaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.service.PecaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pecas")
@CrossOrigin(origins = "*")
public class PecaController {

    @Autowired
    private PecaService pecaService;

    @PostMapping("/save")
    public ResponseEntity<String> save(@RequestBody @Valid PecaDTO.Save dados) {
        pecaService.save(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Peça cadastrada com sucesso");
    }

    @GetMapping("/historico")
    public ResponseEntity<List<Peca>> findAllByAtivoTrue() {
        List<Peca> pecasAtivas = pecaService.listActivePeca();
        return ResponseEntity.ok(pecasAtivas);
    }

    @PatchMapping("/{id}/deletar")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        pecaService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("Peça excluída com sucesso!");
    }
}
