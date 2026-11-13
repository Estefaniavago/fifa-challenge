# Santex Academy - FootballAPI

## Descripción del proyecto

FootballAPI es una API desarrollada con NestJS que permite consultar información de jugadores de distintas ediciones del videojuego FIFA, utilizando una base de datos MySQL.

El proyecto utiliza Sequelize como ORM para acceder a los datos y Docker Compose para facilitar la configuración y ejecución de los servicios.

Además, incorpora un sistema de autenticación mediante JWT (JSON Web Token), que permite registrar usuarios, iniciar sesión y proteger los endpoints de consulta de jugadores.

## Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- MySQL 8
- Sequelize
- Docker y Docker Compose
- JWT (JSON Web Token)
- bcrypt
- Swagger

## Requisitos previos

Para ejecutar el proyecto se necesita:

- Docker Desktop.
- Node.js y npm (si se ejecuta el backend directamente desde Windows).
- Git.

## Instalación y ejecución con Docker

1. Instalar y abrir Docker Desktop.

2. Clonar el repositorio:

```bash
git clone <URL_DE_TU_REPOSITORIO>
```

3. Ingresar a la carpeta del proyecto:

```bash
cd football-api
```

4. Crear el archivo de variables de entorno a partir del archivo de ejemplo:

```bash
cp .env.sample .env
```

5. Configurar las variables de entorno necesarias en `.env`. Entre ellas se encuentran los datos de conexión a MySQL y el secreto utilizado para firmar los tokens JWT.

6. Levantar los servicios:

```bash
docker compose up --build
```

Docker Compose inicia MySQL, el backend y el frontend, según la configuración del proyecto.

El backend queda disponible en:

`http://localhost:3000`

El frontend queda disponible en:

`http://localhost:4200`

La documentación interactiva de Swagger se encuentra en:

`http://localhost:3000/docs`

La base de datos MySQL se publica en el puerto `3307` del equipo local.

## Ejecución de los servicios por separado

También es posible ejecutar el backend directamente desde Windows y mantener MySQL dentro de Docker.

### 1. Iniciar MySQL

Desde la carpeta `football-api`:

```bash
docker compose up -d mysql_db
```

### 2. Configurar las variables de entorno

Para ejecutar el backend directamente desde Windows, las variables de conexión deben apuntar al puerto publicado por Docker:

```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=football_db
DB_USER=football_api
DB_PASSWORD=password
PORT=3000
JWT_SECRET=definir_una_clave_segura
```

El archivo `.env` debe estar ubicado en la raíz de `football-api`, junto al archivo `docker-compose.yml`.

Cuando el backend se ejecuta dentro de Docker Compose, la conexión a MySQL utiliza el nombre del servicio (`mysql_db`) y el puerto interno `3306`.

### 3. Instalar las dependencias

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

### 4. Ejecutar el backend

Modo desarrollo:

```bash
npm run start:dev
```

Compilación:

```bash
npm run build
```

Modo producción:

```bash
npm run start:prod
```

## Conexión a MySQL desde la terminal

Si se utiliza un cliente MySQL instalado en Windows, la conexión se realiza mediante el puerto `3307`:

```bash
mysql -h 127.0.0.1 -P 3307 --user=football_api --password=password football_db
```

Una vez conectado, se pueden consultar las tablas disponibles:

```sql
SHOW TABLES;
```

Para consultar algunos registros de jugadores:

```sql
SELECT * FROM players LIMIT 5;
```

Para salir de la consola:

```sql
exit;
```

## Reinicialización de la base de datos

El proyecto utiliza un volumen de Docker para persistir los datos de MySQL.

Para detener los servicios y eliminar el volumen de la base de datos:

```bash
docker compose down -v
```

Luego, para levantar nuevamente los servicios:

```bash
docker compose up -d --build
```

Al crearse un volumen nuevo, MySQL ejecuta los scripts SQL ubicados en `docker/db`, que se montan en el directorio de inicialización del contenedor.

**Importante:** los scripts de inicialización se ejecutan únicamente cuando MySQL inicializa un directorio de datos vacío. El comando `docker compose down -v` elimina los datos persistidos, incluidos los registros de `players` y `users`.

Si solamente se necesita reiniciar los contenedores sin borrar los datos, se debe utilizar:

```bash
docker compose down
docker compose up -d
```

## Estructura del backend

La aplicación está organizada en módulos y utiliza una separación por responsabilidades.

```text
backend/
└── src/
    ├── config/
    │   └── sequelize.config.ts
    ├── modules/
    │   ├── auth/
    │   ├── players/
    │   │   ├── dto/
    │   │   ├── entities/
    │   │   ├── interfaces/
    │   │   └── repositories/
    │   └── users/
    ├── app.module.ts
    └── main.ts
```

