package br.com.app.quero_pecas.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class ViewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Deve carregar a página inicial '/' com sucesso")
    void deveCarregarPaginaInicial() throws Exception {
        mockMvc.perform(get("/"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("index"));
    }

    @Test
    @DisplayName("Deve carregar a página de login '/login.html' com sucesso")
    void deveCarregarPaginaLogin() throws Exception {
        mockMvc.perform(get("/login.html"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("login"));
    }

    @Test
    @DisplayName("Deve carregar a página de cadastro '/cadastro.html' com sucesso")
    void deveCarregarPaginaCadastro() throws Exception {
        mockMvc.perform(get("/cadastro.html"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("cadastro"));
    }

    @Test
    @DisplayName("Deve carregar a página de buscas do cliente '/busca-cliente.html' com sucesso")
    void deveCarregarPaginaBuscaCliente() throws Exception {
        mockMvc.perform(get("/busca-cliente.html"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("busca-cliente"));
    }

    @Test
    @DisplayName("Deve carregar o painel administrativo de pedidos '/admin-pedidos.html' com sucesso")
    void deveCarregarPaginaAdminPedidos() throws Exception {
        mockMvc.perform(get("/admin-pedidos.html"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(view().name("admin-pedidos"));
    }
}
