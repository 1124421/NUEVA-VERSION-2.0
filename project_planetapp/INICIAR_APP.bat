@echo off
title PlanetApp Server Launcher
color 0A
echo.
echo ===================================================
echo      INICIANDO PLANETAPP
echo ===================================================
echo.

echo 1. Comprobando ubicacion...
if exist "backend\gradlew.bat" (
    cd backend
    echo    - Detectada carpeta backend
) else (
    if exist "C:\Users\Johana\Documents\project_planetapp\backend\gradlew.bat" (
        cd /d "C:\Users\Johana\Documents\project_planetapp\backend"
        echo    - Ruta absoluta corregida
    ) else (
        echo [ERROR] No encuentro el archivo 'gradlew.bat'.
        echo Asegurate de estar en la carpeta project_planetapp.
        pause
        exit
    )
)

echo.
echo 2. Limpiando procesos (si existen)...
:: Solo intentamos cerrar si hay algo colgado en puertos, pero con cuidado
netstat -ano | findstr :8082 >NUL
if %errorlevel%==0 (
    echo    - Cerrando puerto 8082 ocupado...
    for /f "tokens=5" %%a in ('netstat -aon ^| find ":8082"') do taskkill /F /PID %%a 2>NUL
)

echo.
echo 3. Iniciando servidor...
echo    La pantalla se mantendra abierta. Si falla, veras el error.
echo.

:: Lanzar navegador
start "" "http://localhost:8082/pages/panel-inicio.html"

:: Ejecutar Gradle
call gradlew.bat bootRun

:: Si gradlew termina, pausamos para ver el error
echo.
echo ===================================================
echo    El servidor se ha detenido.
echo ===================================================
pause
