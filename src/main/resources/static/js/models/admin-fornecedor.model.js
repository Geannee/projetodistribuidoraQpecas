// ── ADMIN FORNECEDOR MODEL ───────────────────────────────────────────────────

const AdminFornecedorModel = {

    async getFornecedores() {
        try {
            const token = sessionStorage.getItem('qp_token');
            const response = await fetch('http://localhost:8080/fabricantes/historico', {
                    method: "GET",
                    headers: {
                        ContentType: "application/json",
                        Authorization: token ? `Bearer ${token}` : ''
                    }
                }
            );
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Sessão expirada ou usuário não autorizado');
                }
                throw new Error('Erro ao buscar histórico de fornecedores');
            }
            return await response.json();
        } catch (error) {
            console.error("Erro no Model de Fornecedores:", error);
            return [];
        }
    },

    async salvarFornecedor(dados) {
        try {
            const response = await fetch('http://localhost:8080/fabricantes/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome: dados.nome,
                    cnpj: dados.cnpj.replace(/\D/g, '') // Send numeric characters only to backend
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Erro ao cadastrar fornecedor');
            }
            return await response.text();
        } catch (error) {
            console.error("Erro ao salvar no Model:", error);
            throw error;
        }
    }
};
