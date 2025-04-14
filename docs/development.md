## 📝 Github Projects

El desarrollo de LogArt está gestionado y planificado a través de GitHub Projects, donde se organizan y priorizan todas las tareas del projecto en:

- Todo
- Up Next
- In Progress
- Done

Además, esta integrado el sistema de Issues, donde cada vez que se crea un "tarjeta" en el tablón del proyecto, se crea automaticamente su issue correspondiente, y al mover la tarjeta a la columna Done, se marca el estado del issue como "Done"

[GitHub Project](https://github.com/orgs/codeurjc-students/projects/12)

## 🛠️ Herramientas de desarrollo:

La aplicación LogArt se desarrolla usando un stack de tecnologías MERN, para más información sobre el porqué, esta entrada del blog:

- [Blog LogArt: Un giro radical hacia el MERN Stack](https://medium.com/@davidmorenom17/logart-un-giro-radical-hacia-el-mern-stack-060ebde31bc5)

Nota: Las versiones pueden no ser exactas debido al continuo desarrollo/actualización de las mismas

### Entorno de Desarrollo Backend

- Node.js: v20.18.0
- MongoDB: v7.0+
- Dependencias principales:
  - Express.js (v4.21.1): Framework web para Node.js
  - Mongoose (v8.8.3): ODM para MongoDB
  - JWT (v9.0.2): Autenticación basada en tokens
  - Bcrypt (v5.1.1): Encriptación de contraseñas
  - Swagger (v6.2.8/v5.0.1): Documentación automática de API
  - Jest (v29.7.0): Framework de testing unitario
  - Supertest (v7.0.0): Testing de API HTTP
  - Nodemon (v3.1.7): Recarga automática durante desarrollo

### Entorno de Desarrollo Frontend

- Node.js: v20.18.0
- React: v18.3.1
- Vite: v6.0.1 (build tool)
- Dependencias principales:
  - React Router DOM (v6.26.1): Manejo de rutas
  - TailwindCSS (v3.4.15): Framework CSS utilitario
  - Axios (v1.7.8): Cliente HTTP
  - Framer Motion (v11.13.1): Biblioteca de animaciones
  - React Icons (v5.3.0): Conjunto de iconos
  - Playwright (v1.49.0): Testing end-to-end

### Herramientas complementarias

- Docker: v24.x o superior
- Docker Compose: v3.8 o superior
- Git: v2.30.x o superior
- Visual Studio Code
  - Con diversas extensiones útiles como: Tailwind CSS IntelliSense, Docker, GitLens o Prettier.

## Ciclo de desarrollo

El proyecto sigue a grandes rasgos las siguientes fases:

### Fase de desarrollo local

1. **Planificación**: Definición de requisitos y tareas en Github Projects

2. **Desarrollo Backend**:

```
cd LogArtApp/backend
npm install
npm start
```

3. **Desarrollo Frontend**:

```
cd LogArtApp/frontend/LogArt-frontend
npm install
npm run dev
```

La aplicación React se inicia en modo desarrollo en http://localhost:5173

4. **Pruebas locales**: En caso de añadir alguna nueva funcionalidad/tocar algo del código que sea importante, se ejecutan los test front y backend de manera manual, para evitar encontrarte con los fallos al hacer la PR en la ejecución automática de tests

### Fase de integración

1. Pull Request: Creación de PR a la rama main
2. CI/CD Pipeline: Ejecución automática de pruebas
3. Merge: En caso de que todo sea correcto, integración a la rama principal

## 📑 Diagrama de clases del backend

Este diagrama muestra las clases de la aplicación y las relaciones entre ellas. (se han excluido clases como seeders o configuración de base de datos, .env, server, etc.)

![Imagen de clasesBackend](/DocFiles/images/phase3/final.drawio.svg)

## 📝 Diagrama de clases del frontend

Este diagrama muestra las páginas y componentes de la aplicación, junto con archivos de contexto y utilidades. Tambien muestra las relaciones entre todos estos. (se han excluido cosas como tailwind, configuración de base de datos, .env, server, etc.)

![Imagen de clasesSPA](/DocFiles/images/phase3/finalspa.drawio.png)

## Uso de la API REST en Desarrollo

Durante el desarrollo, se usaron herramientas interactivas para probar la API REST, concretamente, `Postman`

Para realizar operaciones que requieren autenticación:

1. Realizar la petición de login al endpoint /api/v1/auth con las credenciales

2. Obtener el token JWT de la respuesta

3. Incluir el token en las siguientes peticiones en el header Authorization: Bearer {token}

La documentación completa del uso de la API en LogArt está disponible en:
[Postman Documentation API](https://documenter.getpostman.com/view/40050684/2sAYHwH3u8#dd7db3fe-3603-4d4f-a844-03cacf511ad2)

## Documentación interactiva de la API

La referencia completa en Swagger, está disponible en:
[GitHub Pages Documentation API](https://codeurjc-students.github.io/2024-logart/)

## Ejecución de Tests

### Test de Backend

Situarse en la carpeta Backend

```
cd 2024-logart/LogArtApp/backend
```

Asegurarse que el backend está en ejecución para inicializar la BD

```
npm start
```

En otra terminal, ejecutar los tests

```
npm test
```

### Test de Frontend

Situarse en la carpeta Frontend

```
cd 2024-logart/LogArtApp/frontend/LogArt-frontend
```

Asegurarse que el backend está en ejecución

```
cd ../../backend
npm start
```

Tests interactivos con visualización en navegador

```
npx playwright test --ui
```

Tests automáticos en Chromium

```
npx playwright test --project=chromium
```

## Construcción Docker y Ejecución

### Construcción Local con Tag "dev"

Situarse en la carpeta raíz del proyecto

```
cd 2024-logart/LogArtApp
```

Construir la imagen con tag "dev"

```
docker build -t

davidmorenoo/logartapp:dev -f
docker/Dockerfile .
```

### Ejecución con docker-compose-dev.yml

Navegar a la carpeta docker

```
cd docker
```

Ejecutar con docker-compose-dev.yml

```
docker compose -f docker-compose-dev.yml up
```

La aplicación estará disponible en https://localhost

## Publicar una Release

El proceso de publicación de releases se ha automatizado mediante GitHub Actions:

1. Crear un tag de versión en GitHub siguiendo [SemVer(v1.0.0)](https://semver.org/spec/v1.0.0.html)

2. Publicar una release basada en ese tag

3. Github Actions ejecutará automáticamente el workflow de release que:

   - Construye la imagen Docker
   - Genera varios tags para DockerHub:

     - `{version}` (ej: 2.0.0)
     - `latest` (para versiones estables)
     - `{sha}` (identificador de commit)

   - Publica la imagen en DockerHub

## Actualización de docker-compose.yml

Es necesario actualizar manualmente el archivo docker-compose.yml después de cada release:

1. Abrir el archivo docker/docker-compose.yml
2. Actualizar la siguiente línea con la nueva versión:

```
image: davidmorenoo/logartapp:{nueva_version}
```

3. Hacer commit de este cambio al repositorio

## Integración continua

Complementando más la información proporcionada anteriormente sobre los tests, LogArt implementa un sistema de integración continua con Github Actions que ayuda mucho a esto:

### Workflow de Pull Request

Se activa automáticamente cuando:

- Se crea un Pull Request a la rama `main`

Ejecuta las siguiente tareas:

- Configura el entorno (Ubuntu + Node.js 20.x)
- Instala dependencias
- Ejecuta pruebas de backend (Jest y Supertest)
- Ejecuta pruebas de frontend (Playwright)
- Genera informes de cobertura
- Verifica credenciales y configuración SSL

Si las pruebas fallan:

- Se marca el PR como fallido
- Se genera un artefacto de Playwright descargable para depuración
