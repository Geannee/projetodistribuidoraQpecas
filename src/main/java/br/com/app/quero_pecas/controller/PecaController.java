package br.com.app.quero_pecas.controller;


import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.service.PecaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pecas")
@CrossOrigin(origins = "*")
public class PecaController {

    @Autowired
    private PecaService pecaService;

    @GetMapping("/busca-inteligente")
    public ResponseEntity<List<Peca>> buscarPecas(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) String categoria) {

        List<Peca> pecas = pecaService.buscarPecas(marca, modelo, ano, categoria);
        return ResponseEntity.ok(pecas);
    }
}



