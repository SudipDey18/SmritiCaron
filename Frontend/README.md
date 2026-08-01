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
| `/profile`, `/settings` | Account & preferences |
| `/shared/:token` | Public read-only capsule |

All screens currently read from `src/lib/mock-data.ts`. Replace those reads with the API calls below.

## API structure (backend contract)

Base URL: `VITE_API_BASE_URL` (e.g. `http://localhost:5000/api`)

Auth: `Authorization: Bearer <access_token>` on every request except auth and shared-link endpoints.
Content type: `application/json` (except uploads → `multipart/form-data`).
Every bilingual text field is an object: `{ "bn": "...", "en": "..." }`.

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

### Error codes

`UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, `VAULT_SEALED`, `STORAGE_LIMIT`, `UNSUPPORTED_MEDIA_TYPE`, `RATE_LIMITED`, `SERVER_ERROR`.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
