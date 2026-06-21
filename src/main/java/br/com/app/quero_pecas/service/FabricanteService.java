package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.FabricanteDTO;
import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.repository.FabricanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FabricanteService {

    @Autowired
    private FabricanteRepository fabricanteRepository;

    public void save(FabricanteDTO.Save dados) {
        Fabricante fabricante = new Fabricante();
        fabricante.setCnpj(dados.cnpj());
        fabricante.setNome(dados.nome());
        fabricanteRepository.save(fabricante);
    }

    public List<Fabricante> listAll() {
        return fabricanteRepository.findAll();
    }
}
