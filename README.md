# 馃幍 MusicHub

MusicHub es la práctica final del curso de Vue.  
Se trata de una **plataforma de gestión de playlists musicales** donde los usuarios pueden:

- Registrarse e iniciar sesión (con autenticación JWT simulada)
- Crear y gestionar playlists
- Agregar/eliminar canciones
- Editar o eliminar playlists
- Subir portadas (opcional, bonus)
- Mantener sesión con localStorage
- Validar formularios con **VeeValidate + Yup**
- Usar estado global con **Pinia** y datos con **TanStack Query**
- Probar componentes y stores con **Vitest**

El proyecto se compone de **dos carpetas**:

```
MusicHub/
 musichub-backend-mock/   # Servidor backend simulado con Express + MSW
 musichub-vue/            # Aplicaci贸n frontend en Vue 3 + Vite
```

---

## Requisitos

- Node.js >= 18
- npm >= 9

---

## Backend Mock

Servidor Express simple que simula endpoints de login, registro y gestión de playlists.  
Se ejecuta en **http://localhost:3001**.

### Instalación y ejecución

```bash
cd musichub-backend-mock
npm install
npm run dev
```

### Credenciales demo

- **Email:** `demo@musichub.com`
- **Password:** `password123`

---

## Frontend (Vue 3)

Aplicación creada con **Vue 3 + Vite**, usando Tailwind CSS, Pinia, TanStack Query, VeeValidate y Yup.

Se ejecuta en **http://localhost:5173**.

### Instalación y ejecución

```bash
cd musichub-vue
npm install
npm run dev
```

---

## Funcionalidad

### Autenticación

- Registro (`/register`)
- Login (`/login`)
- Logout (cierra sesión y redirige a login)
- Persistencia de sesión con localStorage
- Guards de rutas (si no estás logueado 鈫?`/login`)

### Playlists

- Listar playlists del usuario (`/playlists`)
- Crear playlist (`/playlists/new`)
- Ver detalle playlist (`/playlists/:id`)
- Editar playlist (nombre, descripción, visibilidad)
- Eliminar playlist
- Añadir canciones (título, artista, duración opcional)
- Eliminar canciones

### Formularios

- Inputs reutilizables (`CustomInput`, `CustomTextArea`)
- Validaciones en español con Yup
- Botones deshabilitados si hay errores

### Estado y datos

- **Pinia**: almacena estado de usuario (auth)
- **TanStack Query**: manejo de datos remotos (playlists, canciones)
- **Axios**: cliente HTTP

### UX/UI

- Estilos con Tailwind
- Mensajes de error y confirmación claros
- Redirecciones al login si expira la sesión (401 鈫?logout automático)

---
