## 📋 Resumen de funcionalidad

LogArt es una aplicación web centrada en la documentación y organización de experiencias personales con diferentes disciplinas artísticas: videojuegos, libros y canciones.

La plataforma permite a los usuarios crear colecciones personalizadas dentro de estas categorías, añadiendo objetos específicos que representan sus experiencias.

Cada objeto creado puede ser personalizado con imágenes, comentarios detallados y metadatos específicos según la disciplina.

La aplicación implementa un sistema completo de autenticación y autorización con diferentes roles de usuario, cada uno con permisos específicos. Los administradores cuentan con herramientas avanzadas de moderación y análisis estadístico, permitiéndoles supervisar el crecimiento y uso de la plataforma a través de gráficos y métricas detalladas.

## ❓ Palabras clave

**Disciplina**: videojuegos, Libros, Canciones.

**Objeto**: Videojuego, libro o canción perteneciente a una disciplina.

**Galería**: Conjunto de objetos bajo una misma disciplina conforman la galería de esa disciplina.

**Comentario**: Mensaje o post que escribe un Usuario dentro de un Objeto de su propiedad

**Relación KeyWords**: Un Usuario crea un Objeto dentro de una de las tres Disciplinas. Se podría decir que ese Objeto ahora está en la Galería de esa Disciplina. Además, el Usuario puede crear comentarios bajo ese Objeto

**Ejemplo KeyWords**: El Usuario David crea el Objeto “Harry Potter” dentro de la Disciplina Libros. La Galería de Libros del usuario ahora tiene un nuevo Objeto, y el Usuario decide escribir un Comentario dentro ese objeto poniendo “¡Voldemort mola!”

## 📂 Diagrama de entidades de la base de datos

- Diagrama básico: Abstracción para entender las relaciones

![Diagrama básico](/DocFiles/images/phase1/entityDiagram.png)

- Diagrama completo: Entidades, junto con sus atributos y relaciones.

![Diagrama completo](/DocFiles/images/phase3/dbdiagram.png)

## 👦 Tipos de usuarios

**Usuario No registrado**: Podrá ver los objetos de la galería de un usuario, siempre y cuando esa persona haya decidido compartir dicho objeto. No podrá crear ni editar objetos dentro de ninguna galería.

**Usuario registrado**: Podrá ver los objetos de la galería de otro usuario, siempre y cuando esa persona haya decidió compartir dicho objeto. Además, podrá crear nuevos objetos en cada galería y editarlos/eliminarlos a su gusto.

Si los objetos son suyos, dentro podrá añadir/editar/eliminar comentarios sobre su experiencia, y dependiendo del tipo de galería en la que esté el objeto, podrá también añadir una imagen de un mapa (videojuegos) o los autores (libros y Canciones) de dicho objeto.

**Usuario administrador**: En el caso del administrador, podrá ver las galerías y los objetos de todos los usuarios registrados en la aplicación, hayan decidido compartirlos o no. Además de esto, también podrá eliminar los objetos que considere que no son apropiados.

De forma similar, también podrá eliminar los comentarios que existan dentro de cada objeto. Por último el administrador dispondrá de una página especial, en la que podrá ver una serie de estadísticas y gráficos relacionados con el funcionamiento de la aplicación y la creación de objetos/comentarios.

## **Funcionalidades básicas**:

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

## **Funcionalidades avanzadas**:

1. Autenticación y autorización de usuarios:

   - Recuperación de contraseña a través de email.

2. Gestión de objetos y disciplinas:

   - Compartir objetos con otros usuarios y que estos puedan verlos aún sin estar logeados.
   - Sistema de favoritos o “me gusta” para poder filtrarlos de esa manera.

3. Dashboard de administrador:

   - Creación de un panel de control donde el administrador puede visualizar diferentes gráficos y datos sobre el desempeño de la aplicación.
   - Moderación de objetos por parte de administradores, en el dashboard, dispondrán de una pestaña para ver todos los objetos de la aplicación y moderar según consideren oportuno.
   - Moderación de usuarios por parte de administradores, en el dashboard, dispondrán de una pestaña para ver todos los usuarios de la aplicación y moderar según consideren oportuno.

4. Gestión de datos:

   - Algoritmo de análisis de crecimiento, que muestre el aumento o disminución porcentual de usuarios/objetos en un periodo de tiempo.

