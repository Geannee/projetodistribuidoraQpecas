package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.PedidoRepository;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.app.quero_pecas.utils.StatusUsuario;
import br.com.app.quero_pecas.utils.TipoUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class AdminUsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    private Usuario usuarioPendente;
    private Usuario usuarioReprovado;
    private Usuario usuarioAtivo;

    @BeforeEach
    void setup() {
        pedidoRepository.deleteAll();
        usuarioRepository.deleteAll();

        // 1. Usuário Pendente
        usuarioPendente = new Usuario();
        usuarioPendente.setCnpj("11111111000111");
        usuarioPendente.setEmail("pendente@teste.com");
        usuarioPendente.setSenha("123456");
        usuarioPendente.setRepresentanteLegal("Pendente Legal");
        usuarioPendente.setStatus(StatusUsuario.PENDENTE);
        usuarioPendente.setAtivo(false);
        usuarioPendente.setTipoUsuario(TipoUsuario.MECANICO);
        usuarioPendente = usuarioRepository.save(usuarioPendente);

        // 2. Usuário Reprovado
        usuarioReprovado = new Usuario();
        usuarioReprovado.setCnpj("22222222000122");
        usuarioReprovado.setEmail("reprovado@teste.com");
        usuarioReprovado.setSenha("123456");
        usuarioReprovado.setRepresentanteLegal("Reprovado Legal");
        usuarioReprovado.setStatus(StatusUsuario.REPROVADO);
        usuarioReprovado.setAtivo(false);
        usuarioReprovado.setMotivoReprovacao("Documentação incompleta");
        usuarioReprovado.setTipoUsuario(TipoUsuario.MECANICO);
        usuarioReprovado = usuarioRepository.save(usuarioReprovado);

        // 3. Usuário Ativo
        usuarioAtivo = new Usuario();
        usuarioAtivo.setCnpj("33333333000133");
        usuarioAtivo.setEmail("ativo@teste.com");
        usuarioAtivo.setSenha("123456");
        usuarioAtivo.setRepresentanteLegal("Ativo Legal");
        usuarioAtivo.setStatus(StatusUsuario.ATIVO);
        usuarioAtivo.setAtivo(true);
        usuarioAtivo.setTipoUsuario(TipoUsuario.MECANICO);
        usuarioAtivo = usuarioRepository.save(usuarioAtivo);
    }

    @Test
    @DisplayName("Deve listar todos os usuários com status PENDENTE")
    void deveListarUsuariosPendentes() throws Exception {
        mockMvc.perform(get("/admin/usuarios/pendentes"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].cnpj").value("11111111000111"));
    }

    @Test
    @DisplayName("Deve listar todos os usuários com status REPROVADO")
    void deveListarUsuariosReprovados() throws Exception {
        mockMvc.perform(get("/admin/usuarios/reprovados"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].cnpj").value("22222222000122"));
    }

    @Test
    @DisplayName("Deve listar todos os usuários com status ATIVO")
    void deveListarUsuariosAtivos() throws Exception {
        mockMvc.perform(get("/admin/usuarios/ativos"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].cnpj").value("33333333000133"));
    }

    @Test
    @DisplayName("Deve aprovar um usuário pendente com sucesso")
    void deveAprovarUsuarioPendente() throws Exception {
        mockMvc.perform(patch("/admin/usuarios/" + usuarioPendente.getIdUsuario() + "/aprovar"))
                .andDo(print())
                .andExpect(status().isOk());

        Usuario atualizado = usuarioRepository.findById(usuarioPendente.getIdUsuario()).orElseThrow();
        assertTrue(atualizado.isAtivo());
        assertEquals(StatusUsuario.ATIVO, atualizado.getStatus());
    }

    @Test
    @DisplayName("Deve reprovar um usuário pendente informando o motivo")
    void deveReprovarUsuarioPendente() throws Exception {
        String motivo = "CNPJ inválido ou inativo na Receita";

        mockMvc.perform(patch("/admin/usuarios/" + usuarioPendente.getIdUsuario() + "/reprovar")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content(motivo))
                .andDo(print())
                .andExpect(status().isOk());

        Usuario atualizado = usuarioRepository.findById(usuarioPendente.getIdUsuario()).orElseThrow();
        assertFalse(atualizado.isAtivo());
        assertEquals(StatusUsuario.REPROVADO, atualizado.getStatus());
        assertEquals(motivo, atualizado.getMotivoReprovacao());
    }
}
