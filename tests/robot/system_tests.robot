*** Settings ***
Resource    resource.robot

*** Test Cases ***
Fluxo público principal
    Go To    ${BASE_URL}/
    Wait Until Page Contains    Quero Peças
    Page Should Contain Element    xpath://a[contains(text(),'Cliente Login')]
    Page Should Contain Element    xpath://a[contains(text(),'Admin Login')]
    Page Should Contain Element    xpath://button[contains(text(),'Comprar Peças')]
