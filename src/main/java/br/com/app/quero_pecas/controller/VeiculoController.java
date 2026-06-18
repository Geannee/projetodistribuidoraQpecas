package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.VeiculoDTO;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.service.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Year;
import java.util.List;

@RestController
@RequestMapping("/veiculos")
@CrossOrigin(origins = "*")
public class VeiculoController {

    @Autowired
    private VeiculoService veiculoService;

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody VeiculoDTO.Save dados) {
        veiculoService.save(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Veiculo cadastrado com sucesso!");
    }

    @GetMapping("/historico")
    public ResponseEntity<List<Veiculo>> showHistoryActive() {
        List<Veiculo> veiculosAtivos = veiculoService.listActiveHistory();
        return ResponseEntity.ok(veiculosAtivos);
    }

    @GetMapping("/modelos")
    public ResponseEntity<List<String>> findModelosByMarca(@RequestParam String marca) {
        // Busca no banco os modelos únicos filtrados pela marca informada
        List<String> modelos = veiculoService.findModelosByMarca(marca);
        return ResponseEntity.ok(modelos);
    }

    @GetMapping("/anoDeFabricacao")
    public ResponseEntity<List<Year>> findAnoByModelo(@RequestParam String modelo) {
        // Busca no banco os modelos únicos filtrados pela marca informada
        List<Year> anosDeFabricacao = veiculoService.findDistinctAnoFabricacaoByModelo(modelo);
        return ResponseEntity.ok(anosDeFabricacao);
    }

}
