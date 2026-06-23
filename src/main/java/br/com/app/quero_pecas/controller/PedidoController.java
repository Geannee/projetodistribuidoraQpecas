package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "*")
public class PedidoController {
    @Autowired
    private PedidoService pedidoService;

    // GET /pedidos/historico/1 (Retorna a tabela do usuário com ID 1)
    @GetMapping("/historico/{idUsuario}")
    public ResponseEntity<List<PedidoDTO.Resumo>> obterHistorico(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(pedidoService.listarHistoricoUsuario(idUsuario));
    }

    // GET /pedidos/detalhes/5 (Retorna o modal do pedido com ID 5)
    @GetMapping("/detalhes/{idPedido}")
    public ResponseEntity<PedidoDTO.Detalhe> obterDetalhes(@PathVariable Long idPedido) {
        return ResponseEntity.ok(pedidoService.buscarDetalhes(idPedido));
    }
}