5. Partes optativas:

   - Diseño responsive en móvil (probado en SG-S20Ultra y iPhone 14Pro Max).
   - Utilizar tecnologías de comunicación complementarias a REST, concretamente, WebSockets (Socket.IO) para implementar un sistema de notificaciones en tiempo real que alerte a los administradores cuando un usuario comparte un objeto.
   - Test de integración de todas las funcionalidades de la aplicación, ejecutados automáticamente al hacer un pull-request a main, o ejecutar npm test.
   - Testing UX con usuarios reales, de diferentes edades [25, 34 y 17], y con diferente background [Ingeniero informático, Ingeniero Forestal y Estudiante de Ciencias Sociales]. Los detalles y el plan de acción se incluyen en [TestingUX](./testingUX.md):
     - [Video test 1](https://youtu.be/B9CY7glR-g0)
     - [Video test 2](https://youtu.be/Z8PAVuUZ_U0)
     - [Video test 3](https://youtu.be/L5bwg_cBIrQ)

## 🔐 Permisos de usuario

<div style="text-align: justify">

**Usuario anónimo**: No tiene ningún tipo de permiso/responsabilidad, no es dueño de ningún dato/entidad, solo puede ver los objetos de las galerías de ciertos usuarios si ellos así lo desean.

**Usuario registrado**: Tendrá permiso para añadir/eliminar objetos dentro de las galerías, así como los comentarios e imágenes dentro de cada objeto. Será dueño de las entidades Objeto y Comentarios siempre que hayan sido creadas por él.

**Usuario administrador**: Tiene todos los permisos posibles, incluyendo la eliminación de objetos/comentarios de cualquier usuario que no sea administrador, y la posibilidad de entrar a objetos de galerías que los usuarios no hayan decidido compartir. Será dueño de las entidades Objeto y Comentarios, sin importar quien las haya creado

# 📸 Capturas de pantalla de la aplicación

## Pantalla Hero (home)

Pantalla principal de la aplicación para usuarios no logueados

![Imagen de hero1](/DocFiles/images/phase2/hero1home.png)

## Pantalla Hero (FAQ)

Si bajamos, nos encontramos con la sección de preguntas comunes

![Imagen de faq](/DocFiles/images/phase2/hero2faq.png)

## Pantalla Hero (carrusel)

Más abajo tenemos un carrusel infinito de imágenes en formato disco de vinilo

![Imagen de carrusel](/DocFiles/images/phase2/hero3infcarousel.png)

## Pantalla Hero (slider)

Por último tenemos un slider de imágenes que representan las disciplinas de la app

![Imagen de slider](/DocFiles/images/phase2/hero4imgslider.png)

## Pantalla de Registro

Si en cualquier momento durante el hero clicamos en "Registrarse" llegaremos a esta pantalla

![Imagen de registro](/DocFiles/images/phase2/register.png)

## Pantalla de Login

Si en cualquier momento clicamos en iniciar sesión, o nos registramos, llegaremos a esta pantalla

![Imagen de login](/DocFiles/images/phase2/login.png)

## Pantalla de Galería

Después de iniciar sesión llegaremos a esta pantalla, donde podremos interactuar con los objetos y crear nuevos

![Imagen de galería 1](/DocFiles/images/phase2/gallery1.png)

## Pantalla de Galería (continuación)

En la parte de arriba podemos ver una opción para filtrar por nombre, y abajo la paginación

![Imagen de galería 2](/DocFiles/images/phase2/gallery2.png)

## Pantalla de selector de disciplina

Si clicamos en el nombre de la disciplina actual, se abre el selector

![Imagen de selector de disciplina](/DocFiles/images/phase2/disciplineSelector.png)

## Pantalla de Crear objeto

Si clicamos en el botón de crear objeto, nos saldrá el modal de creación, donde introducir los datos

![Imagen de crearObjeto](/DocFiles/images/phase2/createObject.png)

## Pantalla Editar objeto

Si en lugar de clicar en crear objeto, clicamos en "Editar" dentro de la tarjeta del objeto, veremos el modal de edición

![Imagen de editarObject](/DocFiles/images/phase2/updateObject.png)

## Pantalla de detalles del objeto

Si clicamos en la tarjeta de un objeto, o su nombre, llegaremos a la pantalla de detalles

![Imagen de detalles1](/DocFiles/images/phase2/objectDetail1.png)

## Pantalla de detalles del objeto (continuación)

Podemos ver también la paginación implementada

![Imagen de detalles2](/DocFiles/images/phase2/objectDetail2.png)

## Pantalla de editar comentario

Si clicamos en el botón de editar, podremos modificar nuestro comentario

![Imagen de editar comentario](/DocFiles/images/phase2/editComment.png)

## Pantalla de perfil

Si clicamos en "perfil" desde el navbar llegaremos a esta pantalla

![Imagen de perfil1](/DocFiles/images/phase2/profile1.png)

## Pantalla de perfil (continuación)

Como se puede ver, podemos editar cualquier valor menos la contraseña

![Imagen de perfil2](/DocFiles/images/phase2/profile2.png)

## Pantalla de detalles como admin

Si somos admin, desde nuestro dashboard (fase avanzada), llegaremos al objeto de un usuario y podremos moderarlo

![Imagen de detalles admin](/DocFiles/images/phase2/objectDetailAdminView1.png)

## Pantalla de detalles como admin (continuación)

Como se puede ver, los comentarios de un administrador tendrán un color diferente para diferenciarlos

![Imagen de detalles admin2](/DocFiles/images/phase2/objectDetailAdminView2.png)

## Pantalla de Error

Si en cualquier momento introducimos una url no válida, llegaremos a la pantalla de error

![Imagen de error](/DocFiles/images/phase2/404error.png)

## Pantalla de Recuperación de contraseña 1

Ahora podemos dar a la opción de recuperar contraseña en la pestaña de login

![Imagen de recuperacion1](/DocFiles/images/phase3/pass1.png)

## Pantalla de Recuperación de contraseña 2

Donde deberemos introducir un correo de la aplicación

![Imagen de recuperacion2](/DocFiles/images/phase3/pass2.png)

## Pantalla de Recuperación de contraseña 3

Y obtendremos un mensaje de éxito, independientemente de si el gmail existe o no, para evitar que se puedan hacer acciones maliciosas y sacar correos de usuarios por fuerza bruta

![Imagen de recuperacion3](/DocFiles/images/phase3/pass3.png)

## Pantalla de Recuperación de contraseña 4

Entonces recibiremos en nuestro correo un mensaje como el siguiente

![Imagen de recuperacion4](/DocFiles/images/phase3/pass4.png)

## Pantalla de Recuperación de contraseña 5

Y si aceptamos, nos dará la opción de cambiar la contraseña

![Imagen de recuperacion5](/DocFiles/images/phase3/pass5.png)

## Pantalla de verificación de registro

De manera similar, debemos verificar nuestra cuenta por gmail después de registrarnos, donde al hacerlo iremos a la siguiente pestaña

![Imagen de verificacion mail](/DocFiles/images/phase3/verificacion1.png)

## Pantalla de compartir objeto 1

Ahora, podemos compartir nuestros objetos con cualquier persona, incluso si no tienen cuenta en la aplicación, lo haremos desde dentro del objeto a compartir, y clicando en el botón

![Imagen de share1](/DocFiles/images/phase3/share1.png)

## Pantalla de compartir objeto 2

Ahora veremos el link

![Imagen de share2](/DocFiles/images/phase3/share2.png)

## Pantalla de compartir objeto 3

Este link podrá ser usado por cualquier persona, y si lo usa mientras el dueño sigue compartiendo el objeto, verá la siguiente página

![Imagen de share3](/DocFiles/images/phase3/share3.png)

## Pantalla de compartir objeto 4

Pero si lo usa cuando el dueño ha dejado de compartir el objeto, verá lo siguiente

![Imagen de share4](/DocFiles/images/phase3/share4.png)

## Pantalla de favoritos 1

Se ha añadido la opción de marcar objetos como favoritos para tenerlos siempre a mano en caso de tener muchos objetos, para agregar un objeto a favoritos, lo haremos desde la propia card del objeto, clicando en el corazón

![Imagen de fav1](/DocFiles/images/phase3/fav1.png)

## Pantalla de favoritos 2

Una vez que el objeto está en favoritos, para mostrarlo simplemente debemos clicar en el filtro de favoritos, justo al lado del selector de disciplina

![Imagen de fav2](/DocFiles/images/phase3/fav2.png)

## Pantalla de dashboard de administrador 1

También se ha añadido el dashboard de administrador, que será accesible desde su header

![Imagen de dashboard1](/DocFiles/images/phase3/dashboard1.png)

## Pantalla de dashboard de administrador 2

Una vez aquí, tenemos varias pestañas, la de overview, donde se muestra un resumen general de la aplicación

![Imagen de dashboard2](/DocFiles/images/phase3/dashboard2.png)

## Pantalla de dashboard de administrador 3

La de Usuarios, donde podemos ver unas estadísticas de usuarios, y la gestión de los usuarios por parte de los administradores

![Imagen de dashboard3](/DocFiles/images/phase3/dashboard3.png)

## Pantalla de dashboard de administrador 4

La de Contenido, donde veremos unas estadísticas sobre el contenido de la aplicación y la creación de objetos y comentarios

![Imagen de dashboard4](/DocFiles/images/phase3/dashboard4.png)

## Pantalla de dashboard de administrador 5

La de Actividad, donde veremos las estadísticas de creación de objetos en forma de gráfico de barras, con diferentes pestañas para "Semanal", "Mensual", y "Trimestral"

![Imagen de dashboard5](/DocFiles/images/phase3/dashboard5.png)

## Pantalla de dashboard de administrador 6

La de Crecimiento, donde veremos el análisis de crecimiento para Usuarios, Objetos y Comentarios, comparando diferentes periodos de tiempo, con su respectivo periodo anterior

![Imagen de dashboard6](/DocFiles/images/phase3/dashboard6.png)

## Pantalla de dashboard de administrador 7

La de Objetos, donde podemos ver los objetos de la aplicación, y la gestión de los objetos por parte de los administradores

![Imagen de dashboard7](/DocFiles/images/phase3/dashboard7.png)

## Pantalla de notificación de webSocket 1

Si un usuario comparte un objeto, los administradores recibirán una notificación y el link al objeto, para poder ver y moderar que están compartiendo los usuarios

![Imagen de websocket1](/DocFiles/images/phase3/websocket1.png)

## Pantalla de notificación de webSocket 2

Si clicamos, iremos al objeto

![Imagen de websocket2](/DocFiles/images/phase3/websocket2.png)

## 🗺️ Diagrama de Navegación

Este diagrama muestra cómo se navega entre las diferentes páginas de la aplicación.

![Imagen de wireframe](/DocFiles/images/phase3/wireframe.png)
