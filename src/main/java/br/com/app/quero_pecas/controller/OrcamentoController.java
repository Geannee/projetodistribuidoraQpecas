package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.OrcamentoDTO;
import br.com.app.quero_pecas.service.OrcamentoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orcamentos")
public class OrcamentoController {
    @Autowired
    private OrcamentoService orcamentoService;

    @PostMapping
    public ResponseEntity<OrcamentoDTO.OrcamentoResponse> save(@RequestBody OrcamentoDTO.OrcamentoRequest dados) {
        OrcamentoDTO.OrcamentoResponse response = orcamentoService.save(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/meus-orcamentos")
    public ResponseEntity<List<OrcamentoDTO.OrcamentoResponse>> listarOrcamentosDaSessao() {
        List<OrcamentoDTO.OrcamentoResponse> orcamentos = orcamentoService.findAll();
        return ResponseEntity.ok(orcamentos);
    }
}
