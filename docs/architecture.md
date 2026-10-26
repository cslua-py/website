# Arquitectura

Cómo está armado el sitio hoy y cómo se prevé que crezca hacia un stack MERN (MongoDB, Express, React, Node). Para colaborar con tu perfil no necesitás leer esto: alcanza con la [guía para integrantes](../CONTRIBUTING.md).

## Hoy: una SPA estática

React 19 + Vite + React Router, sin backend. `vite build` genera archivos estáticos y Vercel los publica; `vercel.json` redirige todas las rutas a `index.html`.

```
src/
├── main.jsx, App.jsx         Arranque y rutas
├── pages/                    Una página por ruta (Home, About, Team, Member, Join…)
│   └── profiles/             Cómo se elige el perfil de /team/<slug>
├── components/               Piezas compartidas (Header, Footer, TeamCard, Avatar…)
├── data/
│   ├── memberSchema.js       Forma y reglas de los datos de un integrante
│   └── team.js               Carga a los integrantes (ver abajo)
├── members/<slug>/           Todo lo de cada integrante, en su carpeta
├── config.js                 Correo, enlaces externos, menú
└── styles.css                Estilos y tema claro/oscuro del sitio
scripts/                      Utilidades de Node (validar y crear integrantes)
```

### Los integrantes

Cada integrante es una carpeta en `src/members/<slug>/`. Nada se registra a mano:

- **Datos:** `src/data/team.js` descubre `src/members/*/member.js` con `import.meta.glob`, valida en desarrollo, completa los campos opcionales (`normalizeMember`) y ordena (grupo, `order`, nombre).
- **Foto:** `photo.<ext>` en la carpeta; `team.js` le asigna su URL a `member.photo`.
- **Perfil propio:** `src/pages/profiles/index.js` descubre `src/members/*/Profile.jsx` y lo carga de forma diferida (`lazy`). `Member.jsx` usa ese componente si existe y, si no, `DefaultProfile.jsx`.
- **Carpetas con `_`** (la plantilla) se ignoran.

La razón de este diseño es que **agregar o editar un integrante nunca toca archivos compartidos**, lo que evita conflictos de merge entre pull requests de distintas personas.

### Validación

`npm run check:members` (`scripts/check-members.js`) revisa todas las carpetas con las reglas de `memberSchema.js`, además de cosas del sistema de archivos que el esquema no ve (mayúsculas en nombres, peso y formato de la foto, archivos sueltos). Corre en el CI y antes de cada `build` (`prebuild`), así que un integrante con datos inválidos no llega a publicarse.

`npm run new-member -- <slug> [--custom]` (`scripts/new-member.js`) crea una carpeta nueva a partir de `src/members/_template/`.

### Tema claro/oscuro

Las variables de color viven en `:root` de `styles.css` con `light-dark(claro, oscuro)`. `<html data-theme>` fuerza un tema (lo escribe `ThemeToggle.jsx` y lo aplica un script de `index.html` antes de pintar); sin él se sigue al sistema. Los perfiles propios quedan fuera del tema del sitio. Los perfiles estándar sin `theme` lo heredan.

## Hacia MERN

La separación que importa para crecer ya está hecha:

| Hoy | Mañana |
|---|---|
| `src/data/team.js` es **el único módulo** que sabe de dónde salen los integrantes; las páginas solo usan `TEAM`, `GROUPS` y `getMember` | Cambiar su implementación por llamadas a la API, sin tocar las páginas (que pasarán a manejar un estado de carga) |
| `memberSchema.js` define y valida un integrante, y es JavaScript puro | Base del modelo de Mongoose y de la validación del backend |
| Un integrante es un objeto plano (`slug`, `name`, `group`, …) | Es la forma natural de un documento de MongoDB |

Camino sugerido, en este orden:

1. **Backend.** Agregar `server/` con Express y Mongoose, con un modelo `Member` equivalente a `memberSchema.js`. Cuando exista, conviene pasar a *npm workspaces* con `client/` (la app actual) y `server/`; es un `git mv` que conserva el historial y se hace en el mismo PR que introduce el backend, no antes.
2. **Migración de contenido.** Un script de *seed* que lea `src/members/*/member.js` (se puede importar desde Node, igual que hace `check-members.js`) y cargue la colección. Así los datos actuales pasan a la base sin reescribirse.
3. **API.** `GET /api/team` y `GET /api/team/:slug`. El frontend reemplaza la carga de `team.js` por esas llamadas (por ejemplo con los *loaders* de React Router).
4. **Cuentas.** Registro e inicio de sesión, con un usuario asociado a un integrante. Cada persona edita sus datos desde un formulario (con foto subida a un almacenamiento de archivos) y el flujo de pull request deja de ser necesario para eso.
5. **Perfiles propios.** Son **código** (componentes de React), no datos, así que seguirán entrando por pull request en `src/members/<slug>/Profile.jsx`, enlazados por `slug` con el documento de la base. Una vez que haya cuentas, se podría revisar si limitarlos o moverlos a otro esquema.

Decisiones que quedan para ese momento:

- **Dónde corre el backend.** Vercel puede ejecutar funciones en `api/`, pero un Express tradicional necesita otro hosting. Cualquiera sea la opción, la regla de `vercel.json` debe dejar fuera `/api/*` de la redirección a `index.html`.
- **Dónde viven las fotos** cuando dejen de ser archivos del repositorio.
- **Dónde van los secretos.** El repositorio es público y hoy `.env` está versionado porque solo tiene `VITE_SITE_URL`, que es pública. Las claves de la base o de sesiones nunca irán ahí: se guardan en `.env.local` (agregarlo a `.gitignore`) y en las variables de entorno del hosting.
