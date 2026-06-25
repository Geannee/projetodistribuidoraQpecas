#!/bin/bash

# Pega o diretório atual onde o script está salvo
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Nome da pasta do ambiente virtual
VENV_DIR="$DIR/venv"

echo "=================================================="
echo "🔧 Verificando Ambiente Virtual (Python VENV)..."
echo "=================================================="

if [ ! -d "$VENV_DIR" ]; then
    echo "🆕 Criando ambiente virtual em: $VENV_DIR"
    python3 -m venv "$VENV_DIR"

    echo "📦 Ativando venv e instalando 'mariadb'..."
    source "$VENV_DIR/bin/activate"

    # Atualiza o pip e instala o conector do MariaDB
    pip install --upgrade pip
    pip install mariadb
else
    echo "✔ Ambiente virtual encontrado. Ativando..."
    source "$VENV_DIR/bin/activate"
fi

echo -e "\n=================================================="
echo "🚀 Iniciando o script de carga..."
echo -e "==================================================\n"

# 2. Executa o script Python usando o ambiente virtual ativo
python "$DIR/populate_carga.py"

# 3. Desativa o venv ao finalizar (boa prática)
deactivate