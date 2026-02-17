# 🌍 PlanetApp - Sistema de Gestión de Materiales y Asociados

Sistema de gestión construido con **Arquitectura Hexagonal** (Ports & Adapters) claramente separado en dos proyectos independientes:

- **Backend**: Java 17 + Spring Boot + PostgreSQL
- **Frontend**: JavaScript Vanilla + Web Components

---

## 📁 Estructura del Proyecto

```
project_planetapp/
│
├── backend/                    # ☕ Backend Java/Spring Boot
│   ├── src/
│   │   └── main/
│   │       ├── java/com/planetapp/
│   │       │   ├── domain/              # Entidades y puertos
│   │       │   ├── application/         # Servicios y DTOs
│   │       │   └── infrastructure/      # Controllers y Config
│   │       └── resources/
│   │           └── application.yml      # Configuración
│   ├── build.gradle
│   ├── gradlew.bat
│   └── README.md               # 📖 Documentación detallada del backend
│
├── frontend/                   # 🎨 Frontend JavaScript
│   ├── src/
│   │   ├── application/        # Casos de uso y DI
│   │   ├── domain/             # Entidades y puertos
│   │   ├── infrastructure/     # Repositorios y API client
│   │   └── presentation/       # Componentes, controllers y páginas
│   ├── public/
│   │   └── index.html
│   └── README.md               # 📖 Documentación del frontend
│
├── .env                        # Variables de entorno
├── start-backend.ps1           # Script para iniciar backend
├── start-frontend.ps1          # Script para iniciar frontend
└── README.md                   # Este archivo
```

---

## 📋 Requisitos Previos

- **Java 17** o superior
- **PostgreSQL** configurado en el puerto **1234**
- **Python** (para servidor de desarrollo del frontend)
- Navegador web moderno

---

## � Inicio Rápido

### Paso 1: Configurar PostgreSQL

Crea la base de datos (usando pgAdmin o psql):

```sql
CREATE DATABASE planetapp_db;
```

Verifica que PostgreSQL esté corriendo en el **puerto 1234**.

### Paso 2: Iniciar el Backend

En PowerShell, desde la raíz del proyecto:

```powershell
.\start-backend.ps1
```

El backend estará en: **http://localhost:8082/api**

### Paso 3: Iniciar el Frontend

En otra terminal de PowerShell:

```powershell
.\start-frontend.ps1
```

El frontend estará en: **http://localhost:3000**

### Paso 4: Abrir la Aplicación

Abre en tu navegador:
```
http://localhost:3000/frontend/public/index.html
```

---

## 📖 Documentación Detallada

### Backend (Java + Spring Boot)

Para entender cómo funciona el backend, cómo acceder a los datos en PostgreSQL y cómo probar la API:

**👉 Lee: [backend/README.md](backend/README.md)**

Incluye:
- Arquitectura hexagonal del backend
- Estructura de las tablas en PostgreSQL
- Cómo probar la API con Swagger
- Cómo ver los datos en la base de datos (pgAdmin, psql, DBeaver)
- Troubleshooting

### Frontend (JavaScript)

Para entender la arquitectura del frontend y cómo se conecta al backend:

**👉 Lee: [frontend/README.md](frontend/README.md)**

Incluye:
- Arquitectura hexagonal del frontend
- Cómo cambiar entre API y LocalStorage
- Estructura de componentes y páginas

---

## 🗄️ Configuración de Base de Datos

La configuración está en el archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=1234
DB_USER=postgres
DB_PASSWORD=2024
DB_NAME=planetapp_db
```

**Importante**: El puerto de PostgreSQL debe ser **1234** (no el puerto por defecto 5432).

---

## 📡 API REST Endpoints

**Base URL**: `http://localhost:8082/api`

### Swagger UI (Documentación Interactiva)

Una vez que el backend esté corriendo:

**http://localhost:8082/api/swagger-ui.html**

### Endpoints Principales

| Recurso | Endpoint | Descripción |
|---------|----------|-------------|
| **Materiales** | |
| | GET `/materiales` | Listar todos los materiales |
| | POST `/materiales` | Crear nuevo material |
| | GET `/materiales/{id}` | Obtener por ID |
| | PUT `/materiales/{id}` | Actualizar |
| | DELETE `/materiales/{id}` | Eliminar |
| | GET `/materiales/buscar?nombre={nombre}` | Buscar por nombre |
| | GET `/materiales/stock-bajo?cantidad={n}` | Stock bajo |
| **Asociados** | |
| | GET `/asociados` | Listar todos los asociados |
| | POST `/asociados` | Crear nuevo asociado |
| | GET `/asociados/{id}` | Obtener por ID |
| | PUT `/asociados/{id}` | Actualizar |
| | DELETE `/asociados/{id}` | Eliminar |
| | PATCH `/asociados/{id}/desactivar` | Desactivar |
| | GET `/asociados/activos` | Listar solo activos |
| | GET `/asociados/documento/{doc}` | Buscar por documento |

---

## 🏗️ Arquitectura Hexagonal

### Flujo Completo (Frontend → Backend → Base de Datos)

