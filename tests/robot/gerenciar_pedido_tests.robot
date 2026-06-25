*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Gerenciar pedido no painel admin
    Go To    ${BASE_URL}/admin-pedidos.html
    Wait Until Page Contains Element    id:search-input
    Page Should Contain Element    xpath://table
