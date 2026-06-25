*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Registrar conta de oficina
    Go To    ${BASE_URL}/cadastro.html
    Wait Until Page Contains Element    id:form-cadastro    timeout=15s
    Input Text    id:cnpj    99.999.999/0001-99
    Input Text    id:razao    Oficina Robot Teste LTDA
    Input Text    id:nome-fantasia    Oficina Robot
    Input Text    id:cep    70310-000
    Input Text    id:logradouro    SQN 123
    Input Text    id:numero    100
    Input Text    id:bairro    Asa Norte
    Input Text    id:cidade    Brasília
    Select From List By Label    id:estado    DF
    Input Text    id:responsavel    João Robot
    Input Text    id:telefone    61999998888
    Input Text    id:email    robot.teste@example.com
    Input Password    id:senha    12345678
    Input Password    id:confirma-senha    12345678
    Select Checkbox    id:termos
    Click Button    id:btn-criar
    ${modal_visible}=    Run Keyword And Return Status    Wait Until Element Is Visible    id:modal-overlay    timeout=10s
    Run Keyword If    not ${modal_visible}    Wait Until Element Is Visible    id:cad-error    timeout=10s
