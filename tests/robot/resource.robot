*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BASE_URL}    http://localhost:8080
${BROWSER}     chrome
${HEADLESS}    True
${LOGIN_USER}  14138955000114
${LOGIN_PASS}  12345678

*** Keywords ***
Open Browser To App
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window

Close Browser Session
    Close All Browsers
