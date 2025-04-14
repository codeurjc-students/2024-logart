# Diseño de la aplicación

Dividido en 2 partes, el diseño/ideal inicial, y el diseño final

## Diseño/idea inicial:

### Pantalla de inicio (no registrado)

Esta pantalla solo la ves cuando no estás registrado.

Cuenta con una flecha semitransparente abajo para indicar que se puede hacer scroll.
También con un botón para pasar directamente a la pantalla de registro.

Para poder usar la app con todas sus funcionalidades debes estar registrado, pero puedes
usar la función de ver objetos de otros usuarios aún sin registrarte (siempre que ellos decidan
ponerlos públicos). Para ello, pulsaremos en el botón del menú arriba a la derecha y buscaremos
por username.

![Imagen de pantalla de inicio](/DocFiles/images/phase1/unregisteredHome.png)

Al bajar un poco, tienes el carrusel, donde se muestran varios ejemplos en pequeño, y siguiendo el estilo del disco de vinilo, es un carrusel infinito donde se van repitiendo las imágenes.

![Imagen de carrusel](/DocFiles/images/phase1/infiniteCarousel.png)

Por último, abajo del todo tenemos la última sección de la página principal para los no registrados. Un slider en el cual puedes elegir entre varias fotos, para hacerte una idea de cuáles son las 3 disciplinas con las que trabaja nuestra aplicación

![Imagen de slider 1](/DocFiles/images/phase1/sliderER.png)

![Imagen de slider 2](/DocFiles/images/phase1/sliderQui.png)

![Imagen de slider 3](/DocFiles/images/phase1/sliderAF.png)

### Pantalla de Registro

Se accede pulsando el botón en la pantalla de inicio

Aquí podremos registrarnos, para así usar la aplicación en su totalidad, creando objetos y comentarios sobre nuestra experiencia dentro de ellos.

Para registrarse necesitas un username, un email válido, y una contraseña. Es importante que el email sea correcto y verificable, ya que necesitarás superar una comprobación adicional vía mail para poder completar el registro.

![Imagen de registro](/DocFiles/images/phase1/signUp.png)

### Pantalla de Login

Si ya estás registrado, puedes acceder a esta pantalla pulsando el botón correspondiente en la pestaña de registro.

Para logearse, será necesario introducir el username y la contraseña de tu usuario.

Es importante que el email esté validado antes de hacer el login, de lo contrario no podremos acceder a nuestra cuenta.

![Imagen de login](/DocFiles/images/phase1/login.png)

### Pantalla de La Biblioteca

Una vez registrado y logeado, pasas a una pantalla intermedia, donde simplemente tendrás la opción de seleccionar la galería a la que quieres entrar primero.

Esta será la única vez que se verá la pantalla (por sesión), ya que después podrás cambiar entre galerías desde la propia galería.

![Imagen de la biblioteca](/DocFiles/images/phase1/library0.png)
![Imagen de la biblioteca](/DocFiles/images/phase1/libraryGames.png)
![Imagen de la biblioteca](/DocFiles/images/phase1/libraryMusic.png)
![Imagen de la biblioteca](/DocFiles/images/phase1/libraryBooks.png)

### Pantalla de La Galería

Como mencionaba anteriormente, dentro de la propia galería tendremos la opción de cambiar entre ellas, pulsando el botón que a su vez reflejará el nombre de la galería en la que nos encontramos.

Al lado de ese botón, habrá otro para añadir nuevos objetos a la galería.

En cada uno de estos objetos aparecerá un nombre, una foto, un corazón para añadirlo a favoritos, una papelera para eliminar el objeto, y una opción para compartir el objeto con el resto de personas (usuarios y no usuarios de la aplicación)

![Imagen de la galeria Juegos](/DocFiles/images/phase1/galleryGames.png)
![Imagen de la galeria Libros](/DocFiles/images/phase1/galleryBooks.png)
![Imagen de la galeria Canciones](/DocFiles/images/phase1/galleryMusic.png)

### Pantalla de Objeto concreto

Al clicar en un objeto dentro de una galería, entraremos al objeto como tal. Donde podrás añadir la imagen de un mapa si es un videojuego, o los autores si se trata de un libro o una canción.

Además podrás publicar comentarios sobre tu experiencia con ese objeto.

Por último, también podrás editarlo, tanto el objeto en sí, (foto y nombre), como los comentarios/mapa/autores del objeto.

![Imagen de Objeto concreto juego](/DocFiles/images/phase1/objectGame.png)
![Imagen de Objeto concreto libro](/DocFiles/images/phase1/objectBook.png)
![Imagen de Objeto concreto Canciones](/DocFiles/images/phase1/objectMusic.png)

### Pantalla de Perfil

En cualquier momento (y desde cualquier pantalla siempre que estés logeado), podrás acceder al perfil.

Para hacerlo clicaremos en el menú desplegable del header e iremos a perfil.

![Imagen de perfil](/DocFiles/images/phase1/profile.png)

### Pantalla de Admin Dashboard

Del mismo modo, si somos administradores, podremos ir al dashboard del administrador clicando en el menú del header.

Aquí se reflejarán una serie de estadísticas y gráficos ya comentados en la parte de "Gráficos" y "Algoritmo o consulta avanzada"

![Imagen de dashboard](/DocFiles/images/phase1/adminDashboard.png)

### Pantalla de Contacto

Si clicamos en la parte de "Contacto" del header llegaremos a esta pantalla.

Aquí podremos obtener más información sobre los propietarios de la web.

![Imagen de contacto](/DocFiles/images/phase1/contactUs.png)

### Pantalla de Error 404

Si en cualquier momento intentamos acceder a una URL no encontrada, nos mostrará la pantalla de error 404

![Imagen de error](/DocFiles/images/phase1/error404.png)

### Wireframe de navegación de la aplicación

![Imagen de Wireframe de navegación](/DocFiles/images/phase1/navWireframe.png)

## Diseño Final:

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
