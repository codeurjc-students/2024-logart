## 📌 Requisitos previos

- Docker instalado ([Guía de instalación](https://docs.docker.com/get-docker/))
- Docker Compose instalado ([Guía de instalación](https://docs.docker.com/compose/install/))
- Tener cuenta en dockerhub y loguearse ([Guía](https://docs.docker.com/docker-hub/quickstart/))

## 🐋 Obtener el archivo docker-compose.yml

Puedes obtener el archivo docker-compose.yml necesario para ejecutar LogArt de dos formas:

1. Descarga directa: Descarga el [archivo](https://github.com/codeurjc-students/2024-logart/blob/main/LogArtApp/docker/docker-compose.yml) desde el repositorio de LogArt.

2. Clonando el repositorio:

```
git clone https://github.com/codeurjc-students/2024-logart.git
cd 2024-logart/LogArtApp/docker
```

## 🐳 Ejecución de la aplicación dockerizada

- Con el repositorio clonado, desde la misma carpeta docker, debemos tener un archivo docker-compose.yml

```
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----        11/12/2024     19:46             78 .dockerignore
-a----        11/12/2024     20:14            527 .env
-a----        11/12/2024     21:28            925 docker-compose.yml
-a----        11/12/2024     19:21            785 Dockerfile
```

- Ejecutar el comando para levantar la aplicación

```
docker compose up
```

- Ahora, tenemos acceso a la aplicación desde el navegador dirigiendonos a https://localhost:8443

-Notas, al usar certificados SSL autofirmados, el navegador puede mostrar una advertencia de seguridad. Deberás clicar en "configuración avanzada" y en "Acceder a localhost (sitio no seguro)".

## Parar la aplicación dockerizada

- Una vez hayamos terminado de usar la aplicación, nos dirigimos a la carpeta docker y ejecutamos el comando

```
docker compose down
```

- Con esto, el contenedor se detendrá y se eliminará. Para volver a usar la aplicación, deberemos volver a ejecutar el comando

```
docker compose up
```

## Credenciales de acceso

LogArt cuenta con tres tipos de usuarios con diferentes niveles de acceso:

### Usuario Administrador

- Username: admin@gmail.com
- Password: admin123
- Permisos: Acceso completo a todas las galerías y objetos de usuarios, capacidad para moderar contenido y acceso al panel de administración.

### Usuario Registardo

- Username: pepe@gmail.com
- Password: hola123
- Permisos: Creación y gestión de objetos propios

### Usuario No Registardo

- Simplemente puede ver la página principal.

## Datos de ejemplo

La aplicación viene preconfigurada con datos de ejemplo que incluyen:

- Disciplinas: Videojuegos, Libros y Canciones.
- Objetos: Diversos objetos, de diversas disciplinas
- Comentarios: Comentarios de ejemplo en algunos objetos.

Desde la aplicación se pueden añadir/modificar estos datos de ejemplo.

## Probar la aplicación dockerizada

- Después de haber realizado algún cambio en la aplicación (por ejemplo, crear un nuevo objeto), y con el contenedor todavía arrancado, abrimos el terminal y nos situamos en la misma carpeta docker, donde debemos ejecutar el comando

```
docker exec -it docker-mongo-1 mongosh --username davidmoreno --password hRcZqOOBm6ick63X --authenticationDatabase admin
```

- Ahora, podemos hacer consultas a la base de datos. Para ver el nuevo objeto, escribimos

```
use logartdb
```

```
show collections
```

```
db.objects.find().pretty()
```
