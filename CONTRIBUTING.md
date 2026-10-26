# Guía para integrantes

Cualquier integrante del club puede aparecer en [/team](https://cslua-website.vercel.app/team) y editar su propio perfil. Todavía no hay cuentas ni un panel para hacerlo desde el sitio, así que se hace igual que en cualquier proyecto de software libre: **clonás el repositorio, editás tu carpeta y abrís un pull request**.

Esta guía te lleva paso a paso. Si es tu primer pull request, es un buen lugar para empezar: lo único que vas a tocar es **tu propia carpeta**.

- [Qué vas a modificar](#qué-vas-a-modificar)
- [Antes de empezar](#antes-de-empezar)
- [Agregar tu tarjeta al equipo](#agregar-tu-tarjeta-al-equipo)
- [Qué significa cada campo](#qué-significa-cada-campo)
- [Tu foto](#tu-foto)
- [Editar tu perfil más adelante](#editar-tu-perfil-más-adelante)
- [Una página propia para tu perfil](#una-página-propia-para-tu-perfil)
- [Reglas de convivencia](#reglas-de-convivencia)
- [Subir tus cambios (pull request)](#subir-tus-cambios-pull-request)
- [Problemas frecuentes](#problemas-frecuentes)
- [Cambios que no son de tu perfil](#cambios-que-no-son-de-tu-perfil)

## Qué vas a modificar

Cada integrante tiene una carpeta con su nombre dentro de [`src/members/`](src/members/). Ahí va **todo lo tuyo**, y el sitio la detecta sola: no hay ninguna lista que editar ni nada que registrar.

```
src/members/
├── _template/        La plantilla que se copia al crear tu carpeta (no la toques)
├── fede/
│   ├── member.js     Tus datos: nombre, distro, enlaces… (obligatorio)
│   ├── photo.svg     Tu foto (opcional)
│   ├── Profile.jsx   Tu página propia (opcional, ver más abajo)
│   └── …             Estilos e imágenes de tu página propia
└── pablo/
    ├── member.js
    └── photo.jpg
```

El nombre de la carpeta es tu *slug* y define tu dirección: `src/members/ana-gomez/` aparece en `/team/ana-gomez`.

## Antes de empezar

Necesitás:

- Una cuenta de [GitHub](https://github.com).
- [Git](https://git-scm.com) y [Node.js](https://nodejs.org) **22.22 o superior** (con npm).
- Un editor de texto o de código (VS Code, Neovim, el que prefieras).

Después conseguí el código:

- **Si sos parte de la organización `CSLUA-py` en GitHub**, cloná el repositorio directamente:
  ```sh
  git clone git@github.com:CSLUA-py/website.git
  ```
- **Si no**, hacé un *fork* (botón **Fork** arriba a la derecha en [el repositorio](https://github.com/CSLUA-py/website)) y cloná tu copia: `git clone git@github.com:<tu-usuario>/website.git`.

Entrá a la carpeta e instalá las dependencias (se hace una sola vez):

```sh
cd website
npm install
```

## Agregar tu tarjeta al equipo

1. **Creá una rama** a partir de `main`. El nombre es libre, por ejemplo:
   ```sh
   git switch main
   git pull
   git switch -c add-ana-gomez
   ```
2. **Creá tu carpeta** con el comando que arma todo por vos. Reemplazá `ana-gomez` por tu nombre en minúsculas y con guiones:
   ```sh
   npm run new-member -- ana-gomez
   ```
3. **Editá `src/members/ana-gomez/member.js`** con tus datos. Solo `name` y `group` son obligatorios; lo que no quieras mostrar, dejalo en `null` o borralo. En `group` dejá `"collaborators"`: el grupo de coordinadores lo asigna la comisión directiva.
4. **Agregá tu foto** si querés (ver [Tu foto](#tu-foto)).
5. **Mirá cómo queda**:
   ```sh
   npm run dev
   ```
   Abrí la dirección que muestra la terminal (normalmente <http://localhost:5173>). Tu tarjeta aparece en `/team` y tu perfil en `/team/ana-gomez`. Cada vez que guardás, la página se actualiza sola.
6. **Revisá que todo esté bien** antes de subirlo:
   ```sh
   npm run check:members
   npm run lint
   npm run build
   ```
   `check:members` es el más útil para vos: te dice, con un mensaje en español, qué dato está mal y cómo arreglarlo.
7. **Subí tus cambios** siguiendo [Subir tus cambios](#subir-tus-cambios-pull-request).

## Qué significa cada campo

Todo se escribe en `member.js`. Los campos con `null` (o ausentes) no se muestran.

| Campo | Qué es | Ejemplo |
|---|---|---|
| `name` | **Obligatorio.** Tu nombre | `"Ana Gómez"` |
| `group` | **Obligatorio.** `"collaborators"` (los coordinadores los asigna la comisión) | `"collaborators"` |
| `role` | Solo coordinadores: su cargo. Los colaboradores no llevan | `"Secretario"` |
| `degree` y `semester` | Carrera y semestre. Se muestran juntos como *«Alumno del tercer semestre de …»*, así que van los dos o ninguno | `"Ingeniería en Informática"`, `"tercer"` |
| `distro` | Distribución de Linux que usás | `"Fedora"` |
| `desktop` | Entorno de escritorio o gestor de ventanas | `"GNOME"` |
| `editor` | Tu editor de código | `"Neovim"` |
| `terminal` | Tu terminal | `"Kitty"` |
| `hardware` | Tu equipo. Texto o un objeto `{ Etiqueta: "valor" }` | `{ Laptop: "ThinkPad T14", "Memoria RAM": "16 GB" }` |
| `peripherals` | Tus periféricos, igual que `hardware` | `{ Teclado: "…", Mouse: "…" }` |
| `links` | Enlaces: `github`, `website`, `linkedin`, `instagram`, `dotfiles`. URL completa con `https://`, o `null` | `{ github: "https://github.com/ana" }` |
| `theme` | Colores propios para el perfil estándar (ver abajo) | `{ "--paper": "#1e1e2e" }` |

Detalles:

- Las etiquetas de `hardware` y `peripherals` que tengan espacios van entre comillas: `"Memoria RAM": "16 GB"`.
- Si usás una [página propia](#una-página-propia-para-tu-perfil), `theme` se ignora (la página decide todo) y conviene que `hardware` y `peripherals` sean objetos, porque se muestran fila por fila.
- **`theme`** cambia los colores de tu perfil estándar. Las variables disponibles son `--ink`, `--ink-soft`, `--amber`, `--amber-deep`, `--on-amber`, `--paper`, `--paper-alt`, `--card`, `--line` y `--edge`, y los valores van como `#hex`, `rgb()` o `hsl()`. Se aplica tal cual en el modo claro y en el oscuro del sitio, así que cuidá el contraste.
- El orden en `/team`: los coordinadores siguen el orden del reglamento (Art. 8) y los colaboradores van por orden alfabético. No hace falta que toques nada para eso.

## Tu foto

Es opcional. Sin foto se muestran tus iniciales.

- Guardala **dentro de tu carpeta** con el nombre exacto `photo.jpg` (también sirven `photo.png`, `photo.webp` y `photo.svg`). Las mayúsculas importan: `Photo.JPG` no funciona.
- **Cuadrada** (unos 512 × 512 px) y liviana: **máximo 300 kB**, idealmente menos de 100 kB. [Squoosh](https://squoosh.app) comprime imágenes en el navegador.
- Solo subí fotos tuyas o que tengas permiso para publicar. Recordá que el repositorio es público.
- Dejá una sola foto por carpeta.

## Editar tu perfil más adelante

Es el mismo procedimiento, pero sin el paso 2: creá una rama, editá los archivos de tu carpeta, revisá con los tres comandos y abrí un pull request.

## Una página propia para tu perfil

Si querés ir más allá del perfil estándar, podés reemplazarlo por una página totalmente tuya. La de Fede, por ejemplo, es un escritorio Hyprland con terminal funcional (mirá [`src/members/fede/`](src/members/fede/)). La tuya puede ser lo que quieras: un portafolio, un escritorio imaginario, una página retro.

Para empezar, creá tu carpeta con la opción `--custom` (o, si ya la tenés, copiá `Profile.jsx` y `profile.css` desde `src/members/_template/` y reemplazá `__SLUG__` por tu slug en los dos):

```sh
npm run new-member -- ana-gomez --custom
```

Eso agrega a tu carpeta un `Profile.jsx` y un `profile.css` de punto de partida. El sitio los detecta solos: apenas existe `Profile.jsx`, tu perfil pasa a usar tu página. Tu componente recibe `member` con todos los datos de tu `member.js`, más `slug` y `photo` (la URL de tu foto, o `null`).

Reglas para tu página:

1. **Todo va dentro de tu carpeta**: componentes, estilos, imágenes y datos. No toques archivos del resto del sitio.
2. **Prefijá todas tus clases CSS con tu slug** (`.ana-gomez-*`). Los estilos son globales, y así no pisan los de otros perfiles ni los del sitio. La plantilla ya viene así.
3. **Conservá `<ProfileLinks />`** (viene en la plantilla). Es el enlace de vuelta a `/team` y los enlaces a la licencia y al código fuente, que la AGPL nos obliga a ofrecer. Podés colocarlo y estilizarlo como quieras, pero tiene que estar a la vista.
4. Tu página **reemplaza el menú y el pie** del sitio, así que todo lo que se ve es tuyo. El modo claro/oscuro del sitio **no** se aplica a tu página: ahí manda tu estilo.
5. **Que sea liviana y accesible**: imágenes comprimidas (la página no debería superar unos pocos MB), buen contraste, texto alternativo en las imágenes y que se pueda usar con teclado. Pensá también en el celular.
6. **Sin rastreadores ni anuncios**, ni scripts de terceros que carguen cosas de otros servidores. Es un sitio de software libre.
7. **Contenido apropiado para un club universitario**, sin datos personales sensibles (dirección, teléfono, documentos) y solo con material propio o con permiso.
8. Si usás librerías nuevas (`npm install …`), hablalo antes con la comisión técnica: se agrega al proyecto de todos. Con React y CSS se puede hacer mucho.

## Reglas de convivencia

- **Editá solo tu carpeta.** Un pull request que modifique la carpeta de otra persona o archivos del sitio (fuera de lo que cubre la sección [Cambios que no son de tu perfil](#cambios-que-no-son-de-tu-perfil)) no se va a integrar. Cada uno cuida lo suyo.
- **No cambies tu `group` ni tu `role`.** Los coordinadores los define la comisión directiva.
- **Respetá al resto.** Lo que publicás queda a la vista de toda la universidad.

## Subir tus cambios (pull request)

La rama `main` está protegida (regla `protect-main` de GitHub): **no se puede hacer push directo**. Todo cambio entra por pull request.

1. **Guardá tus cambios** en un commit. El mensaje va **en inglés y en imperativo** (por ejemplo, `Add Ana Gomez to the team`):
   ```sh
   git add src/members/ana-gomez
   git commit -m "Add Ana Gomez to the team"
   ```
2. **Subí tu rama:**
   ```sh
   git push -u origin add-ana-gomez
   ```
3. **Abrí el pull request** hacia `main` en GitHub (el enlace aparece en la terminal, o en la página del repositorio). Completá la lista de control. Como se integra con *squash*, el título del PR pasa a ser el mensaje del commit en `main`: escribilo en inglés y en imperativo.
4. **Esperá el check CI** (GitHub Actions): corre `npm run lint`, `npm run check:members` y `npm run build`, lo mismo que corriste vos. Si falla, entrá a los detalles, corregí y volvé a subir.
5. **Pedí una revisión.** Hace falta **1 aprobación** y que todas las conversaciones del código estén resueltas.
6. Cuando se aprueba e integra, **Vercel despliega el sitio automáticamente**: en un par de minutos ya estás en `/team`.

Lo que la protección de `main` impide:

- Pushear directamente a `main`: hace falta un pull request.
- Integrar sin aprobación. Si subís commits nuevos después de ser aprobado, la aprobación se descarta y hay que pedirla de nuevo.
- Integrar con conversaciones sin resolver en el PR.
- Integrar si el check **CI** falla.
- Integrar de otra forma que no sea *squash*: todos los commits de tu rama se combinan en uno solo.
- Reescribir el historial con `git push --force`.
- Borrar la rama `main`.

Solo los administradores de la organización pueden saltarse estas reglas, y aun así únicamente a través de un pull request.

## Problemas frecuentes

**`npm run check:members` me da un error.** Leé el mensaje: dice la carpeta y el campo. Los más comunes:

- *«Campo desconocido»*: un typo en el nombre de un campo (por ejemplo `distros` en vez de `distro`).
- *«debe llamarse exactamente "member.js"»* (o `Profile.jsx`, o `photo.jpg`): las mayúsculas y minúsculas importan. En Windows y macOS un nombre mal escrito funciona en tu computadora, pero falla cuando el sitio se publica en Linux.
- *«`name` todavía tiene el texto de ejemplo»*: falta poner tu nombre.
- *«debe ser null o una URL completa que empiece con https://»*: los enlaces llevan la dirección entera, con `https://`.

**Mi tarjeta no aparece en `/team`.** Fijate que la carpeta esté dentro de `src/members/`, que contenga un archivo `member.js` y que `npm run dev` no muestre errores en la terminal. Abrí la consola del navegador (F12): en desarrollo ahí aparecen los avisos sobre tus datos.

**Mi foto no se ve.** Tiene que llamarse exactamente `photo.jpg` (o `.png`, `.webp`, `.svg`) y estar dentro de tu carpeta, no en `public/`.

**`npm install` o `npm run dev` fallan.** Revisá que tengas Node.js 22.22 o superior: `node --version`.

**El pull request dice que hay conflictos.** Como cada quien edita su propia carpeta, es raro. Si pasa, avisá en el PR y lo vemos juntos.

**El CI falla en `build` pero en mi máquina anda.** Corré `npm run build` localmente y revisá el mensaje; el CI ejecuta lo mismo.

## Cambios que no son de tu perfil

Todo lo demás (páginas del sitio, estilos generales, configuración, documentación) sigue estas convenciones:

- **El código, los nombres de archivo y las rutas (URL) van en inglés.** Los textos que ve el visitante, en español.
- Corré `npm run lint` y `npm run build` antes de abrir el pull request.
- Mensajes de commit en inglés, con título en imperativo.
- Para propuestas grandes (una página nueva, un cambio de estructura, una dependencia), abrí primero un *issue* o hablalo con la comisión técnica. Cómo está armado el proyecto y hacia dónde va está en [`docs/architecture.md`](docs/architecture.md).
