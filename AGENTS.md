# AGENTS.md

Personal sandbox app built with **Bun 1.4.3** (pinned in `package.json` `engines`; no lockfile committed). Not a git repo. ESM only (`"type": "module"`).

## Commands

- Start the server: `bun run serve` (runs `bun src/index.js`; Bun auto-loads `.env`)
- Test: `bun test` — tests live under the root `test/` directory as `*.test.js` and import source via `../src/...` (see `test/uri.test.js`).
- There is no build, lint, or typecheck step.

## Environment

- `src/system/environment.js` reads 8 required vars at **import time**: `NAME`, `DESCRIPTION`, `VERSION`, `PROTOCOL`, `HOST`, `PORT`, `BASE_PATH`, `API_BASE_PATH`. If any is missing/empty it prints an error and calls `process.exit(1)`.
- `.env` provides these; anything importing `environment.js` outside `bun run` will crash if the vars aren't set.

## Architecture

Request flow: `index.js` → `network/server.js` (`serve` + middleware pipeline) → `network/route.js` (path+method → response) → `responses/*.response.js`.

- To add a route: create `requests/x.request.js` (exports `method`, `path_name`, `boundary`, `data()`) and `responses/x.response.js` (exports `respond()` returning a `Response`), then register both in `network/route.js`'s `mapping` (keyed by boundary, then path).
- **Boundaries** live on the request module itself (no shared constants file): `boundary` is the literal `"public"` or `"api"`, mapping to `/BASE_PATH` and `/API_BASE_PATH` respectively. `network/scope.js` resolves the boundary from the pathname and stores `boundary` + boundary-relative `path_name` in the context; requests outside every boundary get **403** (not 404), unrouted paths inside a boundary get 404.
- `network/status.js` holds frozen status code constants + reason texts; use `status.code.*`, never raw numbers.
- `network/middleware.js` `pipeline(interceptors)(handler)` — each interceptor is `(context, next) => response`. The context comes from `network/context.js` (`create` — which parses `request.url` into a `uri` — plus `set`/`get` state bag and `elapsed` timing); the handler receives it too. Interceptors run in order: logging (`network/log.js`) then scope check (`network/scope.js`).
- `system/uri.js` is the URL wrapper: `http(location)` returns `{protocol, host, port, pathname, parameters, href}` (no trailing colon in `protocol`), `file(location)` converts a `file://` URI to a filesystem path, plus `is_http`/`is_file`/`join`.
- `system/*` is the **only** layer that touches `node:*` builtins — higher layers must import through it (`system/io.js`, `system/path.js`, `system/environment.js`, `system/uri.js`).
- `views/*.view.js` + `components/element.component.js` render HTML strings (`element(tag, attrs, ...children)`); the SPA shell (`root.view.js`) and `application/navigation.js` are not yet served by any route.

## Conventions (strict house style — follow it exactly)

- Functional style only: arrow functions in `const`, no classes, no default exports
- Explicit named exports in an `export { ... }` block at the bottom of each file
- snake_case for files, functions, and variables; filenames are suffixed by layer: `*.request.js`, `*.response.js`, `*.view.js`, `*.component.js`
- `console.*` in app code means `src/system/console.js` (timestamped wrapper), not `node:console`
- Error handling pattern: log via `system/console.js` then `process.exit(process.code.FAILURE)` (see `system/environment.js`, `system/value.js`) rather than throwing
