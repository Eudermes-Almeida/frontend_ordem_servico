# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Angular 17 (standalone components, no NgModules) front-end for an OS/repair-shop management system ("Só Monitores & Nobreaks"): client registration, service-order (OS) lifecycle, expenses, financial reports and budgets. The Angular project is named `api` in `angular.json`/`package.json`, but this repo is the **front end only** — it talks to a separate backend REST API that is not part of this repository (see "Backend dependency" below).

## Commands

```bash
npm install          # install dependencies
npm start             # ng serve — dev server at http://localhost:4200 (auto-reloads)
npm run build         # ng build — production build (default configuration) to dist/api
npm run watch          # ng build --watch --configuration development
npm test              # ng test — Karma/Jasmine unit tests (Chrome launcher)
```

- Single test file: `ng test --include='**/formcadcliente.component.spec.ts'`
- Dev build (no optimization, source maps, faster): `ng build --configuration development`
- There is no linter (no ESLint/Prettier config) — `.editorconfig` only enforces 2-space indent and single quotes in `.ts` files.
- Most `*.spec.ts` files are default Angular CLI boilerplate (`should create`) — they don't cover business logic.

## Backend dependency

`OrdemservicoService` (`src/app/servico/ordemservico.service.ts`) hardcodes the API base URL as:
```ts
urlServidor: string = `http://${window.location.hostname}:8085/`;
```
i.e. the frontend always calls port `8085` on whatever host it is itself served from. For local dev this means a backend must be running on `localhost:8085`. `ParametrosService`, `DespesaService` and `FinanceiroService` follow the same convention. `buscaCep()` calls the public ViaCEP API directly (`https://viacep.com.br/ws/`).

`server.js` (Express, hardcoded to `C:\FRONT_END\dist\api\browser` and IP `192.168.15.7:8082`) is a **production deployment script** for serving the built `dist/` output on a specific machine — it is not used in normal development and its paths are environment-specific, not a template to generalize.

## Architecture

### Page pattern: `pag-*` wrapper + `form-*` logic

Every feature lives under `src/app/PAGINAS/<FEATURE>/` and (with a couple of exceptions like `HOME` and `LINHA_DO_TEMPO_OS`) splits into two standalone components:

- **`pag-*` component** — pure layout wrapper. Composes the shared chrome (`<app-cabecalho>`, `<app-menu-lateral>`, `<app-rodape>`, all in `PAGINAS/HOME/`) around the actual `form-*` component. Routed directly from `app.routes.ts`.
- **`form-*` component** — the real page: Angular Reactive Forms (`FormGroup`/`FormControl`, `formControlName`), HTTP calls via the services in `src/app/servico/`, and all business logic.

When adding a new page, follow this same split rather than putting layout and logic in one component. Routes are declared flat in `src/app/app.routes.ts` (no route-level guards or lazy loading — every page component is eagerly imported).

### Services and models

- `src/app/servico/` — one `@Injectable({ providedIn: 'root' })` service per domain area (`ordemservico.service.ts`, `parametros.service.ts`, `despesa.service.ts`, `financeiro.service.ts`). `OrdemservicoService` is the largest: it covers both `Cliente` and `Os` CRUD, report endpoints, ViaCEP lookup, and also doubles as cross-page state memory (e.g. `setOs`/`getOs` via a `BehaviorSubject`, used so the OS timeline component can read state set by the "alterar OS" pages).
- `src/app/modelo/` — plain TS classes mirroring backend DTOs (`Cliente`, `Os`, `Despesa`, `Financeiro`, `ParametrosCombobox`, etc.). `Os` in particular has a large flat field list (equipment, defects, pricing breakdown, warranty) — treat it as the source of truth for what an OS record looks like.

### Multi-step OS editing

Editing an existing OS is split across two routed pages, `ALTERA_OS_PAG_1` and `ALTERA_OS_PAG_2` (`/os/consulta/alterapg1/:os` and `/os/consulta/alterapg2/:os`), navigated between via a "Página 2" button that carries the OS number in the route param. `LINHA_DO_TEMPO_OS/timeline` reads the currently-loaded OS from `OrdemservicoService`'s `os$` observable to render a status timeline alongside these pages.

### PDF/print receipts

`CADASTRO_OS`'s form component renders an on-screen search/registration UI **and**, in the same template, a hidden `#pdf-content` block styled as a physical white-paper receipt (header, warranty text, signature lines, QR code via `angularx-qrcode`, a printer label). This block is captured with `html2canvas`/`jsPDF` (`gerarPDF()`) — it intentionally uses its own light/print CSS (`.info-table`, `.header`, `.etiqueta`, etc.) and must **not** be restyled to match the app's dark theme; only the interactive form part of that page should follow the UI conventions below.

## UI/styling conventions

- `src/styles.css` is empty — there are no global styles. All styling is component-scoped CSS (Angular emulated view encapsulation), so shared look-and-feel is achieved by repeating the same CSS in each component, not via a shared stylesheet or SCSS mixins.
- Bootstrap 5 + Bootstrap Icons are loaded globally via `angular.json` (`styles`/`scripts` arrays) and the JS bundle. Several components *also* redundantly `<link>` the Bootstrap Icons CDN at the top of their own template — this is pre-existing duplication, harmless, and not worth "fixing" unless asked.
- A dark "tech" design system (black background, orange `#ffa500` accent, glassmorphism cards, fullscreen layout) has been progressively applied to the client/OS cadastro-consulta-altera form components (`CADASTRO_CLIENTE`, `CONSULTA_CLIENTE`, `ALTERA_CLIENTE`, `CADASTRO_OS`, `CONSULTA_OS`, `ALTERA_OS_PAG_1`). Each component redefines the same token set and class names locally (since there's no shared stylesheet): `:host` CSS custom properties (`--cc-orange`, `--cc-panel`, etc.), and classes `cc-page` / `cc-shell` / `cc-header` / `cc-card` / `cc-grid` / `cc-field` / `cc-label` / `cc-input` / `cc-select` / `cc-btn` (`-primary`/`-ghost`) / `cc-table` / `cc-actions` / `cc-alert`. When touching more pages in this family, reuse this exact pattern rather than inventing a new one, for visual consistency across the app.
- Production builds enforce a **per-component style budget** (`angular.json` → `budgets`): `anyComponentStyle` warns at 6kb and errors at 8kb. Keep an eye on this when adding large component CSS files; run `ng build` (production config) to verify before considering a redesign done.

## Known pre-existing quirks (do not "fix" incidentally)

- `src/app/app.config.ts` registers `provideServiceWorker(...)` dozens of times with identical arguments (harmless but very repetitive) — likely a copy/paste artifact.
- `src/index.html` similarly repeats `<link rel="manifest">`/`<meta name="theme-color">` many times.
- Several templates bind `formControlName` twice on the same input, or reuse the same template reference variable (`#codigoClienteInput`) on two different elements, or use duplicate `id`s across two selects (e.g. `ALTERA_OS_PAG_1`'s `defeito1`/`defeito2` selects both originally used `id="defeitos"`). These are pre-existing bugs; only touch them if the user asks, or clean them up incidentally when already rewriting that exact markup for another reason.
