# Santex Academy - FootballAPI

## Pasos para correr

1. Instalar Docker Desktop: Si no lo tienen, es el primer paso.
2. Clonar tu repositorio: 
   
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   ```
3. Navegar a la carpeta del proyecto:
    ```bash
    cd football-api
   ```
4. Copiar las variable de entorno del archivo de ejemplo al de ambiente
    ```bash
    cp .env.sample .env
   ```
5. Levantar todo con: 
   ```bash
    docker compose up
   ```

## Alternativa
Aca las instruciones para correr cada servicio por separado

### Reiniciar los datos

``` bash
docker compose down -v # Esto detiene los contenedores y elimina los volúmenes (incluido db_data)
docker compose up -d   # Esto vuelve a crear todo desde cero, ejecutando init.sql
```

### Conectarse a MySQL desde el Terminal / Consola

```bash
mysql -h 127.0.0.1 -P 3306 --user=football_api --password=password football_db
```

```bash
mysql> SHOW TABLES;
```

```bash
mysql> SELECT * FROM users;
```

```bash
mysql> exit;
```

### Inicializar API

```bash
$ npm install
```

### Compilar y correr el BackEnd

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### Exploración inicial de la base de datos

La base de datos utilizada para el desafío se denomina `football_db` y contiene una tabla principal llamada `players`, con 63 columnas y 74.086 registros.

La tabla incluye información de los jugadores, como nombre, club, nacionalidad, posición, edad, valoración general (*overall*), potencial y habilidades técnicas, físicas y defensivas.

Durante la exploración se identificó que el campo `id` funciona como clave primaria autoincremental de MySQL. Sin embargo, este identificador corresponde a cada registro y no permite reconocer por sí solo a un mismo jugador entre distintas ediciones del videojuego.

Por este motivo, se analizó el campo `player_face_url` y se comprobó que permite extraer el identificador de jugador utilizado por SoFIFA. Las pruebas realizadas mostraron que este identificador se mantiene entre distintas ediciones, incluso cuando existen variaciones en la escritura del nombre.

También se comprobó que la combinación del identificador SoFIFA y `fifa_version` no presenta registros duplicados en el conjunto analizado. Por lo tanto, se considera una candidata a clave única lógica para identificar a cada jugador dentro de una edición.

El dataset contiene información de FIFA 15, FIFA 16, FIFA 17, FIFA 18 y FIFA 19. Todas las versiones disponibles corresponden a la actualización 2.

Estas comprobaciones permiten conocer la estructura de los datos y establecer criterios iniciales para su posterior consulta y análisis.

