# Script para iniciar el Backend de PlanetApp
# Asegúrate de que PostgreSQL esté corriendo en el puerto 1234

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "     🚀 INICIANDO BACKEND DE PLANETAPP (Java)          " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe el JAR del wrapper
$wrapperJar = "backend\gradle\wrapper\gradle-wrapper.jar"
if (-not (Test-Path $wrapperJar)) {
    Write-Host "📥 Descargando Gradle Wrapper..." -ForegroundColor Yellow
    $wrapperUrl = "https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar"
    $wrapperDir = "backend\gradle\wrapper"
    
    # Crear directorio si no existe
    if (-not (Test-Path $wrapperDir)) {
        New-Item -ItemType Directory -Path $wrapperDir -Force | Out-Null
    }
    
    try {
        Invoke-WebRequest -Uri $wrapperUrl -OutFile $wrapperJar
        Write-Host "✅ Gradle Wrapper descargado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error al descargar Gradle Wrapper" -ForegroundColor Red
        Write-Host "Por favor, descarga manualmente desde: $wrapperUrl" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

Write-Host "📋 CONFIGURACIÓN DEL BACKEND:" -ForegroundColor Cyan
Write-Host "   ├─ Tecnología: Java 17 + Spring Boot" -ForegroundColor White
Write-Host "   ├─ Base de datos: PostgreSQL" -ForegroundColor White
Write-Host "   ├─ Puerto PostgreSQL: 1234" -ForegroundColor White
Write-Host "   ├─ Puerto Backend API: 8082" -ForegroundColor White
Write-Host "   └─ URL API: http://localhost:8082/api" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
Write-Host "   1. Asegúrate de que PostgreSQL esté corriendo en el puerto 1234" -ForegroundColor Yellow
Write-Host "   2. Verifica que la base de datos 'planetapp_db' exista" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔧 Compilando y ejecutando backend..." -ForegroundColor Cyan
Write-Host "   (Esto puede tardar unos minutos la primera vez)" -ForegroundColor Gray
Write-Host ""

# Ir al directorio backend y ejecutar
Set-Location backend

# Ejecutar el backend
.\gradlew.bat bootRun

Set-Location ..
