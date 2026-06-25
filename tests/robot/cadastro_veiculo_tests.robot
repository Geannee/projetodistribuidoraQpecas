*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Cadastrar veículo no painel admin
    Go To    ${BASE_URL}/admin-veiculo.html
    Wait Until Page Contains Element    id:form-veiculo
    Input Text    id:v-marca    Volkswagen
    Input Text    id:v-modelo    Gol
    Input Text    id:v-ano    2020
    Select From List By Label    id:v-combustivel    Flex
    Input Text    id:v-chassi    9BWAL45U0KT104252
    Input Text    id:v-placa    PBQ2694
    Click Button    xpath://button[contains(text(),'Cadastrar Veículo')]
