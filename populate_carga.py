import json
import urllib.request
import urllib.error
import os

API_URL = "http://localhost:8080"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 1. Login Administrativo
print("==================================================")
print("1. Efetuando login administrativo...")
print("==================================================")
req_data = json.dumps({"login": "doisemail@email.com", "senha": "12345678"}).encode("utf-8")
req = urllib.request.Request(f"{API_URL}/auth/", data=req_data, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as res:
        res_data = json.loads(res.read().decode("utf-8"))
        token = res_data["token"]
        print("✔ Autenticado com sucesso!")
except Exception as e:
    print(f"❌ Erro ao autenticar: {e}")
    print("Verifique se o backend está rodando na porta 8080.")
    exit(1)

# 2. Cadastro de Fabricantes (Bosch 1, Monroe 2, Sachs 3)
print("\n==================================================")
print("2. Cadastrando Fabricantes...")
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

# 3. Cadastra 50 Veículos
print("\n==================================================")
print("3. Populando 50 Veículos...")
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

# 4. Cadastra 100 Peças
print("\n==================================================")
print("4. Populando 100 Peças...")
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
