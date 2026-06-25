*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Liberar cadastro de usuário no painel admin
    Go To    ${BASE_URL}/admin-login.html
    Wait Until Page Contains Element    id:login-form
    Input Text    id:email    admin@queropecas.com
    Input Password    id:senha    admin123
    Click Button    id:btn-entrar
    Go To    ${BASE_URL}/admin-acesso.html
    Wait Until Page Contains Element    id:tbody-bloqueados
    Page Should Contain Element    xpath://table
