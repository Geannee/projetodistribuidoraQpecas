package br.com.app.quero_pecas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/")
    public String index() { return "index"; }

    @GetMapping("/index.html")
    public String indexHtml() { return "index"; }

    @GetMapping("/login.html")
    public String login() { return "login"; }

    @GetMapping("/cadastro.html")
    public String cadastro() { return "cadastro"; }

    @GetMapping("/dashboard.html")
    public String dashboard() { return "dashboard"; }

    @GetMapping("/busca.html")
    public String busca() { return "busca"; }

    @GetMapping("/pedidos.html")
    public String pedidos() { return "pedidos"; }

    @GetMapping("/carrinho.html")
    public String carrinho() { return "carrinho"; }

    @GetMapping("/boleto.html")
    public String boleto() { return "boleto"; }

    @GetMapping("/devolucao.html")
    public String devolucao() { return "devolucao"; }

    @GetMapping("/garantia.html")
    public String garantia() { return "garantia"; }

    @GetMapping("/credito.html")
    public String credito() { return "credito"; }

    @GetMapping("/admin-login.html")
    public String adminLogin() { return "admin-login"; }

    @GetMapping("/admin-acesso.html")
    public String adminAcesso() { return "admin-acesso"; }

    @GetMapping("/admin-solicitacoes.html")
    public String adminSolicitacoes() { return "admin-solicitacoes"; }

    @GetMapping("/admin-veiculo.html")
    public String adminVeiculo() { return "admin-veiculo"; }

    @GetMapping("/admin-pecas.html")
    public String adminPecas() { return "admin-pecas"; }

    @GetMapping("/admin-auditoria.html")
    public String adminAuditoria() { return "admin-auditoria"; }

    @GetMapping("/admin-cadastro.html")
    public String adminCadastro() { return "admin-veiculo"; }

    @GetMapping("/admin-fornecedor.html")
    public String adminFornecedor() { return "admin-fornecedor"; }

    @GetMapping("/busca-cliente.html")
    public String buscaCliente() { return "busca-cliente"; }

    @GetMapping("/busca-admin.html")
    public String buscaAdmin() { return "busca-admin"; }

    @GetMapping("/admin-estoque.html")
    public String adminEstoque() { return "admin-estoque"; }
}
