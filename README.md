# 📂 Proyecto StudyHub

Este es el repositorio del proyecto en el que estamos desarrollando una **web de recursos para estudiantes**.

🤝 **Equipo de Desarrollo:**
* Diego González Moreno
* Saúl Falcón Gil
* Cathaysa Moreno Cabrera

---

## 👀 Descripción del proyecto
Nuestro proyecto consiste en el desarrollo de una plataforma web diseñada para potenciar el estudio. Los estudiantes pueden subir y compartir sus apuntes, previsualizar y descargar archivos, así como crear tests personalizados para autoevaluarse. Además, la web fomenta la interacción y la creación de comunidad a través de foros de discusión, comentarios y likes, convirtiendo este espacio en un punto de encuentro para el éxito académico.

---

## 🏗️ Sprint 3: Migración a Angular + Firebase

En este sprint hemos realizado una migración completa del proyecto desde HTML/CSS/JS Vanilla hacia **Angular 19** como framework frontend y **Firebase** como backend (Authentication + Firestore). La aplicación ahora es una SPA (Single Page Application) con enrutamiento, componentes reutilizables y datos en tiempo real.

### 💻 Tecnologías actualizadas
* **Angular 19** (Framework principal, componentes standalone, enrutamiento)
* **TypeScript 5.5** (Tipado estático)
* **Firebase Authentication** (Registro, login, gestión de sesiones)
* **Firestore** (Base de datos NoSQL en tiempo real)
* **Bootstrap 5.3** (Estilos y layout responsive)
* **RxJS** (Programación reactiva con Observables)
* **Vitest** (Testing unitario)
* **Figma** (Prototipado / Mockups)

---

## 🧱 Estructura del código del proyecto web

El proyecto Angular se encuentra en la carpeta `Angular/` y sigue la estructura estándar de Angular CLI:

```
Angular/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── header/          # Barra de navegación superior (logo, usuario, logout)
│   │   │   ├── footer/          # Pie de página
│   │   │   ├── sidebar/         # Barra lateral con navegación y foros sugeridos
│   │   │   └── post/            # Componente de post (menú contextual, favoritos, descarga)
│   │   ├── services/            # Servicios inyectables
│   │   │   ├── auth.service.ts       # Autenticación (login, registro, logout, reset password)
│   │   │   └── firestore.service.ts  # Operaciones CRUD genéricas con Firestore
│   │   ├── index/               # Página de aterrizaje (landing page)
│   │   ├── login/               # Inicio de sesión con validación Reactiva
│   │   ├── create-an-account/   # Registro de usuarios (Firebase Auth + Firestore)
│   │   ├── forgot-your-password/# Recuperación de contraseña por email
│   │   ├── mainpage/            # Página principal: posts generales, foros, tests, usuarios sugeridos
│   │   ├── forum-view/          # Vista individual de un foro con sus posts
│   │   ├── create-forum/        # Formulario de creación de foros (categoría, visibilidad, tags)
│   │   ├── create-test/         # Creador de tests con preguntas y opciones múltiples
│   │   ├── do-test/             # Ejecución de tests con navegación y puntuación
│   │   ├── profile/             # Perfil del usuario (datos, stats, archivos y tests compartidos)
│   │   ├── edit-profile/        # Edición de perfil (nombre, bio, ubicación, foto, enlaces)
│   │   ├── favorites/           # Catálogo de posts marcados como favoritos
│   │   ├── notifications/       # Página de notificaciones
│   │   ├── settings/            # Ajustes de la aplicación
│   │   ├── about-us/            # Página informativa "Sobre nosotros"
│   │   ├── our-team/            # Página del equipo de desarrollo
│   │   ├── app.routes.ts        # Definición de todas las rutas de la aplicación
│   │   ├── app.config.ts        # Configuración de la app (Firebase providers)
│   │   └── app.ts               # Componente raíz
│   ├── environments/
│   │   ├── environment.ts            # Configuración Firebase (producción)
│   │   └── environment.development.ts # Configuración Firebase (desarrollo)
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── package.json
├── angular.json
└── firebase.json
```

### Descripción de los componentes principales

