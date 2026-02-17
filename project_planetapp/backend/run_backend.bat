@echo off
echo Compilando el proyecto...
call gradlew.bat build -x test
if %errorlevel% neq 0 (
    echo Error en la compilacion.
    pause
    exit /b %errorlevel%
)

echo Iniciando la aplicacion...
java -jar build/libs/planetapp-backend-1.0.0.jar
pause
