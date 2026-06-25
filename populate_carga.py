import json
import urllib.request
import urllib.error
import os
import mariadb

API_URL = "http://localhost:8080"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "root",
    "database": "quero_pecas_db"
}

# Variable global para armazenar o token JWT
token = None

print("\n==================================================")
print("1. Verificando e Cadastrando o Usuário Inicial...")
print("==================================================")

usuario_payload = {
    "cnpj": "14.138.955/0001-14",
    "razaoSocial": "Eu Loja LTDA",
    "nomeFantasia": "Loja Mecanico",
    "representanteLegal": "Claudinho do Pneu",
    "senha": "12345678",
    "email": "umemail@email.com",
    "endereco": {
        "cep": "72660-000",
        "logradouro": "Mecanica Boa",
        "numero": 1,
        "bairro": "Alegria",
        "cidadeUf": "Borracha / BR"
    },
    "telefone": [{
        "telefone": "61 123456789",
        "tipo": "numerico"
    }]
}

try:
    conn = mariadb.connect(**DB_CONFIG)
    cursor = conn.cursor()

    cursor.execute("SELECT id_usuario FROM usuario WHERE email = %s", (usuario_payload["email"],))
    usuario_existente = cursor.fetchone()

    if usuario_existente:
        print(f"⏭ O usuário '{usuario_payload['email']}' já existe no banco. Pulando cadastro.")
        cursor.close()
        conn.close()
    else:
        print("🆕 Usuário não encontrado. Iniciando cadastro via API...")
        cursor.close()
        conn.close()

        req_user_data = json.dumps(usuario_payload).encode("utf-8")
        req_user = urllib.request.Request(f"{API_URL}/usuarios/", data=req_user_data, headers={"Content-Type": "application/json"})

        with urllib.request.urlopen(req_user) as res:
            print("✔ Usuário cadastrado via API (Padrão: Mecânico).")

        print("🔄 Atualizando privilégios no MariaDB...")
        conn = mariadb.connect(**DB_CONFIG)
        cursor = conn.cursor()

        query = """
            UPDATE usuario
            SET tipo_usuario = 'DISTRIBUIDOR', ativo = 1
            WHERE email = %s
        """
        cursor.execute(query, (usuario_payload["email"],))
        conn.commit()

        print(f"✔ Tipo do usuário '{usuario_payload['email']}' alterado para 'DISTRIBUIDOR'!")
        cursor.close()
        conn.close()

except urllib.error.HTTPError as e:
    erro_detalhado = e.read().decode("utf-8")
    print(f"❌ Erro {e.code} no Cadastro de Usuário! Resposta do seu Backend:\n{erro_detalhado}")
    exit(1)
except mariadb.Error as db_err:
    print(f"❌ Erro no banco de dados MariaDB: {db_err}")
    exit(1)
except Exception as e:
    print(f"❌ Erro geral ao processar usuário: {e}")
    exit(1)


print("\n==================================================")
print("2. Efetuando login para capturar o token de acesso...")
print("==================================================")

login_payload = {"login": usuario_payload["email"], "senha": usuario_payload["senha"]}

req_data = json.dumps(login_payload).encode("utf-8")
req_auth = urllib.request.Request(f"{API_URL}/auth/", data=req_data, headers={"Content-Type": "application/json"})

try:
    with urllib.request.urlopen(req_auth) as res:
        res_data = json.loads(res.read().decode("utf-8"))
        token = res_data["token"]
        print("✔ Autenticado com sucesso! Token JWT guardado.")
except urllib.error.HTTPError as e:
    erro_detalhado = e.read().decode("utf-8")
    print(f"❌ Erro {e.code} na Autenticação! Resposta do seu Backend:\n{erro_detalhado}")
    print("\n💡 DICA: Verifique se o seu controller de Auth espera a chave 'login' ou 'email'.")
    exit(1)
except Exception as e:
    print(f"❌ Erro inesperado ao autenticar: {e}")
    exit(1)

if not token:
    print("❌ Token não pôde ser gerado. Interrompendo carga para evitar NameError.")
    exit(1)

print("\n==================================================")
print("3. Cadastrando Fabricantes...")
print("==================================================")
mfg_list = [
    {"nome": "Bosch", "cnpj": "12.345.678/0001-90"},
    {"nome": "Monroe", "cnpj": "98.765.432/0001-10"},
    {"nome": "Sachs", "cnpj": "55.444.333/0001-22"}
]
for mfg in mfg_list:
    req_data = json.dumps(mfg).encode("utf-8")
    req = urllib.request.Request(f"{API_URL}/fabricantes/cadastro", data=req_data, headers={"Content-Type": "application/json"})
    try:
        urllib.request.urlopen(req)
        print(f"✔ Fabricante '{mfg['nome']}' cadastrado.")
    except Exception as e:
        print(f"⚠ Fabricante '{mfg['nome']}' já cadastrado ou erro: {e}")


print("\n==================================================")
print("4. Populando 50 Veículos...")
print("==================================================")
veiculos_path = os.path.join(BASE_DIR, 'veiculos_carga.json')
try:
    with open(veiculos_path, 'r', encoding='utf-8') as f:
        veiculos = json.load(f)
except Exception as e:
    print(f"Erro ao ler veiculos_carga.json em {veiculos_path}: {e}")
    exit(1)

for idx, v in enumerate(veiculos, 1):
    req_data = json.dumps(v).encode("utf-8")
    req = urllib.request.Request(
        f"{API_URL}/veiculos/cadastro",
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    try:
        urllib.request.urlopen(req)
        print(f"[{idx:02d}/50] ✔ Veículo {v['marca']} {v['modelo']} ({v['placa']})")
    except Exception as e:
        print(f"[{idx:02d}/50] ❌ Erro ao cadastrar {v['placa']}: {e}")


print("\n==================================================")
print("5. Populando 100 Peças...")
print("==================================================")
pecas_path = os.path.join(BASE_DIR, 'pecas_carga.json')
try:
    with open(pecas_path, 'r', encoding='utf-8') as f:
        pecas = json.load(f)
except Exception as e:
    print(f"Erro ao ler pecas_carga.json em {pecas_path}: {e}")
    exit(1)

for idx, p in enumerate(pecas, 1):
    req_data = json.dumps(p).encode("utf-8")
    req = urllib.request.Request(
        f"{API_URL}/pecas/save",
        data=req_data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )
    try:
        urllib.request.urlopen(req)
        print(f"[{idx:03d}/100] ✔ Peça '{p['nome']}' ({p['codigo']})")
    except Exception as e:
        print(f"[{idx:03d}/100] ❌ Erro ao cadastrar {p['codigo']}: {e}")

print("\n==================================================")
print("✔ Carga finalizada com sucesso!")
print("==================================================")

print("Login: umemail@email.com \nSenha: 12345678")