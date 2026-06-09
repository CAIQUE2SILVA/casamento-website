# AGENTS.md

## Cursor Cloud specific instructions

### Visão geral

Site de casamento em **Angular 19** (SPA). Backend em **Supabase** (Postgres + Storage). Não há API local nem Docker.

### Comandos principais

| Ação | Comando |
|------|---------|
| Instalar deps | `npm ci --legacy-peer-deps` |
| Dev server | `npm start` (ou `ng serve`) → http://localhost:4200 |
| Build produção | `npm run build` |
| Testes unitários | `CHROME_BIN=/usr/local/bin/google-chrome npm test -- --no-watch --browsers=ChromeHeadless` |

**Nota:** `npm ci` sem `--legacy-peer-deps` falha por conflito de peer dependencies entre Angular 19 e pacotes Firebase/Data Connect.

### Serviços

- **Obrigatório:** servidor Angular (`npm start`).
- **Obrigatório (cloud):** projeto Supabase configurado em `src/environments/environment.ts` (`url`, `key`, `bucketName`). O schema está em `supabase-setup.sql`.
- **Opcional:** EmailJS (`CONFIGURACAO-EMAILJS.md`), Firebase Functions em `functions/` (legado, não usado pelo app).

### Gotchas

- `@angular-devkit/build-angular` deve ser **v19.x** (compatível com Angular 19). A v21 quebra `ng build`/`ng serve`.
- Não há script `lint` na raiz; lint existe apenas em `functions/` (Firebase, opcional).
- O spec padrão `app.component.spec.ts` referencia `app.title`, que não existe mais — `ng test` falha na compilação até o spec ser atualizado.
- Várias rotas estão comentadas em `src/app/app.routes.ts` (`/presentes`, `/wishlist`, rotas admin aninhadas); links na toolbar podem redirecionar para home.
- Login admin (hardcoded): email `admin@admin`, senha `caca12390` → `/admin/dashboard`.
- Para E2E manual: home → `/cerimonia` → `/fotos` → `/convite` → `/login` → `/admin/convidados`.

### SSR / Firebase

- SSR (`npm run serve:ssr:casamento-website`) exige build prévio; não é o fluxo normal de dev.
- `dataconnect/` e `functions/` são legado/não usados pelo app Angular principal.
