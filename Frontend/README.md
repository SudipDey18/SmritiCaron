# স্মৃতিচারণ (Smritocharon)

A bilingual (বাংলা / English) nostalgic AI memory-capsule frontend built with TanStack Start, React, TypeScript and Tailwind CSS.

## Development

```sh
npm i
npm run dev
```

## Frontend routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/sign-in`, `/sign-up` | Auth screens |
| `/dashboard` | Stats, capsule grid, activity |
| `/capsules`, `/capsules/new` | Capsule list / creation |
| `/capsules/:id` | Capsule hub |
| `/capsules/:id/memories` | Memory gallery |
| `/capsules/:id/upload` | Upload memories |
| `/capsules/:id/chat` | AI conversation |
| `/capsules/:id/timeline` | Life timeline |
| `/capsules/:id/family` | Family tree |
| `/capsules/:id/time-vault` | Time-locked vaults |
| `/capsules/:id/legacy` | Legacy letters |
| `/search` | Natural-language search + advanced filters |
| `/notifications` | Notification centre |
| `/activity` | Full activity log (filterable, paginated) |
| `/profile`, `/settings` | Account & preferences |
| `/shared/:token` | Public read-only capsule |

## Connecting to the backend

Set the backend origin in `.env` (see `.env.example`) — **no trailing slash and no `/api` suffix**, because
every endpoint path already starts with `/api`:

```
VITE_API_BASE_URL=http://localhost:4000
```

Frontend integration layer (source of truth in code):

| File | Purpose |
| --- | --- |
| `src/lib/api/types.ts` | TypeScript models for every backend entity |
| `src/lib/api/client.ts` | `api()` fetch wrapper: envelope unwrapping, `ApiError`, bearer tokens, transparent refresh, `mediaUrl()` |
| `src/lib/api/endpoints.ts` | One typed function per REST endpoint, grouped per domain |
| `src/lib/api/hooks.ts` | TanStack Query hooks + query keys (`qk`) with cache invalidation |
| `src/lib/auth.tsx` | `AuthProvider`, `useAuth()`, `useRequireAuth()`; tokens in `localStorage` |

Tokens: access + refresh are stored client-side; a `401` triggers one shared
`POST /api/auth/refresh` attempt and the original request is replayed.
Media paths returned by the API are resolved with `mediaUrl(path, shareToken?)`.

## API structure (backend contract)

Auth: `Authorization: Bearer <access_token>` on every request except auth and shared-link endpoints.
Content type: `application/json` (except uploads → `multipart/form-data`).


### Response envelope

```json
{ "success": true, "data": { }, "error": null }
```

Errors: `{ "success": false, "data": null, "error": { "code": "NOT_FOUND", "message": "..." } }`

Paginated lists: `{ "items": [], "page": 1, "per_page": 20, "total": 134 }`

### Auth

| Method | Endpoint | Body / Notes |
| --- | --- | --- |
| POST | `/auth/register` | `{ name, email, password, language }` |
| POST | `/auth/login` | `{ email, password }` → `{ access_token, refresh_token, user }` |
| POST | `/auth/refresh` | `{ refresh_token }` |
| POST | `/auth/logout` | — |
| GET | `/auth/me` | current user |

### Capsules

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules` | `?q=&status=active|sealed&page=` |
| POST | `/capsules` | `{ name: {bn,en}, subject: {bn,en}, relation, hue, privacy }` |
| GET | `/capsules/:id` | capsule + counts |
| PATCH | `/capsules/:id` | partial update |
| DELETE | `/capsules/:id` | — |
| GET | `/capsules/:id/stats` | `{ memory_count, storage_bytes, vault_count, letter_count }` |

Capsule object:

```json
{
  "id": "dida",
  "name": { "bn": "দিদার সিন্দুক", "en": "Dida's Capsule" },
  "subject": { "bn": "...", "en": "..." },
  "hue": 45,
  "status": "active",
  "memory_count": 128,
  "cover_url": "https://.../cover.jpg",
  "updated_at": "2026-07-28T10:12:00Z"
}
```

### Memories

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/memories` | `?type=photo|audio|video|text|document&tag=&page=` |
| POST | `/capsules/:id/memories` | `multipart/form-data`: `file`, `title_bn`, `title_en`, `description_bn`, `description_en`, `taken_at`, `tags[]` |
| GET | `/memories/:memory_id` | detail + AI-extracted metadata |
| PATCH | `/memories/:memory_id` | metadata edit |
| DELETE | `/memories/:memory_id` | — |
| GET | `/memories/:memory_id/transcript` | audio/video transcript |

```json
{
  "id": "m_101",
  "type": "photo",
  "url": "https://.../m_101.jpg",
  "thumb_url": "https://.../m_101_thumb.jpg",
  "title": { "bn": "...", "en": "..." },
  "taken_at": "1978-04-14",
  "tags": ["পুজো", "family"],
  "processing_status": "ready"
}
```

### AI chat

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/chat/messages` | history, `?before=&limit=` |
| POST | `/capsules/:id/chat` | `{ message, language: "bn"\|"en" }` |
| POST | `/capsules/:id/chat/stream` | SSE stream of `token`, `citations`, `done` events |
| DELETE | `/capsules/:id/chat` | clear history |

Assistant reply:

```json
{
  "id": "msg_9",
  "role": "assistant",
  "content": "...",
  "citations": [{ "memory_id": "m_101", "snippet": "...", "score": 0.82 }],
  "created_at": "2026-07-31T09:00:00Z"
}
```

### Timeline

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/timeline` | `?from=&to=&category=` |
| POST | `/capsules/:id/timeline` | `{ date, title: {bn,en}, description: {bn,en}, category, memory_ids[] }` |
| PATCH / DELETE | `/timeline/:event_id` | edit / remove |

