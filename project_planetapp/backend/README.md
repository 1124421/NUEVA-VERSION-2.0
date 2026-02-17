# ☕ Backend - PlanetApp

Backend de la aplicación PlanetApp construido con **Java 17**, **Spring Boot** y **Arquitectura Hexagonal**.

## 📋 Tecnologías

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL** (Puerto 1234)
- **Lombok** (Para reducir código boilerplate)
- **SpringDoc OpenAPI** (Swagger para documentación de API)
- **Gradle 8.5** (Herramienta de construcción)

## 🏗️ Arquitectura Hexagonal (Ports & Adapters)

```
backend/src/main/java/com/planetapp/
│
├── PlanetAppApplication.java        # 🚀 Clase principal de Spring Boot
│
├── domain/                           # 🎯 CAPA DE DOMINIO (Núcleo del negocio)
│   ├── entities/                    # Entidades del dominio
│   │   ├── Material.java            # Entidad Material
│   │   └── Asociado.java            # Entidad Asociado
│   │
│   └── repositories/                # Puertos (Interfaces)
│       ├── MaterialRepository.java  # Puerto para Material
│       └── AsociadoRepository.java  # Puerto para Asociado
│
├── application/                      # 📋 CAPA DE APLICACIÓN (Casos de uso)
│   ├── dto/                         # Data Transfer Objects
│   │   ├── MaterialDTO.java
│   │   └── AsociadoDTO.java
│   │
│   └── services/                    # Servicios (Casos de uso)
│       ├── MaterialService.java     # Lógica de negocio de Material
│       └── AsociadoService.java     # Lógica de negocio de Asociado
│
└── infrastructure/                   # 🔌 CAPA DE INFRAESTRUCTURA (Adaptadores)
    ├── controllers/                 # Adaptadores de entrada (API REST)
    │   ├── MaterialController.java
    │   └── AsociadoController.java
    │
    └── config/                      # Configuración
        └── CorsConfig.java          # Configuración CORS
```

## 🗄️ Base de Datos PostgreSQL

### Configuración

La configuración de la base de datos se encuentra en:
`src/main/resources/application.yml`

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:1234/planetapp_db
    username: postgres
    password: 2024
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Spring crea/actualiza las tablas automáticamente
    show-sql: true       # Muestra las consultas SQL en la consola
```

### Creación de la Base de Datos

Antes de ejecutar el backend, crea la base de datos:

```sql
CREATE DATABASE planetapp_db;
```

### Tablas Generadas Automáticamente

Spring Boot + JPA crea automáticamente las siguientes tablas:

#### Tabla: `materiales`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | BIGSERIAL PRIMARY KEY | ID autogenerado |
| `nombre` | VARCHAR(100) NOT NULL | Nombre del material |
| `precio_compra` | DOUBLE PRECISION NOT NULL | Precio de compra |
| `precio_venta` | DOUBLE PRECISION NOT NULL | Precio de venta |
| `stock` | INTEGER NOT NULL | Cantidad en stock |
| `unidad` | VARCHAR(50) | Unidad de medida (kg, litros, etc.) |
| `descripcion` | VARCHAR(500) | Descripción del material |
| `fecha_registro` | DATE NOT NULL | Fecha de registro |

#### Tabla: `asociados`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | BIGSERIAL PRIMARY KEY | ID autogenerado |
| `nombre` | VARCHAR(100) NOT NULL | Nombre del asociado |
| `apellido` | VARCHAR(100) NOT NULL | Apellido del asociado |
| `documento` | VARCHAR(20) UNIQUE NOT NULL | Documento de identidad |
| `telefono` | VARCHAR(20) | Teléfono |
| `email` | VARCHAR(100) | Correo electrónico |
| `direccion` | VARCHAR(200) | Dirección |
| `fecha_registro` | DATE NOT NULL | Fecha de registro |
| `activo` | BOOLEAN NOT NULL DEFAULT TRUE | Estado activo/inactivo |

## 🚀 Cómo Ejecutar el Backend

### Opción 1: Usando el Script (Recomendado)

Desde la raíz del proyecto:

```powershell
.\start-backend.ps1
```

### Opción 2: Manualmente con Gradle

```powershell
cd backend
.\gradlew.bat bootRun
```

### Opción 3: Compilar y ejecutar el JAR

```powershell
cd backend
.\gradlew.bat build
java -jar build\libs\planetapp-backend-1.0.0.jar
```

## 📡 API REST Endpoints

El backend expone una API REST en: `http://localhost:8082/api`

### Documentación Swagger

Una vez que el backend esté corriendo, accede a:

**http://localhost:8082/api/swagger-ui.html**

Aquí podrás:
- Ver todos los endpoints disponibles
- Probar los endpoints directamente desde el navegador
- Ver los modelos de datos (DTOs)

### Endpoints de Materiales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/materiales` | Obtener todos los materiales |
| GET | `/materiales/{id}` | Obtener material por ID |
| POST | `/materiales` | Crear nuevo material |
| PUT | `/materiales/{id}` | Actualizar material |
| DELETE | `/materiales/{id}` | Eliminar material |
| GET | `/materiales/buscar?nombre={nombre}` | Buscar por nombre |
| GET | `/materiales/stock-bajo?cantidad={n}` | Materiales con stock bajo |

### Endpoints de Asociados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/asociados` | Obtener todos los asociados |
| GET | `/asociados/{id}` | Obtener asociado por ID |
| GET | `/asociados/documento/{documento}` | Obtener por documento |
| POST | `/asociados` | Crear nuevo asociado |
| PUT | `/asociados/{id}` | Actualizar asociado |
| DELETE | `/asociados/{id}` | Eliminar asociado |
| PATCH | `/asociados/{id}/desactivar` | Desactivar asociado |
| GET | `/asociados/activos` | Obtener solo activos |
| GET | `/asociados/buscar?nombre={nombre}` | Buscar por nombre |

