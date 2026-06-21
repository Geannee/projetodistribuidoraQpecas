package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.FabricanteDTO;
import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.service.FabricanteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fabricantes")
@CrossOrigin(origins = "*")
public class FabricanteController {

    @Autowired
    private FabricanteService fabricanteService;

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody @Valid FabricanteDTO.Save dados) {
        fabricanteService.save(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Fabricante cadastrado com sucesso!");
    }

    @GetMapping("/historico")
    public ResponseEntity<List<Fabricante>> showHistory() {
        List<Fabricante> fabricantes = fabricanteService.listAll();
        return ResponseEntity.ok(fabricantes);
    }
}
