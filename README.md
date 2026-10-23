# CSLUA · Sitio web del Club de Software Libre

Sitio web del **Club de Software Libre de la Universidad Americana (CSLUA)**, una organización estudiantil sin fines de lucro de Asunción, Paraguay.

- **Sitio:** <https://cslua-website.vercel.app>
- **Código fuente:** <https://github.com/CSLUA-py/website>
- **Contacto:** clubdesoftwarelibre@gmail.com

Es software libre, bajo la licencia [AGPL-3.0-or-later](LICENSE).

## Qué incluye

| Ruta | Contenido |
|---|---|
| `/` | Presentación del club |
| `/about` | Quiénes somos, misión y objetivos |
| `/team` | Coordinadores y colaboradores |
| `/team/<nombre>` | Perfil de cada integrante: qué usa en su día a día |
| `/join` | Cómo afiliarse (requisitos, categorías, formulario y grupo de WhatsApp) |
| `/bylaws` | Reglamento interno (Resolución CSU N° 032/2026) |
| `/contact` | Contacto |

## Stack

React 19, Vite 8, React Router 8 y ESLint 9. Es un sitio estático: por ahora no tiene backend.

## Puesta en marcha

Necesitás **Node.js 22.22 o superior** (lo exige React Router) y npm.

```sh
git clone git@github.com:CSLUA-py/website.git
cd website
npm install
npm run dev
```

| Comando | Para qué sirve |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga al guardar |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve `dist/` localmente para probarla |
| `npm run lint` | Revisa el código con ESLint |

## Estructura

```
.
├── design/                  Fuente editable de la imagen para compartir (og-image.svg)
├── public/
│   ├── docs/                PDF del reglamento
│   ├── team/                Fotos del equipo
│   └── …                    Favicon, apple-touch-icon y og-image
├── src/
│   ├── assets/              Logo del club
│   ├── components/          Menú, pie, tarjetas del equipo, etc.
│   ├── data/team.js         Datos de los integrantes
│   ├── pages/               Una página por ruta
│   │   └── profiles/        Perfiles de /team/<nombre> (ver más abajo)
│   ├── config.js            Correo, enlaces externos y menú
│   └── styles.css           Estilos generales
├── vercel.json              Reglas para que las rutas funcionen al recargar
└── .env                     Variable pública VITE_SITE_URL (sin secretos)
```

## Cómo editar el contenido

### Agregar o editar a un integrante

Todo está en [`src/data/team.js`](src/data/team.js). Cada integrante es un objeto:

```js
{
  slug: "pablo",                      // la URL será /team/pablo
  group: "coordinators",              // "coordinators" o "collaborators"
  name: "Pablo Ayala",
  role: "Coordinador Técnico",        // null para colaboradores
  photo: "pablo.jpg",                 // archivo dentro de public/team/, o null
  degree: "Ingeniería en Informática",
  semester: "noveno",                 // se muestra "Alumno del noveno semestre de …"
  distro: "Ubuntu + Windows 11",
  desktop: "GNOME",
  editor: null,                       // null = no se muestra
  terminal: null,
  hardware: { Laptop: "…", Procesador: "…" },   // objeto etiqueta → valor, o texto, o null
  peripherals: null,                  // igual que hardware
  links: { github: "https://…", linkedin: null, instagram: null, website: null, dotfiles: null },
  theme: null,
}
```

- Los campos en `null` simplemente no se muestran.
- `hardware` y `peripherals` pueden ser un objeto `{ Etiqueta: "valor" }` (las etiquetas con espacios van entre comillas: `"Adaptador de red": "…"`) o un texto. En un perfil propio como el de Fede se muestran fila por fila, así que ahí conviene el objeto.
- **Fotos:** guardalas en `public/team/`, cuadradas (unos 512 px) y livianas (JPG o WebP, idealmente menos de 100 kB). Sin foto, se muestran las iniciales.
- Los integrantes aparecen en el orden en que están en el archivo, dentro de su grupo.

### Una página propia para tu perfil

Cualquier integrante puede reemplazar su perfil por una página totalmente propia (la de Fede es un escritorio Hyprland con Gruvbox). Cada una vive en su carpeta:

1. Creá `src/pages/profiles/<slug>/` con tu componente (`export default function ...({ member })`) y tu CSS.
2. Prefijá tus clases CSS con tu nombre (`.pablo-*`): los estilos son globales y así no chocan con los de otros.
3. Registrala en [`src/pages/profiles/index.js`](src/pages/profiles/index.js), con carga diferida (`lazy`) como las demás.
4. La página reemplaza el menú y el pie del sitio, así que incluí un enlace de vuelta a `/team` y los enlaces a la licencia y al código fuente (mirá `profiles/fede/FedeProfile.jsx`).

Quien no la hace usa el perfil estándar (`DefaultProfile.jsx`).

### Enlaces y datos generales

[`src/config.js`](src/config.js) concentra el correo del club, el formulario de afiliación, el grupo de WhatsApp, el enlace al código fuente, los datos de autoría y el menú.

## Despliegue

El sitio se publica en **Vercel**: cada `git push` a `main` despliega automáticamente.

- `vercel.json` redirige todas las rutas a `index.html` para que `/team` o `/join` funcionen al recargar.
- La variable `VITE_SITE_URL` (en Vercel: Settings, Environment Variables) debe tener la dirección pública del sitio, **sin barra final**. Se usa para la imagen de vista previa al compartir enlaces. Si cambia el dominio, actualizala y volvé a desplegar: se aplica al compilar.

## Convenciones

- **El código, los nombres de archivo y las rutas (URL) van en inglés.** Los textos que ve el visitante, en español.
- Corré `npm run lint` antes de commitear.
- Mensajes de commit en inglés, con título en imperativo (por ejemplo, `Add team profiles`).

## Licencia

El código se publica bajo la **GNU Affero General Public License v3.0 o posterior** (ver [`LICENSE`](LICENSE)). La AGPL exige que quien use el sitio por red pueda obtener su código fuente, por eso el pie de página enlaza a este repositorio: **no lo quites**. Si modificás el sitio y lo publicás, tenés que ofrecer el código de tu versión bajo la misma licencia.

La licencia cubre el código. **No cubre** estos materiales, que pertenecen a sus autores:

- El **logo del club** (el tucán).
- El **reglamento** (PDF): es un documento institucional de la Universidad Americana.
- Las **fotos** de los integrantes.

## Créditos

- **Sitio web:** [Fede Barrios](https://fedebarriosd.com).
- **Logo:** Adrián Cardozo, que lo creó y dio su permiso expreso para que el club lo use. No tiene una licencia formal, así que no lo reutilices fuera del club sin consultarle. El agradecimiento también figura en `/about`.
- **Reglamento:** Resolución CSU N° 032/2026, Universidad Americana.
