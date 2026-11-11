# Santex Academy - FootballAPI

## Descripción del proyecto

FootballAPI es una API desarrollada con NestJS que permite consultar información de jugadores de distintas ediciones del videojuego FIFA, utilizando una base de datos MySQL.

El proyecto utiliza Sequelize como ORM para acceder a los datos y Docker Compose para facilitar la configuración y ejecución de los servicios.

## Tecnologías utilizadas

- Node.js
- NestJS
- TypeScript
- MySQL 8
- Sequelize
- Docker y Docker Compose

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

   El archivo `.env.sample` contiene los valores necesarios para ejecutar los servicios mediante Docker Compose.

5. Levantar los servicios:

   ```bash
   docker compose up --build
   ```

   Docker Compose inicia MySQL, el backend y el frontend, según la configuración del proyecto.

El backend queda disponible en:

   ```text
   http://localhost:3000
   ```

El frontend queda disponible en:

   ```text
   http://localhost:4200
   ```

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
```

El archivo `.env` debe estar ubicado en la raíz de `football-api`, junto al archivo `docker-compose.yml`.

El archivo `.env.sample` conserva la configuración para Docker Compose, donde el backend se conecta a MySQL mediante `mysql_db:3306`.

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

Actualmente, el archivo de inicialización disponible es `init.sql`.

**Importante:** los scripts de inicialización se ejecutan únicamente cuando MySQL inicializa un directorio de datos vacío. El comando `docker compose down -v` elimina los datos persistidos, incluidos los registros de `players`.

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
    │   └── players/
    │       ├── dto/
    │       ├── entities/
    │       ├── interfaces/
    │       └── repositories/
    ├── app.module.ts
    └── main.ts
```

### Módulo de jugadores

El módulo `PlayersModule` agrupa los componentes necesarios para consultar la información de los jugadores.

- **Controller:** recibe las solicitudes HTTP y valida los parámetros.
- **Service:** coordina la lógica de consulta.
- **Repository:** implementa el acceso a los datos mediante Sequelize.
- **Entity:** representa la información del jugador dentro de la aplicación.
- **DTO:** define los datos que se devuelven al cliente.

La interfaz `IPlayerRepository` declara las operaciones `findAll()` y `findOneById()`. Actualmente, el servicio y el controlador exponen la consulta de un jugador por ID.

## Configuración técnica

### Conexión a MySQL

La configuración de Sequelize se centraliza en `src/config/sequelize.config.ts` y utiliza variables de entorno para definir:

- Host y puerto.
- Nombre de la base de datos.
- Usuario y contraseña.

La conexión utiliza el dialecto MySQL y la codificación `utf8mb4`, que permite almacenar caracteres especiales y diferentes alfabetos.

### Registro de modelos y sincronización

El modelo `PlayerModel` se encuentra registrado en `PlayersModule` mediante `SequelizeModule.forFeature()`.

La configuración utiliza:

```typescript
autoLoadModels: true,
synchronize: false,
```

`autoLoadModels` permite incorporar los modelos registrados en los módulos de NestJS.

`synchronize: false` evita que Sequelize modifique automáticamente la estructura de las tablas existentes. Los cambios de estructura deben gestionarse mediante scripts SQL o migraciones.

### Configuración de la aplicación

La aplicación se inicia desde `main.ts`, utilizando el puerto definido en la variable `PORT`, con `3000` como valor predeterminado.

También se configura CORS para permitir solicitudes desde el frontend disponible en `http://localhost:4200`.

## Endpoints disponibles

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
- `404 Not Found`: no se encontró un jugador con el identificador indicado.

## Exploración inicial de la base de datos

La base de datos utilizada para el desafío se denomina `football_db` y contiene una tabla principal llamada `players`, con 63 columnas y 74.086 registros.

La tabla incluye información de los jugadores, como nombre, club, nacionalidad, posición, edad, valoración general (*overall*), potencial y habilidades técnicas, físicas y defensivas.

Durante la exploración se identificó que el campo `id` funciona como clave primaria autoincremental de MySQL. Sin embargo, este identificador corresponde a cada registro y no permite reconocer por sí solo a un mismo jugador entre distintas ediciones del videojuego.

Por este motivo, se analizó el campo `player_face_url` y se comprobó que permite extraer el identificador de jugador utilizado por SoFIFA. Las pruebas realizadas mostraron que este identificador se mantiene entre distintas ediciones, incluso cuando existen variaciones en la escritura del nombre.

También se comprobó que la combinación del identificador SoFIFA y `fifa_version` no presenta registros duplicados en el conjunto analizado. Por lo tanto, se considera una candidata a clave única lógica para identificar a cada jugador dentro de una edición.

El dataset contiene información de FIFA 15, FIFA 16, FIFA 17, FIFA 18 y FIFA 19. Todas las versiones disponibles corresponden a la actualización 2.

Estas comprobaciones permiten conocer la estructura de los datos y establecer criterios iniciales para su posterior consulta y análisis.

## Estado actual del desarrollo

Actualmente, el backend cuenta con:

- Configuración de conexión a MySQL.
- Integración de Sequelize con NestJS.
- Registro del modelo de jugadores.
- Consulta de un jugador por ID.
- Validación del identificador recibido.
- Transformación de la respuesta mediante `PlayerDto`.
- Configuración de codificación `utf8mb4`.

Las funcionalidades adicionales se incorporarán progresivamente durante el desarrollo del proyecto.