### Family tree

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/family` | `{ members: [], relations: [] }` |
| POST | `/capsules/:id/family` | `{ name: {bn,en}, generation, birth_year, photo_url }` |
| POST | `/capsules/:id/family/relations` | `{ from_id, to_id, type: "parent"\|"spouse"\|"sibling" }` |
| PATCH / DELETE | `/family/:member_id` | edit / remove |

### Time vaults

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/vaults` | `state: "sealed"\|"open"`, `opens_at` |
| POST | `/capsules/:id/vaults` | `{ title: {bn,en}, message, memory_ids[], opens_at, recipients[] }` |
| GET | `/vaults/:vault_id` | `403 VAULT_SEALED` before `opens_at` |
| PATCH / DELETE | `/vaults/:vault_id` | only while sealed |

### Legacy letters

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/capsules/:id/letters` | scheduled letters |
| POST | `/capsules/:id/letters` | `{ to_name, to_email, subject, body, deliver_at, delivery: "email"\|"link" }` |
| PATCH / DELETE | `/letters/:letter_id` | before delivery only |

### Sharing

| Method | Endpoint | Notes |
| --- | --- | --- |
| POST | `/capsules/:id/share` | `{ scope: "read", expires_at, password? }` → `{ token, url }` |
| GET | `/shared/:token` | public, no auth; capsule + memories (read-only) |
| DELETE | `/shared/:token` | revoke |

### Profile & settings

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET / PATCH | `/users/me` | `{ name, avatar_url, language, theme }` |
| PATCH | `/users/me/password` | `{ current_password, new_password }` |
| GET | `/users/me/storage` | `{ used_bytes, quota_bytes }` |
| GET | `/users/me/activity` | recent activity feed |

### Notifications, activity, search & exports

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/notifications?unread=true&page=1` | `{ id, kind, title, body, when, read }`; `kind` ∈ `vault_unlocked \| letter_delivered \| ai_completed \| upload_completed \| share_accepted \| error` |
| POST | `/notifications/:id/read` | Mark one read |
| POST | `/notifications/read-all` | Mark all read |
| GET | `/activity?kind=upload&page=1&per_page=12` | `kind` ∈ `upload \| edit \| chat \| vault \| letter \| share` |
| GET | `/search?q=...&type=photo&emotion=nostalgia&from=&to=` | Natural-language/semantic search; returns `{ group, id, label, sub, relevance }` |
| GET | `/ai/jobs` | Processing queue: `{ id, file, kind: ocr\|transcript\|caption\|embedding, state: pending\|processing\|completed\|failed, progress }` |
| POST | `/ai/jobs/:id/retry` | Retry a failed job |
| DELETE | `/ai/jobs/:id` | Cancel a pending/processing job |
| GET | `/capsules/:id/insights/weekly` | Weekly AI summary `{ headline, body, stats[] }` |
| GET | `/capsules/:id/storage-series` | Monthly storage points `{ label, mb }` |
| POST | `/capsules/:id/exports` | Body `{ format: zip\|json\|md\|pdf }` → `{ job_id }` |
| GET | `/exports/:job_id` | `{ state, download_url }` |
| GET/POST/DELETE | `/capsules/:id/shares` | Share links `{ token, scope, password, expires, views }` |

### Error codes

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `VAULT_SEALED`, `STORAGE_LIMIT`, `UNSUPPORTED_MEDIA_TYPE`, `RATE_LIMITED`, `SERVER_ERROR`.

## Create-capsule wizard → API payload

`/capsules/new` is fully interactive (clickable step chips, privacy chips, relation select,
language select, AI-chat switch) and submits via `POST /api/capsules`:

```json
{
  "title": "দিদার সিন্দুক",
  "description": "…",
  "privacy": "PRIVATE | FAMILY | PUBLIC",
  "relation": "grandmother | grandfather | mother | father | uncle | self",
  "tags": ["lang:bn", "ai:on", "subject:সরস্বতী দেবী", "dob:1938-04-14"]
}
```

Response must return the created capsule with its `id`; the UI then routes to `/capsules/:id`.

## Assets

The hero logo is served from `public/image.png` and referenced as `/image.png`
(no CDN asset pointer). Replace that file to change the logo.

## Endpoints still needed / to confirm

1. `POST /api/capsules` — accept `privacy`, `relation`, `tags` (the wizard sends
   subject name, date of birth, capsule language and the AI-chat flag as tags today).
   If you prefer first-class fields (`subjectName`, `subjectDob`, `language`,
   `aiChatEnabled`), expose them and I will switch the payload.
2. `POST /api/capsules/:id/cover` (multipart `file`) — cover-image upload; the wizard's
   cover box is a placeholder until this exists.
3. `GET /api/memories/search` — include `capsuleId` on every hit so results can deep-link.
4. `GET /api/settings/notifications` — confirm the emitted `type` values
   (`vault | letter | ai | upload | share | error`).
5. Optional (UI ready, currently local-only): chat SSE streaming
   (`POST /api/capsules/:id/chat/stream`), memory version history, duplicate detection,
   and search filters by media type / emotion / date range.



## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
