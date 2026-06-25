*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Cadastrar peça no painel admin
    Go To    ${BASE_URL}/admin-pecas.html
    Wait Until Page Contains Element    id:form-peca
    Input Text    id:p-nome    Amortecedor Dianteiro
    Input Text    id:p-sku    G8197
    Input Text    id:p-preco    187,00
    Input Text    id:p-estoque    10
    Select From List By Value    id:p-fornecedor    1
    Select From List By Label    id:p-categoria    Suspensão
    Select From List By Label    id:p-tipo    ORIGINAL
    Click Button    xpath://button[contains(text(),'Cadastrar Peça')]