| Componente | Funcionalidad |
|---|---|
| **HeaderComponent** | Barra superior con logo, nombre de usuario dinámico (escuchando Firestore en tiempo real), foto de perfil y botón de logout |
| **AsideComponent (Sidebar)** | Navegación lateral con enlaces a las secciones principales, lista de foros personalizados y tests disponibles |
| **FooterComponent** | Pie de página con enlaces informativos |
| **Mainpage** | Página principal con sistema de tabs (posts generales / foros / tests), publicación de posts con adjuntos (imágenes/PDF), likes, comentarios, seguimiento de usuarios y modal de perfil |
| **ForumViewComponent** | Vista de un foro específico con sus posts, publicación, likes, replies y gestión de adjuntos |
| **CreateForum** | Formulario para crear foros con título, descripción, categoría, visibilidad y sistema de tags |
| **CreateTest** | Constructor de tests interactivo: añade preguntas, opciones (hasta 6), marca la respuesta correcta, navega entre preguntas |
| **DoTest** | Ejecución de test con navegación entre preguntas, selección de respuestas, progreso visual y cálculo de puntuación final |
| **Profile** | Muestra datos del usuario obtenidos de Firestore: username, email, seguidores, seguidos, biografía, enlaces, archivos y tests compartidos |
| **EditProfile** | Formulario de edición de perfil con previsualización de imagen y guardado en Firestore |
| **Favorites** | Filtra y muestra todos los posts donde el usuario actual está en el array `favoritedBy` |
| **Login** | Formulario reactivo que busca el email por username en Firestore y autentica con Firebase Auth |
| **CreateAnAccount** | Registro completo: crea usuario en Firebase Auth, actualiza displayName y guarda perfil en Firestore |

---

## 🗄️ Estructura de los datos en Firebase

El proyecto utiliza dos servicios de Firebase:

### 🔐 Firebase Authentication
Gestiona el registro e inicio de sesión de usuarios mediante email y contraseña.

### 📦 Firestore Database

La base de datos se organiza en las siguientes colecciones:

#### Colección `users`
Cada documento se identifica con el `uid` del usuario autenticado.

```
users/{uid}
├── uid: string              # ID único de Firebase Auth
├── email: string            # Email del usuario
├── name: string             # Nombre
├── surname: string          # Apellido
├── username: string         # Nombre de usuario (único, usado para login)
├── role: string             # Rol del usuario ("user")
├── profilePicture: string   # URL o base64 de la foto de perfil
├── biography: string        # Biografía del usuario
├── location: string         # Ubicación
├── link1: string            # Enlace personal 1
├── link2: string            # Enlace personal 2
├── followers: number        # Número de seguidores
├── following: number        # Número de seguidos
├── followers_list: string[] # Array de uid de seguidores
├── following_list: string[] # Array de uid de seguidos
├── sharedFiles: any[]       # Archivos compartidos por el usuario
└── createdAt: string        # Fecha de creación (ISO 8601)
```

#### Colección `posts`
Documentos generados automáticamente por Firestore.

```
posts/{postId}
├── author_id: string        # uid del autor
├── author_name: string      # username del autor
├── forum_name: string       # Nombre del foro ("General" para posts globales)
├── forum_id: string?        # ID del foro (solo si pertenece a un foro específico)
├── Description: string      # Texto del post
├── imageData: string?       # Imagen adjunta en base64 (data URL)
├── pdfName: string?         # Nombre del PDF adjunto
├── Likes: number            # Número de likes
├── likedBy: string[]        # Array de uid que dieron like
├── favoritedBy: string[]    # Array de uid que marcaron como favorito
├── replies: [               # Array de respuestas embebidas
│   ├── author_id: string
│   ├── author_name: string
│   ├── content: string
│   └── created_at: string
│   ]
└── created_at: string       # Fecha de creación (ISO 8601)
```

#### Colección `forums`
Documentos generados automáticamente por Firestore.

```
forums/{forumId}
├── forum_title: string      # Título del foro
├── forum_description: string# Descripción del foro
├── author_id: string        # uid del creador
├── category: string         # Categoría ("general", "matematicas", etc.)
├── visibility: string       # Visibilidad ("public", "private")
├── tags: string[]           # Array de tags (máximo 8)
└── created_at: string       # Fecha de creación (ISO 8601)
```

#### Colección `tests`
Documentos generados automáticamente por Firestore.

```
tests/{testId}
├── title: string            # Nombre del test
├── author_id: string        # uid del creador
├── created_at: string       # Fecha de creación (ISO 8601)
└── questions: [             # Array de preguntas embebidas
    ├── questionText: string
    └── options: [           # Array de opciones
        ├── text: string
        └── isCorrect: boolean
        ]
    ]
```

### Proyecto Firebase
* **Project ID:** `studyhub-eeba0`
* **Console:** https://console.firebase.google.com/project/studyhub-eeba0

---

## 🗺️ Tour por la página web

### 1. Página de aterrizaje (`/`)
La página de inicio presenta StudyHub con información sobre la plataforma y enlaces a registro/login.

### 2. Registro de usuario (`/create-an-account`)
El usuario introduce su email, nombre, apellido, username y contraseña (mínimo 8 caracteres). Al registrarse:
1. Se crea la cuenta en **Firebase Authentication**
2. Se guarda el perfil completo en la colección `users` de **Firestore**
3. Se redirige al login

