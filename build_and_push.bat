@echo off

tasklist /FI "IMAGENAME eq Docker Desktop.exe" | find /I "Docker Desktop.exe" >nul
if errorlevel 1 (
    echo Docker Desktop starting ...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    :waitForDocker
    tasklist /FI "IMAGENAME eq Docker Desktop.exe" | find /I "Docker Desktop.exe" >nul
    if errorlevel 1 (
        timeout /t 10 /nobreak >nul
        goto waitForDocker
    )
    timeout /t 2 /nobreak >nul
    echo Docker Desktop successfuly started ...
) 

echo Changing directory client...
cd "client_app"

echo Building Docker image client...
docker build -t makeup-client .

echo Docker login...
docker login

echo Tagging Docker image client...
docker tag makeup-client:latest novakvova/makeup-client:latest

echo Pushing Docker image client to repository...
docker push novakvova/makeup-client:latest

echo Done ---client---!

echo Changing directory api...
cd ".."
cd "WebApi"

echo Building Docker image api...
docker build -t makeup-asp-api . 

echo Tagging Docker image api...
docker tag makeup-asp-api:latest novakvova/makeup-asp-api:latest

echo Pushing Docker image api to repository...
docker push novakvova/makeup-asp-api:latest

echo Done ---api---!
pause

