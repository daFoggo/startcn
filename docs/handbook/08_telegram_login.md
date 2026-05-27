# Telegram Login

The frontend supports Telegram browser sign-in through Telegram OIDC and keeps Telegram account linking as a separate feature.

## Main Files

- `src/features/auth/components/telegram-login-button.tsx` starts Telegram OIDC login.
- `src/routes/auth/telegram.tsx` handles the Telegram callback.
- `src/features/auth/server.ts` calls `POST auth/telegram` on the backend.
- `src/features/auth/functions.ts` wraps auth calls with `createServerFn` and updates the app session.
- `src/features/auth/queries.ts` exposes auth mutations.
- `src/features/telegram/*` owns account-linking API and UI code.

Do not export `server.ts` through feature barrels. Keep server-only backend calls behind `functions.ts`.

## OIDC Sign-In Flow

The sign-in button:

1. Reads `VITE_TELEGRAM_LOGIN_CLIENT_ID`.
2. Builds `redirect_uri` as `${window.location.origin}/auth/telegram`.
3. Generates a random `state`.
4. Generates a PKCE `code_verifier` and S256 `code_challenge`.
5. Stores login state in `sessionStorage` and `localStorage`.
6. Redirects the browser to `https://oauth.telegram.org/auth`.

The Telegram auth URL must include:

- `client_id`
- `redirect_uri`
- `response_type=code`
- `scope=openid profile phone telegram:bot_access`
- `state`
- `code_challenge`
- `code_challenge_method=S256`

## Callback Route

`/auth/telegram` accepts either:

- OIDC callback params: `code` and `state`.
- Legacy widget params: `id`, `auth_date`, and `hash`.

For OIDC callbacks:

1. Read stored login state.
2. Validate `state`.
3. Reject expired login state.
4. Send `{ code, redirect_uri, code_verifier }` to `signInWithTelegram`.
5. Clear stored Telegram login state.
6. Store token expiration metadata in `localStorage`.
7. Navigate to the requested redirect or dashboard route.

The backend response is an envelope. The server function must return `response.data`, because tokens are inside:

```ts
response.data.access_token
response.data.refresh_token
```

Do not read tokens from the top-level HTTP response.

## React StrictMode Guard

The callback route can run effects twice in development under React StrictMode. Do not mark a callback as processed before success or error handling has run.

Use a module-level promise map to dedupe the network exchange, but let each live effect attach its own `.then()` / `.catch()` handlers:

```ts
const existingCallback = telegramCallbackPromises.get(callbackKey)
const callbackPromise = existingCallback || exchangeCallback()
```

Only mark the callback as settled after the active handler navigates or records an error. Otherwise the first StrictMode cleanup can cancel navigation while the second effect refuses to handle the already-started promise, leaving the page stuck on loading.

## Session Handling

`signInWithTelegramFn` must update the server session after the backend returns tokens:

```ts
await session.update({
  access_token: response.access_token,
  refresh_token: response.refresh_token,
})
```

This matches email sign-in and lets `src/lib/auth-token.ts` read tokens consistently for future Ky requests.

Client-side expiration values are stored in `localStorage` for refresh timing only:

- `expiration`
- `refresh_expiration`

Do not store additional Telegram OIDC secrets after callback completion.

## Account Linking

Account linking is not the same as sign-in.

The code under `src/features/telegram/` starts backend link sessions and opens the bot link returned by `POST telegram/link/start`. Keep this code even if settings pages or the old linking UI are removed.

Current responsibilities:

- `src/features/telegram/server.ts` calls the backend link endpoint.
- `src/features/telegram/queries.ts` exposes the mutation.
- `src/features/telegram/components/telegram-link-card.tsx` opens the Telegram bot link.

If a new page reintroduces linking UI, compose the existing feature component from a route or layout. Do not move linking behavior into auth sign-in components.

## Redirects

Avoid redirecting to deleted or placeholder settings routes. If profile completion UI does not exist, route incomplete users to a valid dashboard page such as `/dashboard/overview`.

When honoring an incoming `redirect`, only navigate internally when the URL origin matches the current app origin. External redirects should use `window.location.href` deliberately.

## Error Handling

Let Ky and server functions throw for backend failures. UI code should show errors with:

```ts
getErrorMessage(error, "Telegram sign in failed. Please try again.")
```

Do not swallow callback errors into an endless loading state.

## Verification

For changes in this area, run:

```bash
pnpx @biomejs/biome check --write src/routes/auth/telegram.tsx src/features/auth
pnpm typecheck
```

Also manually test:

- Telegram auth redirects back to `/auth/telegram?code=...&state=...`.
- Backend returns `200`.
- Callback page leaves loading state.
- User reaches dashboard.
- A second callback render in dev does not create duplicate sign-ins or block navigation.