### Módulo de jugadores

El módulo `PlayersModule` agrupa los componentes necesarios para consultar la información de los jugadores.

- **Controller:** recibe las solicitudes HTTP y procesa los parámetros.
- **Service:** coordina la lógica de consulta.
- **Repository:** implementa el acceso a los datos mediante Sequelize.
- **Entity:** representa la información del jugador dentro de la aplicación.
- **DTO:** define los datos que se devuelven al cliente.

La interfaz `IPlayerRepository` declara las operaciones de acceso a los datos, incluyendo la búsqueda por ID y la consulta paginada con filtros.

### Módulo de autenticación

El módulo `AuthModule` administra el registro y el inicio de sesión de los usuarios.

- **Registro:** permite crear un usuario mediante correo electrónico y contraseña.
- **Encriptación:** utiliza bcrypt para almacenar la contraseña de forma segura mediante un hash.
- **Login:** verifica las credenciales y genera un token JWT.
- **Estrategia JWT:** permite validar los tokens enviados en las solicitudes protegidas.
- **Guard:** controla el acceso a los endpoints que requieren autenticación.

Los endpoints de registro y login son públicos. Las rutas de consulta de jugadores requieren un token válido.

## Configuración técnica

### Conexión a MySQL

La configuración de Sequelize se centraliza en `src/config/sequelize.config.ts` y utiliza variables de entorno para definir:

- Host y puerto.
- Nombre de la base de datos.
- Usuario y contraseña.

La conexión utiliza el dialecto MySQL.

### Registro de modelos y sincronización

Los modelos se registran en los módulos correspondientes mediante `SequelizeModule.forFeature()`.

La configuración utiliza:

```typescript
autoLoadModels: true,
synchronize: false,
```

`autoLoadModels` permite incorporar los modelos registrados en los módulos de NestJS.

`synchronize: false` evita que Sequelize modifique automáticamente la estructura de las tablas existentes. Los cambios de estructura deben gestionarse mediante scripts SQL o migraciones.

### Configuración de la aplicación

La aplicación se inicia desde `main.ts` y utiliza el puerto definido en la variable `PORT`, con `3000` como valor predeterminado.

También se configura:

- CORS para permitir solicitudes desde el frontend.
- Un prefijo global `/api` para las rutas de la API.
- `ValidationPipe` para la validación de datos recibidos.
- Swagger para generar la documentación interactiva.
- Autenticación Bearer mediante JWT.

## Autenticación

La API utiliza JWT para controlar el acceso a los endpoints protegidos.

### Registrar un usuario

- **Método:** POST
- **Ruta:** `/api/auth/register`
- **Descripción:** permite registrar un usuario.

Ejemplo del cuerpo de la solicitud:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}
```

### Iniciar sesión

- **Método:** POST
- **Ruta:** `/api/auth/login`
- **Descripción:** valida las credenciales y devuelve un token de acceso.

Ejemplo del cuerpo de la solicitud:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "tu_contraseña"
}
```

La respuesta contiene el token:

```json
{
  "access_token": "TOKEN_JWT"
}
```

### Utilizar el token

Para acceder a los endpoints protegidos se debe enviar el token en el encabezado HTTP:

```http
Authorization: Bearer TOKEN_JWT
```

En Swagger, se puede utilizar el botón **Authorize**, pegar el valor del `access_token` y autorizar el acceso.

## Endpoints disponibles

Todos los endpoints de jugadores requieren autenticación mediante JWT.

### Jugadores

#### Obtener un jugador por ID

- **Método:** GET
- **Ruta:** `/api/players/:id`
- **Descripción:** permite obtener la información de un jugador utilizando su identificador.

Ejemplo:

```http
GET http://localhost:3000/api/players/1
```

La respuesta contiene los siguientes campos:

```json
{
  "id": 1,
  "name": "Nombre del jugador",
  "club": "Club",
  "position": "Posición",
  "nationality": "Nacionalidad",
  "rating": 90,
  "speed": 85,
  "shooting": 88,
  "dribbling": 90,
  "passing": 87
}
```

Códigos de respuesta:

- `200 OK`: jugador encontrado.
- `400 Bad Request`: el identificador no es un número entero válido.
- `401 Unauthorized`: falta un token válido.
- `404 Not Found`: no se encontró un jugador con el identificador indicado.

#### Listar jugadores

- **Método:** GET
- **Ruta:** `/api/players`
- **Descripción:** permite consultar jugadores de forma paginada y aplicar filtros.

Parámetros disponibles:

| Parámetro | Tipo | Descripción |
|---|---|---|
| `page` | Number | Número de página. Por defecto: 1. |
| `limit` | Number | Cantidad de registros por página. Por defecto: 10. Máximo: 100. |
| `name` | String | Filtra por nombre del jugador. |
| `club` | String | Filtra por nombre del club. |
| `position` | String | Filtra por posición del jugador. |