## 🧪 Cómo Probar la API

### 1. Usando Swagger UI (Más Fácil)

1. Inicia el backend
2. Abre: http://localhost:8082/api/swagger-ui.html
3. Selecciona un endpoint (ejemplo: `POST /materiales`)
4. Click en "Try it out"
5. Ingresa los datos en formato JSON:

```json
{
  "nombre": "Plástico PET",
  "precioCompra": 10.50,
  "precioVenta": 15.00,
  "stock": 100,
  "unidad": "kg",
  "descripcion": "Plástico reciclado tipo PET"
}
```

6. Click en "Execute"
7. Verás la respuesta del servidor

### 2. Usando cURL (Línea de comandos)

#### Crear un Material

```powershell
curl -X POST "http://localhost:8082/api/materiales" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Cartón",
    "precioCompra": 5.0,
    "precioVenta": 8.0,
    "stock": 50,
    "unidad": "kg",
    "descripcion": "Cartón reciclado"
  }'
```

#### Obtener todos los Materiales

```powershell
curl -X GET "http://localhost:8082/api/materiales"
```

#### Crear un Asociado

```powershell
curl -X POST "http://localhost:8082/api/asociados" `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento": "12345678",
    "telefono": "3001234567",
    "email": "juan@example.com",
    "direccion": "Calle 123",
    "activo": true
  }'
```

### 3. Usando Postman o Insomnia

1. Descarga e instala Postman o Insomnia
2. Crea una nueva request
3. Método: POST
4. URL: `http://localhost:8082/api/materiales`
5. Headers: `Content-Type: application/json`
6. Body (raw JSON): Ingresa el JSON del material

## 🔍 Cómo Ver los Datos en la Base de Datos

### Opción 1: pgAdmin (Interfaz Gráfica)

1. Abre **pgAdmin**
2. Conecta al servidor PostgreSQL (puerto 1234)
3. Navega a: Servers → PostgreSQL → Databases → planetapp_db → Schemas → public → Tables
4. Right-click en `materiales` o `asociados` → View/Edit Data → All Rows

### Opción 2: psql (Línea de comandos)

```powershell
# Conectar a la base de datos
psql -U postgres -h localhost -p 1234 -d planetapp_db

# Ver todos los materiales
SELECT * FROM materiales;

# Ver todos los asociados
SELECT * FROM asociados;

# Ver materiales con stock bajo
SELECT * FROM materiales WHERE stock < 20;

# Salir
\q
```

### Opción 3: DBeaver (Recomendado)

1. Descarga e instala DBeaver (gratis)
2. Crea una nueva conexión PostgreSQL:
   - Host: localhost
   - Port: 1234
   - Database: planetapp_db
   - Username: postgres
   - Password: 2024
3. Click derecho en la tabla → View Data

## 📊 Flujo de una Petición HTTP

Ejemplo: Crear un Material

```
[Cliente HTTP] - POST /api/materiales
      ↓
[MaterialController] → Recibe el MaterialDTO
      ↓
[MaterialService] → Valida y convierte DTO a Entidad
      ↓
[MaterialRepository (JPA)] → Ejecuta INSERT en PostgreSQL
      ↓
[PostgreSQL] → Guarda el registro en la tabla `materiales`
      ↓
[MaterialRepository] → Retorna la Entidad guardada
      ↓
[MaterialService] → Convierte Entidad a DTO
      ↓
[MaterialController] → Retorna ResponseEntity con el DTO
      ↓
[Cliente HTTP] - Recibe JSON con el material creado
```

## 🐛 Troubleshooting

### Error: "Connection refused" o "Connection to localhost:1234 refused"

**Solución**: PostgreSQL no está corriendo en el puerto 1234.
1. Verifica que PostgreSQL esté iniciado
2. Verifica el puerto en `application.yml`

### Error: "database planetapp_db does not exist"

**Solución**: Crea la base de datos:
```sql
CREATE DATABASE planetapp_db;
```

### Error: "Port 8082 is already in use"

**Solución**: Otro proceso está usando el puerto 8082.
1. Cierra la otra aplicación
2. O cambia el puerto en `application.yml`:
```yaml
server:
  port: 8083  # Cambiar a otro puerto
```

### Ver logs del backend

Los logs se muestran en la consola donde ejecutaste el backend. Busca:
- `Hibernate: ...` → Consultas SQL ejecutadas
- `ERROR` → Errores
- `Started PlanetAppApplication in X seconds` → Backend iniciado correctamente

## 🔧 Desarrollo

### Agregar una nueva entidad

1. Crear entidad en `domain/entities/NuevaEntidad.java`
2. Crear repositorio en `domain/repositories/NuevaEntidadRepository.java`
3. Crear DTO en `application/dto/NuevaEntidadDTO.java`
4. Crear servicio en `application/services/NuevaEntidadService.java`
5. Crear controlador en `infrastructure/controllers/NuevaEntidadController.java`

### Modificar una entidad existente

1. Modifica la clase en `domain/entities/Material.java`
2. Reinicia el backend
3. Spring Boot actualizará la tabla automáticamente (modo `ddl-auto: update`)

### Cambiar puerto de PostgreSQL

Edita `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:NUEVO_PUERTO/planetapp_db
```

## 📚 Recursos Adicionales

- [Documentación de Spring Boot](https://spring.io/projects/spring-boot)
- [Documentación de Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Arquitectura Hexagonal](https://netflixtechblog.com/ready-for-changes-with-hexagonal-architecture-b315ec967749)
