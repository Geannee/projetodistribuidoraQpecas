package br.com.app.quero_pecas.dto;

public interface ItemPedidoDTO {
    record Save(
            Long pecaId,
            Integer quantidade
    ){}
}
