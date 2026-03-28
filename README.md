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

## 🚀 Sprint 2: Dinamizar nuestra plataforma
En este segundo sprint nos hemos centrado en dinamizar la estructura de la web, hacerla completamente responsive e implementar la carga dinámica de datos.

### 📄 1. Mockups (Tablet y Móvil)
El archivo PDF con los mockups actualizados para el diseño Responsive (Tablet y Móvil) se encuentra ubicado en el siguiente directorio de nuestro repositorio:
* 📍 **Ruta:** `Mockups_Storyboard_pdf/Mockups_Storyboard.pdf`

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
Para poder probar el inicio de sesión y evaluar la plataforma, puedes utilizar el siguiente usuario de demostración incluido en nuestro sistema, o crear uno nuevo a través de la página de registro:

* **Usuario:** `Example`
* **Contraseña:** `12345678`

---

## 🔗 Enlaces de interés
* 👨‍💻 **Repositorio GitHub:** [Ver rama Sprint 2](https://github.com/TheFox50011/PWM2026)

## 💻 Tecnologías
* **HTML5** (Estructura y Formularios)
* **CSS3** (Diseño, Layout, Flexbox y Media Queries)
* **Figma** (Prototipado / Mockups)
* **Javascript Vanilla** (Fetch, Promesas, Inclusión de plantillas, LocalStorage y Validaciones)