```
[Usuario Interactúa]
        ↓
[Página HTML] (frontend/presentation/pages)
        ↓
[Controller JS] (frontend/presentation/controllers)
        ↓
[Caso de Uso JS] (frontend/application/use-cases)
        ↓
[Repository API] (frontend/infrastructure/repositories)
        ↓
[HTTP Request] (Fetch API)
        ↓
────────────────────────────────────────
        ↓
[Controller REST] (backend/infrastructure/controllers)
        ↓
[Service] (backend/application/services)
        ↓
[Repository JPA] (backend/domain/repositories)
        ↓
[PostgreSQL] (Tabla: materiales / asociados)
```

### Beneficios de la Separación

✅ **Mantenimiento**: Cada proyecto (frontend/backend) puede modificarse independientemente

✅ **Escalabilidad**: Puedes desplegar frontend y backend en servidores diferentes

✅ **Testing**: Puedes probar cada capa de forma aislada

✅ **Claridad**: La separación física hace evidente la separación lógica

---

## 🧪 Cómo Probar el Backend

### Opción 1: Swagger UI (Recomendado para principiantes)

1. Inicia el backend: `.\start-backend.ps1`
2. Abre: http://localhost:8082/api/swagger-ui.html
3. Expande un endpoint (ej: `POST /api/materiales`)
4. Click "Try it out"
5. Ingresa datos de ejemplo:

```json
{
  "nombre": "Plástico PET",
  "precioCompra": 10.5,
  "precioVenta": 15.0,
  "stock": 100,
  "unidad": "kg",
  "descripcion": "Plástico reciclado"
}
```

6. Click "Execute"
7. Verás la respuesta inmediatamente

### Opción 2: Frontend

1. Inicia backend y frontend
2. Abre la aplicación en el navegador
3. Navega a "Nuevo Material"
4. Completa el formulario
5. Los datos se guardarán en PostgreSQL

### Opción 3: cURL o Postman

Ver ejemplos en [backend/README.md](backend/README.md)

---

## 🔍 Cómo Ver los Datos Guardados

### pgAdmin (Interfaz Gráfica)

1. Abre **pgAdmin**
2. Conecta a PostgreSQL (puerto 1234)
3. Navega a: planetapp_db → Schemas → public → Tables
4. Click derecho en `materiales` → View/Edit Data → All Rows

### psql (Línea de comandos)

```sql
psql -U postgres -h localhost -p 1234 -d planetapp_db

SELECT * FROM materiales;
SELECT * FROM asociados;
```

### DBeaver (Recomendado)

1. Instala DBeaver Community (gratis)
2. Nueva conexión PostgreSQL:
   - Host: localhost
   - Port: 1234
   - Database: planetapp_db
   - User: postgres
   - Password: 2024
3. Navega a las tablas y visualiza los datos

---

## 💡 Modo de Desarrollo

### Solo Frontend (Sin Backend)

Si quieres trabajar solo en el frontend sin el backend:

Edita `frontend/src/application/DependencyContainer.js`:

```javascript
const USE_API = false; // Usa LocalStorage en vez del backend
```

### Solo Backend (Sin Frontend)

Puedes probar el backend usando solo Swagger UI:

```
http://localhost:8082/api/swagger-ui.html
```

---

## 🐛 Troubleshooting

### El backend no inicia

1. ✅ Verifica que PostgreSQL esté corriendo en el puerto 1234
2. ✅ Verifica que la base de datos `planetapp_db` exista
3. ✅ Verifica que Java 17 esté instalado: `java -version`
4. ✅ Revisa los logs en la consola

### El frontend no se conecta al backend

1. ✅ Verifica que el backend esté corriendo: http://localhost:8082/api/materiales
2. ✅ Abre la consola del navegador (F12) y busca errores CORS
3. ✅ Verifica que `USE_API = true` en `DependencyContainer.js`

### Error "Port 1234 connection refused"

PostgreSQL no está configurado en el puerto 1234. Opciones:
1. Cambia el puerto de PostgreSQL a 1234
2. O actualiza el puerto en `.env` y `backend/src/main/resources/application.yml`

---

## 📚 Documentación Adicional

- **[backend/README.md](backend/README.md)**: Documentación completa del backend
- **[frontend/README.md](frontend/README.md)**: Documentación del frontend
- **ARQUITECTURA_HEXAGONAL.md**: Principios de la arquitectura
- **INTEGRACION_FRONTEND_BACKEND.md**: Guía de integración

---

## 🛠️ Tecnologías

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- PostgreSQL Driver
- Lombok
- SpringDoc OpenAPI

### Frontend
- JavaScript ES6+ (Vanilla)
- Web Components
- Fetch API
- CSS3 / HTML5

---

## 👨‍💻 Desarrollo

### Agregar nueva funcionalidad

#### Backend:
1. Crea la entidad en `backend/src/main/java/com/planetapp/domain/entities/`
2. Crea el repositorio en `domain/repositories/`
3. Crea el servicio en `application/services/`
4. Crea el controlador en `infrastructure/controllers/`

#### Frontend:
1. Crea el caso de uso en `frontend/src/application/use-cases/`
2. Actualiza el cliente API en `frontend/src/infrastructure/api/`
3. Crea la página/componente en `frontend/src/presentation/`

Ver README de cada proyecto para más detalles.

---

¡Tu proyecto está completamente separado y documentado! 🎉

**Siguiente paso**: Revisa [backend/README.md](backend/README.md) para entender cómo funciona el backend paso a paso.