### 3. Inicio de sesión (`/login`)
El usuario introduce su **username** (no email) y contraseña. El sistema busca el email asociado en Firestore y autentica con Firebase Auth. Tras el login exitoso, se redirige a la página principal.

### 4. Página principal (`/mainpage`)
Es el centro de la plataforma con tres tabs:

* **General:** Feed de posts globales donde los usuarios pueden:
  - Publicar texto con imágenes o PDFs adjuntos
  - Dar like a posts (no se puede dar like a posts propios)
  - Comentar/responder a posts
  - Marcar posts como favoritos
  - Eliminar posts propios
  - Ver usuarios sugeridos y seguir/dejar de seguir

* **Foros:** Catálogo de foros creados por la comunidad con buscador. Al hacer clic en un foro se accede a su vista individual.

* **Tests:** Lista de tests disponibles. Se pueden ejecutar o eliminar (si eres el autor).

### 5. Crear foro (`/create-forum`)
Formulario completo con título, descripción, categoría, visibilidad y sistema de tags (hasta 8). Al guardar, el foro aparece inmediatamente en el tab de foros de la mainpage gracias a la sincronización en tiempo real de Firestore.

### 6. Vista de foro (`/forum/:id`)
Similar a la página principal pero filtrada por un foro específico. Los posts publicados aquí tienen `forum_id` y `forum_name` asociados.

### 7. Crear test (`/create-test`)
Interfaz interactiva para construir tests:
1. Se asigna un nombre al test
2. Se añaden preguntas con entre 2 y 6 opciones
3. Se marca la respuesta correcta con el botón ○
4. Se navega entre preguntas desde el panel lateral
5. Al crear, se guarda en Firestore y aparece en el tab de tests

### 8. Hacer test (`/do-test/:id`)
El usuario responde preguntas una a una con navegación prev/next, indicador de progreso y preguntas respondidas. Al finalizar se calcula la puntuación y se muestran las respuestas correctas.

### 9. Perfil (`/profile`)
Muestra los datos del usuario logueado cargados en tiempo real desde Firestore: foto, username, email, biografía, seguidores, seguidos, archivos compartidos y tests creados.

### 10. Editar perfil (`/edit-profile`)
Formulario para modificar nombre, biografía, ubicación, email, enlaces y foto de perfil. Los cambios se reflejan instantáneamente gracias a los listeners `onSnapshot`.

### 11. Favoritos (`/favorites`)
Catálogo de todos los posts que el usuario ha marcado como favorito, filtrados por el array `favoritedBy` en Firestore. Se pueden eliminar de favoritos directamente.

### Ejemplo completo: Crear un post y verlo en el catálogo

1. **Login** → Usuario "Example" con contraseña "12345678" (o crear cuenta nueva)
2. **Mainpage** → En el tab "General", escribir texto en el cajón de publicación
3. Opcionalmente adjuntar una imagen (se convierte a base64) o un PDF
4. **Publicar** → El post se guarda en Firestore con `forum_name: "General"`, `author_id`, timestamp, etc.
5. Gracias a `onSnapshot`, el post aparece **instantáneamente** en el feed sin recargar la página
6. Otros usuarios pueden dar **like**, **comentar** o marcar como **favorito**
7. En la página **Favoritos**, el post aparece si fue marcado como tal

---

## 📊 Evolución del proyecto - Trello

Puedes seguir la evolución y gestión de tareas del proyecto en nuestro tablero de Trello:

