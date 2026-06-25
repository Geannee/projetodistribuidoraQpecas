package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.entity.*;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PedidoRepository;
import br.com.app.quero_pecas.utils.MetodoPagamento;
import br.com.app.quero_pecas.utils.StatusEntrega;
import br.com.app.quero_pecas.utils.StatusPagamento;
import br.com.app.quero_pecas.utils.StatusPedido;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {
    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private PecaRepository pecaRepository;

    @Transactional
    public PedidoDTO.PedidoResponse save(PedidoDTO.PedidoRequest dados) {
        Pedido pedido = new Pedido();
        pedido.setData(LocalDateTime.now());
        pedido.setNumeroPedido(generateValue());
        pedido.setStatus(StatusPedido.AGUARDANDO_PAGAMENTO);
        pedido.setValorFrete(dados.valorFrete());

        Usuario usuarioPedido = new Usuario();

        usuarioPedido.setIdUsuario(dados.idUsuario());
        pedido.setUsuario(usuarioPedido);

        if (dados.enderecoEntrega() != null) {
            Entrega entrega = getEntrega(dados);
            entrega.setPedido(pedido);
            pedido.setEntrega(entrega);
        }

        double valorTotal = 0.0;
        List<PecaPedido> itensPedido = new ArrayList<>();

        for (PedidoDTO.ItemPedidoRequest itemDto : dados.itens()) {
            Peca peca = pecaRepository.findById(itemDto.idPeca()).orElseThrow(() -> new RuntimeException("Peça não encontrada"));

            if (peca.getEstoque() < itemDto.quantidade()) {
                throw new RuntimeException("Estoque insuficiente para a peça: " + peca.getNome());
            }

            peca.setEstoque(peca.getEstoque() - itemDto.quantidade());
            pecaRepository.save(peca);

            PecaPedido item = new PecaPedido();
            item.setPedido(pedido);
            item.setPeca(peca);
            item.setQuantidade(itemDto.quantidade());
            item.setPrecoVenda(peca.getPreco());

            double subTotal = peca.getPreco() * itemDto.quantidade();
            item.setSubtotal(subTotal);

            valorTotal += subTotal;

            itensPedido.add(item);
        }

        pedido.setItens(itensPedido);
        pedido.setValorTotal(valorTotal + dados.valorFrete());

        Pedido pedidoSalvo = pedidoRepository.save(pedido);
        return convertToResponseDTO(pedidoSalvo);
    }

    @Transactional
    public PedidoDTO.PedidoResponse update(Long id, PedidoDTO.AtualizarPagamentoRequest dto) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        Pagamento pagamento = pedido.getPagamento();
        if (pagamento == null) {
            pagamento = new Pagamento();
            pagamento.setPedido(pedido);
        }
        pagamento.setDataPagamento(LocalDateTime.now());
        pagamento.setMetodoPagamento(MetodoPagamento.valueOf(dto.metodoPagamento()));

        if (dto.statusPagamento().equalsIgnoreCase("PAGO") || dto.statusPagamento().equalsIgnoreCase("APROVADO")) {
            pagamento.setStatusPagamento(StatusPagamento.APROVADO);
            pedido.setStatus(StatusPedido.PAGO);

            if (pedido.getEntrega() != null) {
                pedido.getEntrega().setStatusEntrega(StatusEntrega.PREPARANDO_ENVIO);
                pedido.getEntrega().setPedido(pedido);
            } else {
                Entrega entrega = new Entrega();
                entrega.setStatusEntrega(StatusEntrega.PREPARANDO_ENVIO);
                entrega.setPedido(pedido);
                pedido.setEntrega(entrega);
            }

        } else if (dto.statusPagamento().equalsIgnoreCase("RECUSADO")) {
            pagamento.setStatusPagamento(StatusPagamento.RECUSADO);
            pedido.setStatus(StatusPedido.CANCELADO);

            if (pedido.getEntrega() != null) {
                pedido.getEntrega().setStatusEntrega(StatusEntrega.CANCELADA);
            }

            for (PecaPedido item : pedido.getItens()) {
                Peca peca = item.getPeca();
                peca.setEstoque(peca.getEstoque() + item.getQuantidade());
                pecaRepository.save(peca);
            }
        }

        pedido.setPagamento(pagamento);
        return convertToResponseDTO(pedidoRepository.save(pedido));
    }

    private PedidoDTO.PedidoResponse convertToResponseDTO(Pedido pedido) {
        // Mapeia os itens da entidade para o Record de resposta
        List<PedidoDTO.ItemPedidoResponse> itensResponse = pedido.getItens().stream().map(item -> new PedidoDTO.ItemPedidoResponse(item.getPeca().getIdPeca(), item.getPeca().getNome(), item.getQuantidade(), item.getPrecoVenda(), item.getSubtotal())).toList();

        String nomeCliente = "Desconhecido";
        String cnpjCliente = "";
        if (pedido.getUsuario() != null) {
            nomeCliente = pedido.getUsuario().getNomeFantasia() != null && !pedido.getUsuario().getNomeFantasia().trim().isEmpty()
                    ? pedido.getUsuario().getNomeFantasia()
                    : (pedido.getUsuario().getRazaoSocial() != null ? pedido.getUsuario().getRazaoSocial() : pedido.getUsuario().getRepresentanteLegal());
            cnpjCliente = pedido.getUsuario().getCnpj() != null ? pedido.getUsuario().getCnpj() : "";
        }

        return new PedidoDTO.PedidoResponse(
                pedido.getIdPedido(),
                pedido.getNumeroPedido(),
                pedido.getData(),
                pedido.getStatus(),
                pedido.getValorFrete(),
                pedido.getValorTotal(),
                pedido.getEntrega() != null ? pedido.getEntrega().getIdEntrega() : null,
                itensResponse,
                nomeCliente,
                cnpjCliente,
                pedido.getMotivoCancelamento()
        );
    }

    public List<PedidoDTO.PedidoResponse> findByUsuario(Long idUsuario) {
        return pedidoRepository.findAllByUsuarioIdUsuarioOrderByDataDesc(idUsuario)
                .stream()
                .map(this::convertToResponseDTO)
                .toList();
    }

    public String generateValue() {
        String letras = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();

        return "QP-" + letras;
    }

    private static @NonNull Entrega getEntrega(PedidoDTO.PedidoRequest dados) {
        Entrega entrega = new Entrega();
        entrega.setStatusEntrega(StatusEntrega.AGUARDANDO_PAGAMENTO);

        Endereco enderecoEntrega = new Endereco();
        enderecoEntrega.setCep(dados.enderecoEntrega().cep());
        enderecoEntrega.setLogradouro(dados.enderecoEntrega().logradouro());
        enderecoEntrega.setNumero(dados.enderecoEntrega().numero());
        enderecoEntrega.setComplemento(dados.enderecoEntrega().complemento());
        enderecoEntrega.setBairro(dados.enderecoEntrega().bairro());
        enderecoEntrega.setCidadeUf(dados.enderecoEntrega().cidadeUf());

        entrega.setEndereco(enderecoEntrega);
        return entrega;
    }

    public List<PedidoDTO.PedidoResponse> findAll() {
        return pedidoRepository.findAll().stream()
                .sorted((a, b) -> b.getData().compareTo(a.getData()))
                .map(this::convertToResponseDTO)
                .toList();
    }

    @Transactional
    public PedidoDTO.PedidoResponse updateStatus(Long id, StatusPedido status, String motivoCancelamento) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (status == StatusPedido.EM_SEPARACAO) {
            if (pedido.getStatus() != StatusPedido.PAGO) {
                throw new RuntimeException("Não é possível iniciar a separação de um pedido que não foi pago.");
            }
            pedido.setStatus(StatusPedido.EM_SEPARACAO);
        } else if (status == StatusPedido.FATURADO) {
            // Valida se há saldo real no estoque (ou seja, se a peça não está com estoque negativo)
            List<String> shortItems = new ArrayList<>();
            for (PecaPedido item : pedido.getItens()) {
                Peca peca = item.getPeca();
                if (peca.getEstoque() < 0) {
                    shortItems.add(peca.getNome() + " (Falta: " + Math.abs(peca.getEstoque()) + " un.)");
                }
            }
            if (!shortItems.isEmpty()) {
                throw new RuntimeException("Erro ao faturar: Divergência de estoque detectada. " + String.join(", ", shortItems));
            }

            // Faturou com sucesso -> Altera status da entrega também se houver
            pedido.setStatus(StatusPedido.FATURADO);
            if (pedido.getEntrega() != null) {
                pedido.getEntrega().setStatusEntrega(StatusEntrega.PREPARANDO_ENVIO);
            }
        } else if (status == StatusPedido.EM_VIAGEM) {
            pedido.setStatus(StatusPedido.EM_VIAGEM);
            if (pedido.getEntrega() != null) {
                pedido.getEntrega().setStatusEntrega(StatusEntrega.EM_TRANSPORTE);
            }
        } else if (status == StatusPedido.CANCELADO) {
            pedido.setStatus(StatusPedido.CANCELADO);
            pedido.setMotivoCancelamento(motivoCancelamento);
            if (pedido.getEntrega() != null) {
                pedido.getEntrega().setStatusEntrega(StatusEntrega.CANCELADA);
            }
            // Devolve estoque das peças associadas
            for (PecaPedido item : pedido.getItens()) {
                Peca peca = item.getPeca();
                peca.setEstoque(peca.getEstoque() + item.getQuantidade());
                pecaRepository.save(peca);
            }
        } else {
            pedido.setStatus(status);
        }

        return convertToResponseDTO(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoDTO.PedidoResponse adjustItemQuantity(Long idPedido, Long idPeca, Integer quantidade) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        PecaPedido itemToAdjust = null;
        for (PecaPedido item : pedido.getItens()) {
            if (item.getPeca().getIdPeca().equals(idPeca)) {
                itemToAdjust = item;
                break;
            }
        }

        if (itemToAdjust == null) {
            throw new RuntimeException("Item não encontrado no pedido");
        }

        Peca peca = itemToAdjust.getPeca();
        int oldQty = itemToAdjust.getQuantidade();
        int diff = quantidade - oldQty;

        // Atualiza estoque da peça
        peca.setEstoque(peca.getEstoque() - diff);
        pecaRepository.save(peca);

        // Atualiza quantidade do item
        itemToAdjust.setQuantidade(quantidade);
        itemToAdjust.setSubtotal(peca.getPreco() * quantidade);

        // Recalcula o valor total do pedido
        double newTotal = pedido.getItens().stream().mapToDouble(PecaPedido::getSubtotal).sum() + pedido.getValorFrete();
        pedido.setValorTotal(newTotal);

        return convertToResponseDTO(pedidoRepository.save(pedido));
    }

    @Transactional
    public PedidoDTO.PedidoResponse removeItem(Long idPedido, Long idPeca) {
        Pedido pedido = pedidoRepository.findById(idPedido)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        PecaPedido itemToRemove = null;
        for (PecaPedido item : pedido.getItens()) {
            if (item.getPeca().getIdPeca().equals(idPeca)) {
                itemToRemove = item;
                break;
            }
        }

        if (itemToRemove == null) {
            throw new RuntimeException("Item não encontrado no pedido");
        }

        Peca peca = itemToRemove.getPeca();
        // Devolve todo o estoque da peça
        peca.setEstoque(peca.getEstoque() + itemToRemove.getQuantidade());
        pecaRepository.save(peca);

        pedido.getItens().remove(itemToRemove);

        // Recalcula o valor total do pedido
        double newTotal = pedido.getItens().stream().mapToDouble(PecaPedido::getSubtotal).sum() + pedido.getValorFrete();
        pedido.setValorTotal(newTotal);

        return convertToResponseDTO(pedidoRepository.save(pedido));
    }
}
