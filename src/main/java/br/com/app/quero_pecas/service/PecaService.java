package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PecaDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.repository.FabricanteRepository;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class PecaService {
    @Autowired private PecaRepository pecaRepository;
    @Autowired private PecaVeiculoRepository pecaVeiculoRepository;
    @Autowired private VeiculoRepository veiculoRepository;
    @Autowired private FabricanteRepository fabricanteRepository;

    public List<Peca> buscarPecas(String marca, String modelo, Integer ano, String categoria) {
        // Transforma strings vazias do front em null para a query funcionar corretamente
        String filtroMarca = (marca != null && !marca.trim().isEmpty()) ? marca : null;
        String filtroModelo = (modelo != null && !modelo.trim().isEmpty()) ? modelo : null;
        String filtroCategoria = (categoria != null && !categoria.trim().isEmpty()) ? categoria : null;

        return pecaRepository.buscarPorAplicacao(filtroMarca, filtroModelo, ano, filtroCategoria);
    }

    public void save(PecaDTO.Save dados) {

        if (pecaRepository.existsByCodigo(dados.codigo())) {
            throw new RuntimeException("Código da peça já cadastrado");
        }

        Peca peca = new Peca();
        peca.setCategoria(dados.categoria());
        peca.setCodigo(dados.codigo());
        peca.setDescricao(dados.descricao());
        peca.setEstoque(dados.estoque());

        Fabricante fabricante = fabricanteRepository.findById(dados.fabricanteId())
                .orElseThrow(() -> new RuntimeException("Fabricante com ID " + dados.fabricanteId() + " não encontrado"));
        peca.setFabricante(fabricante);
        peca.setMarca(fabricante.getNome());

        peca.setNome(dados.nome());
        peca.setPrecoBase(dados.precoBase());
        peca.setTipoPeca(dados.tipoPeca());
        peca.setAtivo(true);

        peca = pecaRepository.save(peca);

        if (dados.veiculosIds() == null || dados.veiculosIds().isEmpty()) {
            throw new IllegalArgumentException("Selecione ao menos um veículo compatível");
        }

        for (Long idVeiculo : dados.veiculosIds()) {
            Veiculo veiculo = veiculoRepository.findById(idVeiculo)
                    .orElseThrow(() -> new RuntimeException("Veículo com ID " + idVeiculo + " não encontrado"));
            PecaVeiculo pv = new PecaVeiculo();
            pv.setPeca(peca);
            pv.setVeiculo(veiculo);
            pecaVeiculoRepository.save(pv);
        }
    }

    public List<Peca> listActivePeca(){
        return pecaRepository.findAllByAtivoTrue();
    }

    public Peca delete(Long id) {
        Peca peca = pecaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Peça não encontrado"));
        peca.setAtivo(false);
        return pecaRepository.save(peca);
    }
}
