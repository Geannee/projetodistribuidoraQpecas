*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Acessar a home da aplicação
    Go To    ${BASE_URL}/
    Wait Until Page Contains    Quero Peças
    Title Should Be    Quero Peças – Distribuidora de Autopeças

Abrir a página de login
    Go To    ${BASE_URL}/login.html
    Wait Until Page Contains    Bem-vindo de volta!
    Page Should Contain Element    id:login-form

Abrir a página de cadastro
    Go To    ${BASE_URL}/cadastro.html
    Wait Until Page Contains    Dados da sua oficina
    Page Should Contain Element    id:form-cadastro

Fazer login com credenciais configuradas
    Run Keyword If    '${LOGIN_USER}' == ''    Fail    Informe ${LOGIN_USER} e ${LOGIN_PASS} antes de executar este teste.
    Go To    ${BASE_URL}/login.html
    Input Text    id:email    ${LOGIN_USER}
    Input Password    id:senha    ${LOGIN_PASS}
    Click Button    id:btn-entrar
    Wait Until Page Contains Element    id:error-msg    timeout=15s
    ${msg}=    Get Text    id:error-msg
    Log    Mensagem retornada: ${msg}
