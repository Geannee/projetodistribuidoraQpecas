*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Fazer pedido completo
    Go To    ${BASE_URL}/busca.html
    Wait Until Page Contains Element    id:stab-btn-placa    timeout=15s
    Click Button    id:stab-btn-placa
    Input Text    id:plateInput    ABC1234
    Click Element    xpath://div[@id='stab-placa']//button[contains(text(),'Buscar →')]
    Wait Until Element Is Visible    id:resultSection    timeout=15s
    Click Element    xpath:(//div[@id='resultSection']//button[contains(text(),'+ Add')])[1]

    Go To    ${BASE_URL}/carrinho.html
    Wait Until Page Contains Element    id:cartItems
    Input Text    id:cepInput    70310-000
    Click Button    id:btnCalcularFrete
    Wait Until Element Is Visible    id:deliveryAddressForm    timeout=15s
    Input Text    id:numeroInput    100
    Input Text    id:complementoInput    Sala 1
    Click Button    xpath://button[contains(text(),'Finalizar Pedido')]
    ${redirected}=    Run Keyword And Return Status    Wait Until Location Contains    /pedidos.html    timeout=10s
    Run Keyword If    not ${redirected}    Wait Until Location Contains    /login.html    timeout=10s
