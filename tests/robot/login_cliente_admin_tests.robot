*** Settings ***
Resource    resource.robot
Suite Setup       Open Browser To App
Suite Teardown    Close Browser Session

*** Test Cases ***
Login do cliente
    Go To    ${BASE_URL}/login.html
    Wait Until Page Contains Element    id:login-form    timeout=15s
    Input Text    id:email    ${LOGIN_USER}
    Input Password    id:senha    ${LOGIN_PASS}
    Click Button    id:btn-entrar
    Wait Until Page Contains Element    id:error-msg    timeout=20s

Login do administrador
    Go To    ${BASE_URL}/admin-login.html
    Wait Until Page Contains Element    id:login-form    timeout=15s
    Input Text    id:email    admin@queropecas.com
    Input Password    id:senha    admin123
    Click Button    id:btn-entrar
    Wait Until Page Contains Element    id:login-form    timeout=20s