📋 **Tablero de Trello:** [Enlace al tablero de Trello del proyecto](#)

> ⚠️ *Actualiza este enlace con la URL real de vuestro tablero de Trello.*

---

## 🚀 Sprint 2: Dinamizar nuestra plataforma *(versión legacy HTML/JS)*
En este segundo sprint nos hemos centrado en dinamizar la estructura de la web, hacerla completamente responsive e implementar la carga dinámica de datos.

### 📄 1. Mockups (Tablet y Móvil)
El archivo PDF con los mockups actualizados para el diseño Responsive (Tablet y Móvil) se encuentra ubicado en el siguiente directorio de nuestro repositorio:
* 📍 **Ruta:** `Mockups_Storyboard_pdf/Mockups_with_responsive.pdf`
* PDF: [Mockups_with_responsive_pdf.pdf](https://github.com/user-attachments/files/26327377/Mockups_with_responsive_pdf.pdf)


### 🗄️ 2. Ubicación del contenido JSON
Para este sprint, el contenido dinámico de la plataforma se lee de forma **Local**. Los archivos que actúan como nuestra base de datos están ubicados en:
* 📍 **Ruta:** `src/assets/` (`users.json`, `forums.json`, `tests.json`).

---

### 🗺️ 3. Estructura y Listado de Páginas HTML
A continuación se detallan todas las páginas del proyecto, sus adaptaciones responsive, la carga de templates/JSON y los formularios implementados.

⭐ **Página de Inicio de la aplicación web:** `src/html/index.html`

#### 🔐 Páginas de Acceso y Gestión de Cuenta
* **`Login.html` (Página de Inicio)**
    * **Responsive:** Uso de flexbox. El contenedor del formulario se adapta al 100% del ancho en pantallas móviles.
    * **Templates/JSON:** No carga JSON.
    * **Carga de Templates:** No.
    * **Formularios y Validaciones:** Formulario de inicio de sesión. Uso de etiquetas `required` y `type="password"`.
* **`CreateAnAccount.html`**
    * **Responsive:** El layout de dos columnas pasa a una sola columna apilada en dispositivos móviles.
    * **Templates/JSON:** Carga de Template: `Header.html`. Carga JSON: No (lee/escribe en LocalStorage).
    * **Formularios y Validaciones:** Formulario de registro. Validaciones HTML: `required`, `type="email"`, `type="password"`. Validación extra con JS para comprobar que ambas contraseñas coinciden antes de enviar.
* **`ForgotYourPassword.html`**
    * **Responsive:** Contenedor central adaptable mediante anchos máximos y flexbox.
    * **Templates/JSON:** No aplica.
    * **Formularios y Validaciones:** Formulario de recuperación. HTML: `required`, `type="email"`.

#### 🏠 Páginas Principales de la Red Social
* **`Mainpage.html`**
    * **Responsive:** Ocultación de las barras laterales (`Sidebar.html` y barra derecha) en resoluciones pequeñas (`max-width: 768px`). La navegación se traslada al menú hamburguesa del Header. Los posts ocupan el 100% del ancho.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`, `Sidebar.html`). Carga JSON: `forums.json` y `users.json` mediante fetch asíncrono.
    * **Formularios:** Cajón para crear posts y subir archivos. Validación en JS para evitar publicar posts vacíos.
* **`Profile.html` y `EditProfile.html`**
    * **Responsive:** La cuadrícula de la cabecera del perfil y los enlaces se adaptan y apilan verticalmente en móviles.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`, `Sidebar.html`). Carga JSON: `users.json` para mostrar dinámicamente los datos del usuario.
    * **Formularios (`EditProfile.html`):** Actualización de datos. Validaciones HTML: `type="email"`, `type="url"`.
* **`Settings.html`**
    * **Responsive:** El contenedor de ajustes adapta sus márgenes y pasa a formato columna en móviles.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`, `Sidebar.html`). Carga JSON: `users.json`.
    * **Formularios:** Ajuste de modo oscuro, tamaño de fuente y cambio de correo.

#### 📚 Páginas de Estudio e Interacción
* **`CreateForum.html`**
    * **Responsive:** El grid de creación de foros pasa de 2 columnas (izquierda texto, derecha opciones) a 1 columna en móviles.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`).
    * **Formularios:** Formulario para crear foros. Validaciones HTML: `required` en campos de título y descripción.
* **`DoTest.html` y `CreateTest.html`**
    * **Responsive:** Se elimina el scroll oculto (`overflow: hidden`) permitiendo hacer scroll natural en móviles. Los botones de navegación de la prueba pasan a la parte inferior y las preguntas ocupan todo el ancho.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`). Carga JSON: `tests.json` para inyectar dinámicamente las preguntas y opciones.
    * **Formularios:** Uso de `input type="radio"` para seleccionar respuestas.
* **`Favorites.html`**
    * **Responsive:** Las tarjetas de posts guardados adoptan altura automática y ocupan la pantalla completa en dispositivos pequeños.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`, `Sidebar.html`). Carga datos de memoria local para dibujar los componentes `Post.html`.

#### ℹ️ Páginas Estáticas / Informativas
* **`AboutUs.html` y `OurTeam.html`**
    * **Responsive:** Las tarjetas de información de los miembros del equipo pasan de un layout horizontal (`flex-direction: row`) a vertical (`column`) en dispositivos táctiles pequeños.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`).
* **`Notifications.html`**
    * **Responsive:** Listado adaptable al 100% de la pantalla.
    * **Templates/JSON:** Carga Templates (`Header.html`, `Footer.html`, `Sidebar.html`).

---

### 🔑 Credenciales de Prueba
Para poder probar el inicio de sesión y evaluar la plataforma, puedes utilizar las credenciales de Firebase o crear una cuenta nueva a través de `/create-an-account`.

---

## 🔗 Enlaces de interés
* 👨‍💻 **Repositorio GitHub:** [Ver repositorio](https://github.com/TheFox50011/PWM2026)
* 🔥 **Firebase Console:** https://console.firebase.google.com/project/studyhub-eeba0

## 💻 Cómo ejecutar el proyecto

```bash
cd Angular
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200/`.
