package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.BuscarPorPlacaDTO;
import br.com.app.quero_pecas.service.VeiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pecas")
@CrossOrigin(origins = "*")
public class PecaController {
    @Autowired
    private VeiculoService veiculoService;

    @GetMapping("/findByPlaca")
    public ResponseEntity<BuscarPorPlacaDTO.BuscarPlacaResponseDTO> findByPlaca(@RequestParam String placa) {
        BuscarPorPlacaDTO.BuscarPlacaResponseDTO response = veiculoService.buscarPecasPorPlaca(placa);
        return ResponseEntity.ok(response);
    }
}