Ejemplo de consulta:

```http
GET http://localhost:3000/api/players?page=1&limit=5&name=Messi
```

Ejemplo de respuesta:

```json
{
  "data": [
    {
      "id": 1,
      "name": "Lionel Andrés Messi Cuccittini",
      "club": "FC Barcelona",
      "position": "CF",
      "nationality": "Argentina",
      "rating": 93,
      "speed": 93,
      "shooting": 89,
      "dribbling": 96,
      "passing": 86
    }
  ],
  "total": 16,
  "page": 1,
  "limit": 5,
  "totalPages": 4
}
```

Códigos de respuesta:

- `200 OK`: consulta realizada correctamente.
- `400 Bad Request`: parámetros de paginación inválidos.
- `401 Unauthorized`: falta un token válido.

## Documentación interactiva con Swagger

La API incorpora Swagger para consultar y probar los endpoints.

La documentación está disponible en:

`http://localhost:3000/docs`

Desde esta interfaz se puede:

- Consultar los endpoints disponibles.
- Revisar los parámetros de cada operación.
- Consultar los modelos de respuesta.
- Probar el registro y el inicio de sesión.
- Autorizar solicitudes mediante JWT.
- Ejecutar consultas y visualizar las respuestas HTTP.

Para probar los endpoints protegidos, primero se debe iniciar sesión mediante `POST /api/auth/login`, copiar el `access_token` recibido y utilizarlo desde el botón **Authorize**.

## Exploración inicial de la base de datos

La base de datos utilizada para el desafío se denomina `football_db` y contiene una tabla principal llamada `players`, con 63 columnas y 74.086 registros.

La tabla incluye información de los jugadores, como nombre, club, nacionalidad, posición, edad, valoración general (*overall*), potencial y habilidades técnicas, físicas y defensivas.

Durante la exploración se identificó que el campo `id` funciona como clave primaria autoincremental de MySQL. Sin embargo, este identificador corresponde a cada registro y no permite reconocer por sí solo a un mismo jugador entre distintas ediciones del videojuego.

Por este motivo, se analizó el campo `player_face_url` y se comprobó que permite extraer el identificador de jugador utilizado por SoFIFA. Las pruebas realizadas mostraron que este identificador se mantiene entre distintas ediciones, incluso cuando existen variaciones en la escritura del nombre.

También se comprobó que la combinación del identificador SoFIFA y `fifa_version` no presenta registros duplicados en el conjunto analizado. Por lo tanto, se considera una candidata a clave única lógica para identificar a cada jugador dentro de una edición.

El dataset contiene información de FIFA 15, FIFA 16, FIFA 17, FIFA 18 y FIFA 19. Todas las versiones disponibles corresponden a la actualización 2.

Estas comprobaciones permiten conocer la estructura de los datos y establecer criterios iniciales para su posterior consulta y análisis.

## Pruebas realizadas

Se realizaron pruebas funcionales utilizando Swagger para verificar el comportamiento de los endpoints.

| Funcionalidad | Resultado |
|---|---|
| Registro de usuarios | Correcto |
| Inicio de sesión y generación de JWT | Correcto |
| Acceso a rutas protegidas con token | Correcto |
| Listado de jugadores | 200 OK |
| Filtro por nombre | Correcto |
| Filtro por club | Correcto |
| Filtro por posición | Correcto |
| Paginación | Correcto |
| Búsqueda por ID existente | 200 OK |
| Búsqueda por ID inexistente | 404 Not Found |

Entre los resultados obtenidos durante las pruebas:

- El listado general devolvió un total de 74.086 registros.
- La búsqueda por nombre `Messi` encontró 16 coincidencias.
- La búsqueda por club `Barcelona` encontró 335 coincidencias.
- El filtro por posición `ST` encontró 13.520 coincidencias.
- La consulta de un jugador con ID `1` devolvió correctamente sus datos.
- La consulta de un ID inexistente devolvió un error `404 Not Found`.

## Estado actual del desarrollo

Actualmente, el backend cuenta con:

- Configuración de conexión a MySQL.
- Integración de Sequelize con NestJS.
- Registro de los modelos de jugadores y usuarios.
- Consulta de jugadores por ID.
- Listado de jugadores.
- Filtros por nombre, club y posición.
- Paginación de resultados.
- Validación de parámetros.
- Transformación de respuestas mediante `PlayerDto`.
- Registro de usuarios.
- Encriptación de contraseñas mediante bcrypt.
- Inicio de sesión y generación de tokens JWT.
- Protección de endpoints mediante autenticación.
- Documentación interactiva con Swagger.

Las funcionalidades adicionales se incorporarán progresivamente durante el desarrollo del proyecto.