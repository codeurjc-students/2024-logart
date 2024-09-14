# Aplicación: LogArt
Alumno: David Moreno Martín

Tutor: Micael Gallego Carrillo

# 🛠️ Herramientas

- [Github Projects](https://github.com/users/DavidMorenoo/projects/1/views/1)
- [Blog]()
- [Figma](https://www.figma.com/design/rCnGcWEIXcScpNjtIBcZKp/wireFrame?node-id=1-2&t=VRMJLtGbOjGuZY8N-1)
<br><br>

# ❓ Palabras clave

<div style="text-align: justify">

**Disciplina**: videojuegos, Lectura, música.
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

**Ejemplo KeyWords**: El Usuario David crea el Objeto “Harry Potter” dentro de la Disciplina Lectura. La Galería de Libros del usuario ahora tiene un nuevo Objeto, y el Usuario decide escribir un Comentario dentro ese objeto poniendo “¡Voldemort mola!”

</div>

<br><br>

# 📂 Entidades

![Diagrama de entidades](/DocFiles/images/entityDiagram.png)

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

   - Crear, editar y eliminar objetos dentro de las disciplinas (lectura, música, videojuegos)
   - Filtrar y buscar objetos por nombre.
   - Subida de imágenes relacionadas con los objetos.
   - Mostrar la galería de objetos por disciplina.
   - Moderación de objetos por parte de administradores.
3. Comentarios
   - Permitir a los usuarios registrados crear, editar y eliminar comentarios sobre sus objetos.
   - Visualización de comentarios para cada objeto de forma correcta, dentro del propio objeto.
   - Moderación de comentarios por parte de administradores.
4. Perfiles de usuarios y dashboard administrador
   - Creación y edición del perfil, incluyendo la subida de una foto de perfil.
   - Creación de un panel de control donde el administrador puede visualizar diferentes gráficos y datos sobre el desempeño de la aplicación.


### **Funcionalidades avanzadas**:

1. Autenticación y autorización de usuarios:

   - Recuperación de contraseña a través de email.
2. Gestión de objetos y disciplinas:

   - Compartir objetos con otros usuarios y que estos puedan verlos aún sin estar logeados.
   - Sistema de favoritos o “me gusta” para poder filtrarlos de esa manera.
3. Gestión de datos:

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

Si los objetos son suyos, dentro podrá añadir/editar/eliminar comentarios sobre su experiencia, y dependiendo del tipo de galería en la que esté el objeto, podrá también añadir una imagen de un mapa (videojuegos) o los autores (libros y música) de dicho objeto.

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

![Imagen de pantalla de inicio](DocFiles/images/unregisteredHome.png) 


Al bajar un poco, tienes el carrusel, donde se muestran varios ejemplos en pequeño, y siguiendo el estilo del disco de vinilo, es un carrusel infinito donde se van repitiendo las imágenes.
<br><br>

![Imagen de carrusel](DocFiles/images/infiniteCarousel.png)

Por último, abajo del todo tenemos la última sección de la página principal para los no registrados. Un slider en el cual puedes elegir entre varias fotos, para hacerte una idea de cuáles son las 3 disciplinas con las que trabaja nuestra aplicación
<br><br>

![Imagen de slider 1](DocFiles/images/sliderER.png)

![Imagen de slider 2](DocFiles/images/sliderQui.png)

![Imagen de slider 3](DocFiles/images/sliderAF.png)

</div>





## Pantalla de Registro

<div style="text-align: justify"> Se accede pulsando el botón en la pantalla de inicio
<br><br>
Aquí podremos registrarnos, para así usar la aplicación en su totalidad, creando objetos y comentarios sobre nuestra experiencia dentro de ellos.
<br><br>
Para registrarse necesitas un username, un email válido, y una contraseña. Es importante que el email sea correcto y verificable, ya que necesitarás superar una comprobación adicional vía mail para poder completar el registro. </div>
<br>


![Imagen de registro](DocFiles/images/signUp.png)

## Pantalla de Login

<div style="text-align: justify"> Si ya estás registrado, puedes acceder a esta pantalla pulsando el botón correspondiente en la pestaña de registro.
<br><br>
Para logearse, será necesario introducir el username y la contraseña de tu usuario.
<br><br>
Es importante que el email esté validado antes de hacer el login, de lo contrario no podremos acceder a nuestra cuenta. </div>
<br>


![Imagen de login](DocFiles/images/login.png)

## Pantalla de La Biblioteca

<div style="text-align: justify"> Una vez registrado y logeado, pasas a una pantalla intermedia, donde simplemente tendrás la opción de seleccionar la galería a la que quieres entrar primero.
<br><br>
Esta será la única vez que se verá la pantalla (por sesión), ya que después podrás cambiar entre galerías desde la propia galería.

</div>
<br>


![Imagen de la biblioteca](DocFiles/images/library0.png)
![Imagen de la biblioteca](DocFiles/images/libraryGames.png)
![Imagen de la biblioteca](DocFiles/images/libraryMusic.png)
![Imagen de la biblioteca](DocFiles/images/libraryBooks.png)

## Pantalla de La Galería

<div style="text-align: justify"> Como mencionaba anteriormente, dentro de la propia galería tendremos la opción de cambiar entre ellas, pulsando el botón que a su vez reflejará el nombre de la galería en la que nos encontramos.
<br><br>
Al lado de ese botón, habrá otro para añadir nuevos objetos a la galería.
<br><br>
En cada uno de estos objetos aparecerá un nombre, una foto, un corazón para añadirlo a favoritos, una papelera para eliminar el objeto, y una opción para compartir el objeto con el resto de personas (usuarios y no usuarios de la aplicación) </div>
<br>


![Imagen de la galeria Juegos](DocFiles/images/galleryGames.png)
![Imagen de la galeria Libros](DocFiles/images/galleryBooks.png)
![Imagen de la galeria Música](DocFiles/images/galleryMusic.png)

## Pantalla de Objeto concreto

<div style="text-align: justify"> Al clicar en un objeto dentro de una galería, entraremos al objeto como tal. Donde podrás añadir la imagen de un mapa si es un videojuego, o los autores si se trata de un libro o una canción.
<br><br>
Además podrás publicar comentarios sobre tu experiencia con ese objeto.
<br><br>
Por último, también podrás editarlo, tanto el objeto en sí, (foto y nombre), como los comentarios/mapa/autores del objeto. </div>
<br>


![Imagen de Objeto concreto juego](DocFiles/images/objectGame.png)
![Imagen de Objeto concreto libro](DocFiles/images/objectBook.png)
![Imagen de Objeto concreto música](DocFiles/images/objectMusic.png)

## Pantalla de Perfil

<div style="text-align: justify"> En cualquier momento (y desde cualquier pantalla siempre que estés logeado), podrás acceder al perfil.
<br><br>
Para hacerlo clicaremos en el menú desplegable del header e iremos a perfil.
 </div>
<br>


![Imagen de perfil](DocFiles/images/profile.png)

## Pantalla de Admin Dashboard

<div style="text-align: justify"> Del mismo modo, si somos administradores, podremos ir al dashboard del administrador clicando en el menú del header.
<br><br>
Aquí se reflejarán una serie de estadísticas y gráficos ya comentados en la parte de "Gráficos" y "Algoritmo o consulta avanzada"
 </div>
<br>


![Imagen de dashboard](DocFiles/images/adminDashboard.png)

## Pantalla de Contacto

<div style="text-align: justify"> Si clicamos en la parte de "Contacto" del header llegaremos a esta pantalla.
<br><br>
Aquí podremos obtener más información sobre los propietarios de la web.
 </div>
<br>


![Imagen de contacto](DocFiles/images/contactUs.png)

## Pantalla de Error 404

<div style="text-align: justify"> Si en cualquier momento intentamos acceder a una URL no encontrada, nos mostrará la pantalla de error 404
 </div>
<br>


![Imagen de contacto](DocFiles/images/error404.png)

<br>
<br>

# Wireframe de navegación de la aplicación


![Imagen de Wireframe de navegación](DocFiles/images/navWireframe.png)