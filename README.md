# Aplicación: LogArt

Alumno: David Moreno Martín

Tutor: Micael Gallego Carrillo

# 🛠️ Herramientas

- [Github Projects](https://github.com/orgs/codeurjc-students/projects/12)
- [Github Pages Documentación API](https://codeurjc-students.github.io/2024-logart/)
- [Postman Documentación API ](https://documenter.getpostman.com/view/40050684/2sAYHwH3u8#16fc5064-f928-4384-bf5f-5e6b81922e60)
- [Video LogArt Demo ](https://youtu.be/jGPRqOFaC10)
- [Figma](https://www.figma.com/design/rCnGcWEIXcScpNjtIBcZKp/wireFrame?node-id=1-2&t=VRMJLtGbOjGuZY8N-1)
- [Blog LogArt: Un giro radical hacia el MERN Stack](https://medium.com/@davidmorenom17/logart-un-giro-radical-hacia-el-mern-stack-060ebde31bc5)
- [Blog LogArt: Construyendo una Aplicación Full-Stack MERN: Empezando con el Backend.](https://medium.com/@davidmorenom17/construyendo-una-aplicación-full-stack-mern-empezando-con-el-backend-da0e0a14fb8d)
- [Blog LogArt: Construyendo una Aplicación Full-Stack MERN: Frontend.](https://medium.com/@davidmorenom17/construyendo-una-aplicación-full-stack-mern-frontend-de824052cd30)
- [Blog LogArt: Testeo e2e en LogArt: Asegurando la Calidad con Jest, Supertest y Playwright.](https://medium.com/@davidmorenom17/testeo-e2e-en-logart-asegurando-la-calidad-con-jest-supertest-y-playwright-cde6b2ff2d59)
- [Blog LogArt: Docker y Docker Compose en LogArt: Simplificando el Desarrollo y Despliegue](https://medium.com/@davidmorenom17/docker-y-docker-compose-en-logart-simplificando-el-desarrollo-y-despliegue-577e25f77956)
- [Blog LogArt: Integración continua con Github Actions:](https://medium.com/@davidmorenom17/integración-continua-con-github-actions-a81b5bc91b1d)
- [Blog LogArt: Entrega Continua con GitHub Actions: Simplificando el Despliegue de Docker](https://medium.com/@davidmorenom17/entrega-continua-con-github-actions-simplificando-el-despliegue-de-docker-08b4043787e8)

<br><br>

# **Fase 0**

# ❓ Palabras clave

<div style="text-align: justify">

**Disciplina**: videojuegos, Libros, Canciones.
<br><br>

**Objeto**: Videojuego, libro o canción perteneciente a una disciplina.
<br><br>

**Galería**: Conjunto de objetos bajo una misma disciplina conforman la galería de esa disciplina.
<br><br>

**Comentario**: Mensaje o post que escribe un Usuario dentro de un Objeto de su propiedad
<br><br>

**Relación KeyWords**: Un Usuario crea un Objeto dentro de una de las tres Disciplinas. Se podría decir que ese Objeto ahora está en la Galería de esa Disciplina. Además, el Usuario puede crear comentarios bajo ese Objeto
<br>
<br>

**Ejemplo KeyWords**: El Usuario David crea el Objeto “Harry Potter” dentro de la Disciplina Libros. La Galería de Libros del usuario ahora tiene un nuevo Objeto, y el Usuario decide escribir un Comentario dentro ese objeto poniendo “¡Voldemort mola!”

</div>

<br><br>

# 📂 Entidades

![Diagrama de entidades](/DocFiles/images/phase1/entityDiagram.png)

<div style="text-align: justify">

Las entidades son **Usuario**, **Disciplina**, **Objetos** y **Comentarios**.
<br>

Están relacionadas de la siguiente forma: Un **Usuario** escoge una **Disciplina**, y crea un **Objeto** dentro de ella. A su vez el **Usuario** puede crear **Comentarios** dentro de los **Objetos** creados. </div>
<br><br>

# 🔧 Funcionalidades y aspectos principales de la aplicación

<div style="text-align: justify">

### **Funcionalidades básicas**:

1. Autenticación y autorización de usuarios:

   - Registro de usuarios con verificación de email.
   - Login/logout seguro.
   - Diferentes roles: no registrado, registrado y administrador.

2. Gestión de objetos y disciplinas:

   - Crear, editar y eliminar objetos dentro de las disciplinas (Libros, Canciones, videojuegos)
   - Filtrar y buscar objetos por nombre.
   - Subida de imágenes relacionadas con los objetos.
   - Mostrar la galería de objetos por disciplina.

3. Comentarios:
   - Permitir a los usuarios registrados crear, editar y eliminar comentarios sobre sus objetos.
   - Visualización de comentarios para cada objeto de forma correcta, dentro del propio objeto.
   - Moderación de comentarios por parte de administradores.
4. Perfiles de usuarios:
   - Creación y edición del perfil, incluyendo la subida de una foto de perfil.

### **Funcionalidades avanzadas**:

1. Autenticación y autorización de usuarios:

   - Recuperación de contraseña a través de email.

2. Gestión de objetos y disciplinas:

   - Compartir objetos con otros usuarios y que estos puedan verlos aún sin estar logeados.
   - Sistema de favoritos o “me gusta” para poder filtrarlos de esa manera.

3. Dashboard de administrador:

   - Creación de un panel de control donde el administrador puede visualizar diferentes gráficos y datos sobre el desempeño de la aplicación.
   - Moderación de objetos por parte de administradores, en el dashboard, dispondrán de una pestaña para ver todos los objetos de la aplicación.

4. Gestión de datos:

   - Algoritmo de análisis de crecimiento, que muestre el aumento o disminución porcentual en un periodo de tiempo.
     <br>
     <br>

### ⚠️ La lista de funcionalidades está abierta a ser ampliada si dichas funcionalidades favorecen la efectividad y comodidad de la web para los usuarios. ⚠️

</div>

<br><br>

# 👦 Tipos de usuarios

<div style="text-align: justify">

**Usuario No registrado**: Podrá ver los objetos de la galería de un usuario, siempre y cuando esa persona haya decidido compartir dicho objeto. No podrá crear ni editar objetos dentro de ninguna galería.

**Usuario registrado**: Podrá ver los objetos de la galería de otro usuario, siempre y cuando esa persona haya decidió compartir dicho objeto. Además, podrá crear nuevos objetos en cada galería y editarlos/eliminarlos a su gusto.

Si los objetos son suyos, dentro podrá añadir/editar/eliminar comentarios sobre su experiencia, y dependiendo del tipo de galería en la que esté el objeto, podrá también añadir una imagen de un mapa (videojuegos) o los autores (libros y Canciones) de dicho objeto.

**Usuario administrador**: En el caso del administrador, podrá ver las galerías y los objetos de todos los usuarios registrados en la aplicación, hayan decidido compartirlos o no. Además de esto, también podrá eliminar los objetos que considere que no son apropiados.

De forma similar, también podrá eliminar los comentarios que existan dentro de cada objeto. Por último el administrador dispondrá de una página especial, en la que podrá ver una serie de estadísticas y gráficos relacionados con el funcionamiento de la aplicación y la creación de objetos/comentarios.

 </div>

# 🔐 Permisos de usuario

<div style="text-align: justify">

Relacionado con lo comentado en el punto anterior, los permisos de los usuarios varían dependiendo del tipo de usuario:

**Usuario anónimo**: No tiene ningún tipo de permiso/responsabilidad, no es dueño de ningún dato/entidad, solo puede ver los objetos de las galerías de ciertos usuarios si ellos así lo desean.

**Usuario registrado**: Tendrá permiso para añadir/eliminar objetos dentro de las galerías, así como los comentarios e imágenes dentro de cada objeto. Será dueño de las entidades Objeto y Comentarios siempre que hayan sido creadas por él.

**Usuario administrador**: Tiene todos los permisos posibles, incluyendo la eliminación de objetos/comentarios de cualquier usuario que no sea administrador, y la posibilidad de entrar a objetos de galerías que los usuarios no hayan decidido compartir. Será dueño de las entidades Objeto y Comentarios, sin importar quien las haya creado

 </div>

# 🖼️ Imágenes

<div style="text-align: justify">

La web permitirá la subida de imágenes en varios sentidos, el primero de ellos a la hora de crear/modificar el perfil, donde podrás añadir una foto de tu gusto. Luego, cuando creas un nuevo objeto, podrás añadir la imagen que mejor represente ese objeto según tu opinión.

Por último, también podrás añadir una imagen dentro de los objetos de la galería “Videojuegos” siendo esta imagen el mapa del juego.

Por lo tanto, las entidades asociadas con imágenes son: **Usuario** (foto de perfil) y **Objeto** (imagen de objeto, y mapa si la disciplina es videojuego)

 </div>

# 📊 Gráficos

<div style="text-align: justify">

En la pantalla de administrador se mostrarán 2 gráficos, ambos sobre una medida de tiempo (días, meses...)

El primero, sobre los objetos creados por parte de los usuarios, y el segundo sobre los comentarios creados dentro de los objetos.

Estos gráficos serán de barra en principio, pudiendo cambiar el estilo en un futuro si el hacerlo refleja mejor los datos.

</div>

# 📧 Tecnología complementaria

<div style="text-align: justify">

Como tecnología complementaría, la web empleará un método de verificación después de registrarse, este método se implementará enviando un correo a los usuarios, que deberán recibir y aceptar para poder usar la aplicación

 </div>

# 📈 Algoritmo o consulta avanzada

<div style="text-align: justify">

En la pestaña de administrador, se mostrarán el número de objetos y comentarios creados por unidad de tiempo, junto a sus respectivos gráficos.

El algoritmo/consulta avanzada consistirá en averiguar (y mostrar en la pantalla) el aumento/disminución en porcentaje de estos.

Por ejemplo -> Objetos totales: 1.239, +20.4% con respecto al mes pasado.
(Reflejado en el wireframe para entenderlo mejor)

 </div>
<br><br><br>

---

# Wireframe pantallas de la aplicación

## Pantalla de inicio (no registrado)

<div style="text-align: justify">Esta pantalla solo la ves cuando no estás registrado.
<br><br>
Cuenta con una flecha semitransparente abajo para indicar que se puede hacer scroll. 
También con un botón para pasar directamente a la pantalla de registro.
<br><br>
Para poder usar la app con todas sus funcionalidades debes estar registrado, pero puedes
usar la función de ver objetos de otros usuarios aún sin registrarte (siempre que ellos decidan 
ponerlos públicos). Para ello, pulsaremos en el botón del menú arriba a la derecha y buscaremos
por username.
<br><br>

![Imagen de pantalla de inicio](DocFiles/images/phase1/unregisteredHome.png)

Al bajar un poco, tienes el carrusel, donde se muestran varios ejemplos en pequeño, y siguiendo el estilo del disco de vinilo, es un carrusel infinito donde se van repitiendo las imágenes.
<br><br>

![Imagen de carrusel](DocFiles/images/phase1/infiniteCarousel.png)

Por último, abajo del todo tenemos la última sección de la página principal para los no registrados. Un slider en el cual puedes elegir entre varias fotos, para hacerte una idea de cuáles son las 3 disciplinas con las que trabaja nuestra aplicación
<br><br>

![Imagen de slider 1](DocFiles/images/phase1/sliderER.png)

![Imagen de slider 2](DocFiles/images/phase1/sliderQui.png)

![Imagen de slider 3](DocFiles/images/phase1/sliderAF.png)

</div>

## Pantalla de Registro

<div style="text-align: justify"> Se accede pulsando el botón en la pantalla de inicio
<br><br>
Aquí podremos registrarnos, para así usar la aplicación en su totalidad, creando objetos y comentarios sobre nuestra experiencia dentro de ellos.
<br><br>
Para registrarse necesitas un username, un email válido, y una contraseña. Es importante que el email sea correcto y verificable, ya que necesitarás superar una comprobación adicional vía mail para poder completar el registro. </div>
<br>

![Imagen de registro](DocFiles/images/phase1/signUp.png)

## Pantalla de Login

<div style="text-align: justify"> Si ya estás registrado, puedes acceder a esta pantalla pulsando el botón correspondiente en la pestaña de registro.
<br><br>
Para logearse, será necesario introducir el username y la contraseña de tu usuario.
<br><br>
Es importante que el email esté validado antes de hacer el login, de lo contrario no podremos acceder a nuestra cuenta. </div>
<br>

![Imagen de login](DocFiles/images/phase1/login.png)

## Pantalla de La Biblioteca

<div style="text-align: justify"> Una vez registrado y logeado, pasas a una pantalla intermedia, donde simplemente tendrás la opción de seleccionar la galería a la que quieres entrar primero.
<br><br>
Esta será la única vez que se verá la pantalla (por sesión), ya que después podrás cambiar entre galerías desde la propia galería.

</div>
<br>

![Imagen de la biblioteca](DocFiles/images/phase1/library0.png)
![Imagen de la biblioteca](DocFiles/images/phase1/libraryGames.png)
![Imagen de la biblioteca](DocFiles/images/phase1/libraryMusic.png)
![Imagen de la biblioteca](DocFiles/images/phase1/libraryBooks.png)

## Pantalla de La Galería

<div style="text-align: justify"> Como mencionaba anteriormente, dentro de la propia galería tendremos la opción de cambiar entre ellas, pulsando el botón que a su vez reflejará el nombre de la galería en la que nos encontramos.
<br><br>
Al lado de ese botón, habrá otro para añadir nuevos objetos a la galería.
<br><br>
En cada uno de estos objetos aparecerá un nombre, una foto, un corazón para añadirlo a favoritos, una papelera para eliminar el objeto, y una opción para compartir el objeto con el resto de personas (usuarios y no usuarios de la aplicación) </div>
<br>

![Imagen de la galeria Juegos](DocFiles/images/phase1/galleryGames.png)
![Imagen de la galeria Libros](DocFiles/images/phase1/galleryBooks.png)
![Imagen de la galeria Canciones](DocFiles/images/phase1/galleryMusic.png)

## Pantalla de Objeto concreto

<div style="text-align: justify"> Al clicar en un objeto dentro de una galería, entraremos al objeto como tal. Donde podrás añadir la imagen de un mapa si es un videojuego, o los autores si se trata de un libro o una canción.
<br><br>
Además podrás publicar comentarios sobre tu experiencia con ese objeto.
<br><br>
Por último, también podrás editarlo, tanto el objeto en sí, (foto y nombre), como los comentarios/mapa/autores del objeto. </div>
<br>

![Imagen de Objeto concreto juego](DocFiles/images/phase1/objectGame.png)
![Imagen de Objeto concreto libro](DocFiles/images/phase1/objectBook.png)
![Imagen de Objeto concreto Canciones](DocFiles/images/phase1/objectMusic.png)

## Pantalla de Perfil

<div style="text-align: justify"> En cualquier momento (y desde cualquier pantalla siempre que estés logeado), podrás acceder al perfil.
<br><br>
Para hacerlo clicaremos en el menú desplegable del header e iremos a perfil.
 </div>
<br>

![Imagen de perfil](DocFiles/images/phase1/profile.png)

## Pantalla de Admin Dashboard

<div style="text-align: justify"> Del mismo modo, si somos administradores, podremos ir al dashboard del administrador clicando en el menú del header.
<br><br>
Aquí se reflejarán una serie de estadísticas y gráficos ya comentados en la parte de "Gráficos" y "Algoritmo o consulta avanzada"
 </div>
<br>

![Imagen de dashboard](DocFiles/images/phase1/adminDashboard.png)

## Pantalla de Contacto

<div style="text-align: justify"> Si clicamos en la parte de "Contacto" del header llegaremos a esta pantalla.
<br><br>
Aquí podremos obtener más información sobre los propietarios de la web.
 </div>
<br>

![Imagen de contacto](DocFiles/images/phase1/contactUs.png)

## Pantalla de Error 404

<div style="text-align: justify"> Si en cualquier momento intentamos acceder a una URL no encontrada, nos mostrará la pantalla de error 404
 </div>
<br>

![Imagen de error](DocFiles/images/phase1/error404.png)

<br>
<br>

# Wireframe de navegación de la aplicación

![Imagen de Wireframe de navegación](DocFiles/images/phase1/navWireframe.png)

<br><br><br><br>

# **Fase 1**

<br>

# 📸 Capturas de pantalla de la aplicación

## Pantalla Hero (home)

<div style="text-align: justify"> Pantalla principal de la aplicación para usuarios no logueados
 </div>
<br>

![Imagen de hero1](DocFiles/images/phase2/hero1home.png)

## Pantalla Hero (FAQ)

<div style="text-align: justify"> Si bajamos, nos encontramos con la sección de preguntas comunes
 </div>
<br>

![Imagen de faq](DocFiles/images/phase2/hero2faq.png)

## Pantalla Hero (carrusel)

<div style="text-align: justify"> Más abajo tenemos un carrusel infinito de imágenes en formato disco de vinilo
 </div>
<br>

![Imagen de carrusel](DocFiles/images/phase2/hero3infcarousel.png)

## Pantalla Hero (slider)

<div style="text-align: justify"> Por último tenemos un slider de imágenes que representan las disciplinas de la app
 </div>
<br>

![Imagen de slider](DocFiles/images/phase2/hero4imgslider.png)

## Pantalla de Registro

<div style="text-align: justify"> Si en cualquier momento durante el hero clicamos en "Registrarse" llegaremos a esta pantalla
 </div>
<br>

![Imagen de registro](DocFiles/images/phase2/register.png)

## Pantalla de Login

<div style="text-align: justify"> Si en cualquier momento clicamos en iniciar sesión, o nos registramos, llegaremos a esta pantalla
 </div>
<br>

![Imagen de login](DocFiles/images/phase2/login.png)

## Pantalla de Galería

<div style="text-align: justify"> Después de iniciar sesión llegaremos a esta pantalla, donde podremos interactuar con los objetos y crear nuevos
 </div>
<br>

![Imagen de galería 1](DocFiles/images/phase2/gallery1.png)

## Pantalla de Galería (continuación)

<div style="text-align: justify"> En la parte de arriba podemos ver una opción para filtrar por nombre, y abajo la paginación
 </div>
<br>

![Imagen de galería 2](DocFiles/images/phase2/gallery2.png)

## Pantalla de selector de disciplina

<div style="text-align: justify"> Si clicamos en el nombre de la disciplina actual, se abre el selector
 </div>
<br>

![Imagen de selector de disciplina](DocFiles/images/phase2/disciplineSelector.png)

## Pantalla de Crear objeto

<div style="text-align: justify"> Si clicamos en el botón de crear objeto, nos saldrá el modal de creación, donde introducir los datos
 </div>
<br>

![Imagen de crearObjeto](DocFiles/images/phase2/createObject.png)

## Pantalla Editar objeto

<div style="text-align: justify"> Si en lugar de clicar en crear objeto, clicamos en "Editar" dentro de la tarjeta del objeto, veremos el modal de edición
 </div>
<br>

![Imagen de editarObject](DocFiles/images/phase2/updateObject.png)

## Pantalla de detalles del objeto

<div style="text-align: justify"> Si clicamos en la tarjeta de un objeto, o su nombre, llegaremos a la pantalla de detalles
 </div>
<br>

![Imagen de detalles1](DocFiles/images/phase2/objectDetail1.png)

## Pantalla de detalles del objeto (continuación)

<div style="text-align: justify"> Podemos ver también la paginación implementada
 </div>
<br>

![Imagen de detalles2](DocFiles/images/phase2/objectDetail2.png)

## Pantalla de editar comentario

<div style="text-align: justify"> Si clicamos en el botón de editar, podremos modificar nuestro comentario
 </div>
<br>

![Imagen de editar comentario](DocFiles/images/phase2/editComment.png)

## Pantalla de perfil

<div style="text-align: justify"> Si clicamos en "perfil" desde el navbar llegaremos a esta pantalla
 </div>
<br>

![Imagen de perfil1](DocFiles/images/phase2/profile1.png)

## Pantalla de perfil (continuación)

<div style="text-align: justify"> Como se puede ver, podemos editar cualquier valor menos la contraseña
 </div>
<br>

![Imagen de perfil2](DocFiles/images/phase2/profile2.png)

## Pantalla de detalles como admin

<div style="text-align: justify"> Si somos admin, desde nuestro dashboard (fase avanzada), llegaremos al objeto de un usuario y podremos moderarlo
 </div>
<br>

![Imagen de detalles admin](DocFiles/images/phase2/objectDetailAdminView1.png)

## Pantalla de detalles como admin (continuación)

<div style="text-align: justify"> Como se puede ver, los comentarios de un administrador tendrán un color diferente para diferenciarlos
 </div>
<br>

![Imagen de detalles admin2](DocFiles/images/phase2/objectDetailAdminView2.png)

## Pantalla de Error

<div style="text-align: justify"> Si en cualquier momento introducimos una url no válida, llegaremos a la pantalla de error
 </div>
<br>

![Imagen de error](DocFiles/images/phase2/404error.png)

<br><br>

# 🗺️ Diagrama de Navegación

<div style="text-align: justify"> Este diagrama muestra cómo se navega entre las diferentes páginas de la aplicación.
 </div>
<br>

![Imagen de wireframe](DocFiles/images/phase2/wireframe.png)

<br><br>

# 🔭 Diagrama de Entidades de la Base de Datos

<div style="text-align: justify"> Este diagrama muestra las entidades de la base de datos y las relaciones entre ellas.
 </div>
<br>

![Imagen de db](DocFiles/images/phase2/databaseSquema.png)

<br><br>

# 📑 Diagrama de clases del backend

<div style="text-align: justify"> Este diagrama muestra las clases de la aplicación y las relaciones entre ellas. (se han excluido clases como seeders o configuración de base de datos, .env, server, etc.)
 </div>
<br>

![Imagen de clasesBackend](DocFiles/images/phase2/final.svg)

<br><br>

# 📝 Diagrama de clases y templates SPA

<div style="text-align: justify"> Este diagrama muestra las páginas y componentes de la aplicación, junto con archivos de contexto y utilidades. Tambien muestra las relaciones entre todos estos. (se han excluido cosas como tailwind, configuración de base de datos, .env, server, etc.)
 </div>
<br>

![Imagen de clasesSPA](DocFiles/images/phase2/finalspa.svg)

<br><br>

# 🚀 Ejecutar test de la aplicación

## Requisitos previos Backend

- Abrir el terminal y situarnos en la carpeta Backend

```
\2024-logart\LogArtApp\backend>
```

- Backend corriendo para inicializar la base de datos

```
 npm start
```

## Requisitos previos Frontend

- Abrir el terminal y situarnos en la carpeta Backend

```
\2024-logart\LogArtApp\backend>
```

- Backend corriendo para inicializar la base de datos

```
 npm start
```

- Situarnos en la carpeta Frontend

```
\2024-logart\LogArtApp\frontend\LogArt-frontend>
```

## Ejecutar test Backend

- Ejecutar el comando

```
npm test
```

## Ejecutar test Frontend

- Con el siguiente comando podemos ejecutar los tests de forma interactiva, mientras vemos en tiempo real en un navegador las pruebas

```
npx playwright test --ui
```

- Con el siguiente comando podemos ejecutar los tests de forma automática.

```
npx playwright test  --project=chromium
```

<br><br>

# 🐋 Construcción de la imagen Docker

## Requisitos previos

- Docker instalado ([Guía de instalación](https://docs.docker.com/get-docker/))
- Docker Compose instalado ([Guía de instalación](https://docs.docker.com/compose/install/))
- Tener cuenta en dockerhub y loguearse ([Guía](https://docs.docker.com/docker-hub/quickstart/))

## Construcción de la imagen

- Abrir el terminal y situarnos en la carpeta raiz del proyecto

```
\2024-logart>
```

- Navegar a la carpeta LogArtApp

```
cd .\LogArtApp\
```

- Ejecutar el comando para construir la imagen, con el tag (-t) y con su ubicación (-f)

```
docker build -t nombre_usuario/nombre_imagen:tag -f docker/Dockerfile .
```

- En este caso:

```
docker build -t davidmorenoo/logartapp:latest17 -f docker/Dockerfile .
```

## Subir la imagen a dockerhub

- Abrir el terminal y situarnos en la carpeta docker

```
cd .\docker\
```

- Ejecutar el comando para subir la imagen a dockerhub

```
docker push nombre_usuario/nombre_imagen:tag
```

- En este caso:

```
docker push davidmorenoo/logartapp:latest17
```

## Enlace al repositorio de dockerhub

- [Repositorio de dockerhub](https://hub.docker.com/r/davidmorenoo/logartapp/tags)

<br><br>

# 🐳 Ejecución de la aplicación dockerizada

- Desde la misma carpeta docker, debemos tener un archivo docker-compose.yml

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

- Ahora, tenemos acceso a la aplicación desde el navegador dirigiendonos a https://localhost

-Notas, al usar certificados SSL autofirmados, el navegador puede mostrar una advertencia de seguridad. Deberás clicar en "configuración avanzada" y en "Acceder a localhost (sitio no seguro)".

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

- Una vez hayamos terminado de usar la aplicación, nos dirigimos a la carpeta docker y ejecutamos el comando

```
docker compose down
```

- Con esto, el contenedor se detendrá y se eliminará. Para volver a usar la aplicación, deberemos volver a ejecutar el comando `docker compose up`

<br><br>

# ▶️ Video de demostración

[LogArt Demo ](https://youtu.be/jGPRqOFaC10)

<br><br><br><br>

# **Fase 2**

## CI/CD Pipeline 🔁

### Integración Continua (CI)

**Tareas automatizadas:**

- ✅ Ejecución de tests e2e automáticos al hacer un pull request
- ✅ Generación de reportes de cobertura de tests frontend: en caso de fallo, se genera una traza de depuración para descargar si así se desea
- ✅ Verificación de credenciales y configuración SSL

  <br>

**Detalles técnicos:**
| Característica | Configuración |
|----------------|----------------|
| Trigger | Al crear un pull-request a `main` |
| Entorno | Ubuntu Latest + Node.js 20.x |
| Pruebas Backend | jest y supertest |
| Pruebas Frontend | Playwright con reporte HTML |
| Artefactos generados | [Playwright Report](https://playwright.dev/docs/running-tests#debugging-tests) |

<br>

### Entrega Continua (CD)

**Flujo automatizado:**

1. 🐳 Construcción de imagen Docker
2. 📦 Publicación en Docker Hub
3. #️⃣ Tagging automático con versión de release y commit

<br>

**Especificaciones:**
| Git Tag | Docker Tags Generados |
|----------------|----------------|
| v2.0.0 | 2.0.0, a158d1c, latest |
| v3.0.0-rc1 | 3.0.0-rc1, a158d1c |
| tags generados en el repositorio de logartapp | [dockerhub](https://hub.docker.com/repository/docker/davidmorenoo/logartapp/) |

<br>

```
docker_image: "davidmorenoo/logartapp"
tags:
  - "{{version}}"   # Versión del release (ej: 2.0.0)
  - "latest"        # Última versión estable
  - "{{sha}}"       # Commit SHA (ej: a158d1c)
```
