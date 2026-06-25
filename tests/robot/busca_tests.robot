*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Buscar peça por placa, aplicação e código
    Go To    ${BASE_URL}/busca.html
    Wait Until Page Contains Element    id:stab-btn-placa
    Click Button    id:stab-btn-placa
    Input Text    id:plateInput    ABC1234
    Click Element    xpath://div[@id='stab-placa']//button[contains(text(),'Buscar →')]
    Wait Until Element Is Visible    id:resultSection    timeout=15s

    Click Button    id:stab-btn-aplicacao
    Select From List By Label    id:appMarca    Chevrolet
    Select From List By Label    id:appModelo    Onix
    Select From List By Label    id:appAno    2020
    Select From List By Label    id:appCategoria    Freios
    Click Element    xpath://div[@id='stab-aplicacao']//button[contains(text(),'Buscar peças →')]
    Wait Until Element Is Visible    id:resultSection    timeout=15s

    Click Button    id:stab-btn-codigo
    Input Text    id:codeInput    GDB 1497
    Click Element    xpath://div[@id='stab-codigo']//button[contains(text(),'Buscar →')]
    Wait Until Element Is Visible    id:resultSection    timeout=15s
