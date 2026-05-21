package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.repository.PecaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class PecaService {
    @Autowired
    private PecaRepository pecaRepository;

    public List<Peca> buscarPecas(String marca, String modelo, Integer ano, String categoria) {
        // Transforma strings vazias do front em null para a query funcionar corretamente
        String filtroMarca = (marca != null && !marca.trim().isEmpty()) ? marca : null;
        String filtroModelo = (modelo != null && !modelo.trim().isEmpty()) ? modelo : null;
        String filtroCategoria = (categoria != null && !categoria.trim().isEmpty()) ? categoria : null;

        return pecaRepository.buscarPorAplicacao(filtroMarca, filtroModelo, ano, filtroCategoria);
    }
}
