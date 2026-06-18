package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.VeiculoDTO;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.service.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import br.com.app.quero_pecas.dto.BuscarPorPlacaDTO;
import br.com.app.quero_pecas.service.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @PatchMapping("/{id}/deletar")
    public ResponseEntity<String> deletar(@PathVariable Long id) {
        veiculoService.delete(id);
        return ResponseEntity.status(HttpStatus.OK).body("Veículo excluído com sucesso!");
    }


}
