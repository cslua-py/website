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

React 19, Vite 8, React Router 8 y ESLint 9. Es un sitio estático: por ahora no tiene backend, pero el proyecto está pensado para sumar después Express y MongoDB (ver [`docs/architecture.md`](docs/architecture.md)).

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
| `npm run check:members` | Valida los datos de todos los integrantes (corre también en el CI y antes del build) |
| `npm run new-member -- <slug>` | Crea tu carpeta en `src/members/` (con `--custom`, también una página propia) |

## Estructura

```
.
├── .github/                 CI (lint, validación y build en cada pull request) y plantilla de PR
├── design/                  Fuente editable de la imagen para compartir (og-image.svg)
├── docs/                    Documentación técnica (arquitectura y camino hacia MERN)
├── public/
│   ├── docs/                PDF del reglamento
│   └── …                    Favicon, apple-touch-icon y og-image
├── scripts/                 Utilidades de Node: validar y crear integrantes
├── src/
│   ├── assets/              Logo del club
│   ├── components/          Menú, pie, tarjetas del equipo, etc.
│   ├── data/                Carga y esquema de los integrantes
│   ├── members/<slug>/      Todo lo de cada integrante: datos, foto y perfil propio
│   ├── pages/               Una página por ruta
│   ├── config.js            Correo, enlaces externos y menú
│   └── styles.css           Estilos generales y tema claro/oscuro
├── CONTRIBUTING.md          Guía para integrantes (agregar tu tarjeta, editar tu perfil)
├── vercel.json              Reglas para que las rutas funcionen al recargar
└── .env                     Variable pública VITE_SITE_URL (sin secretos)
```

## Cómo editar el contenido

### Aparecer en /team y editar tu perfil

Cada integrante tiene su carpeta en [`src/members/`](src/members/) y el sitio la detecta sola. Para sumarte:

```sh
npm run new-member -- tu-nombre     # crea src/members/tu-nombre/
```

Editás `member.js` con tus datos, sumás una foto si querés (`photo.jpg`) y abrís un pull request. Podés también reemplazar tu perfil por una **página totalmente propia** (la de Fede es un escritorio Hyprland): `npm run new-member -- tu-nombre --custom`.

La guía completa, paso a paso y pensada para quien nunca usó Git, está en [**CONTRIBUTING.md**](CONTRIBUTING.md).

### Enlaces y datos generales

[`src/config.js`](src/config.js) concentra el correo del club, el formulario de afiliación, el grupo de WhatsApp, el enlace al código fuente, los datos de autoría y el menú.

## Despliegue

El sitio se publica en **Vercel**: cada cambio que se integra a `main` (mediante un pull request) despliega automáticamente.

- `vercel.json` redirige todas las rutas a `index.html` para que `/team` o `/join` funcionen al recargar.
- La variable `VITE_SITE_URL` (en Vercel: Settings, Environment Variables) debe tener la dirección pública del sitio, **sin barra final**. Se usa para la imagen de vista previa al compartir enlaces. Si cambia el dominio, actualizala y volvé a desplegar: se aplica al compilar.

## Convenciones

- **El código, los nombres de archivo y las rutas (URL) van en inglés.** Los textos que ve el visitante, en español.
- Corré `npm run lint` antes de commitear.
- Mensajes de commit en inglés, con título en imperativo (por ejemplo, `Add team profiles`).

## Cómo aportar

La rama `main` está protegida: **no se puede hacer push directo**, todo cambio entra por pull request, con el check **CI** en verde y **1 aprobación**. El procedimiento completo (clonar o hacer un fork, crear la rama, abrir el PR, qué hace la protección de `main` y qué hacer cuando algo falla) está en [**CONTRIBUTING.md**](CONTRIBUTING.md).

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
