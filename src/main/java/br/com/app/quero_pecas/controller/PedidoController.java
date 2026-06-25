package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<PedidoDTO.PedidoResponse> save(@RequestBody PedidoDTO.PedidoRequest request) {
        PedidoDTO.PedidoResponse response = pedidoService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidoDTO.PedidoResponse> update(@PathVariable Long id, @RequestBody PedidoDTO.AtualizarPagamentoRequest request) {
        PedidoDTO.PedidoResponse response = pedidoService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/historico/{idUsuario}")
    public ResponseEntity<List<PedidoDTO.PedidoResponse>> getHistorico(@PathVariable Long idUsuario) {
        List<PedidoDTO.PedidoResponse> response = pedidoService.findByUsuario(idUsuario);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PedidoDTO.PedidoResponse>> findAll() {
        List<PedidoDTO.PedidoResponse> response = pedidoService.findAll();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoDTO.PedidoResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam br.com.app.quero_pecas.utils.StatusPedido status,
            @RequestParam(required = false) String motivoCancelamento) {
        PedidoDTO.PedidoResponse response = pedidoService.updateStatus(id, status, motivoCancelamento);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/itens/{idPeca}")
    public ResponseEntity<PedidoDTO.PedidoResponse> adjustItemQuantity(
            @PathVariable Long id,
            @PathVariable Long idPeca,
            @RequestParam Integer quantidade) {
        PedidoDTO.PedidoResponse response = pedidoService.adjustItemQuantity(id, idPeca, quantidade);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}/itens/{idPeca}")
    public ResponseEntity<PedidoDTO.PedidoResponse> removeItem(
            @PathVariable Long id,
            @PathVariable Long idPeca) {
        PedidoDTO.PedidoResponse response = pedidoService.removeItem(id, idPeca);
        return ResponseEntity.ok(response);
    }
}
