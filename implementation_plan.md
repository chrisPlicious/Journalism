# MindNest Improvement Plan — Backend & Frontend

A prioritized, actionable roadmap for hardening, scaling, and polishing the MindNest journaling application across both the ASP.NET Core backend and the React/TypeScript frontend.

---

## 🔴 Priority 1 — Security & Correctness (Critical)

### Backend

#### [MODIFY] [appsettings.json](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/appsettings.json)
- **Hardcoded JWT secret** (`YourSuperSecretKeyHere...`) and **Google Client ID** are committed to source. Move both to **User Secrets** (dev) or environment variables (prod).
- Add a [.gitignore](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/.gitignore) entry for [appsettings.Development.json](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/appsettings.Development.json) if it contains real secrets.

#### [MODIFY] [Program.cs](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Program.cs)
- **CORS is called *after* `MapControllers()`** (line 168). Move `app.UseCors("AllowFrontend")` **before** `app.UseAuthentication()` so the middleware pipeline order is correct:
  ```
  UseCors → UseAuthentication → UseAuthorization → MapControllers
  ```
- Add **global exception-handling middleware** (`app.UseExceptionHandler`) to prevent stack traces from leaking to clients.
- Add **rate limiting** (`builder.Services.AddRateLimiter(...)`) on auth endpoints to block brute-force attacks.

#### [MODIFY] [AuthController.cs](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/AuthController.cs)
- [GetUserById(string id)](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/AuthController.cs#54-71) (line 54) is **unauthenticated** — anyone can fetch any user's profile by guessing IDs. Either add `[Authorize]` or remove the endpoint entirely (the `/profile` endpoint already serves the same purpose for the authenticated user).
- Add logging to GoogleLogin for failed auth attempts.

#### [MODIFY] [JournalEntry.cs](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Models/JournalEntry.cs)
- `DateTime.UtcNow` in property initializers runs **at object construction time**, not at database insertion time. Use `HasDefaultValueSql("GETUTCDATE()")` in the EF configuration instead for reliable server-side timestamps.

---

## 🟠 Priority 2 — Architecture & Reliability

### Backend

#### [NEW] Global Error Handling Middleware
- Create a `Middleware/ExceptionHandlerMiddleware.cs` that catches unhandled exceptions, logs them via `ILogger`, and returns a standardized JSON error response (`{ "error": "...", "traceId": "..." }`).

#### [MODIFY] [JournalController.cs](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/JournalController.cs)
- **Filtering is done in memory** — [GetAllEntries](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/JournalController.cs#29-48) fetches *all* user entries from the DB, then filters in C#. Push filters into the repository query with `IQueryable` for performance.
- **Missing pagination** — Add `[FromQuery] int page = 1, int pageSize = 20` and return paginated results with a `{ items, totalCount, page, pageSize }` envelope. This is critical once a user has 100+ entries.
- **Search endpoints** (`/search` and `/search/title`) are called from the frontend but **don't exist in the controller**. They will 404. Add them or remove the dead frontend code.

#### [MODIFY] [IJournalService.cs](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Services/Interfaces/IJournalService.cs)
- Add `SearchEntriesAsync(string userId, string query)` to support the search feature the frontend expects.
- Update [GetAllEntriesAsync](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Services/Implementations/JournalService.cs#26-37) signature to accept pagination and filter parameters.

#### [NEW] Result Pattern
- Replace bare `bool` and nullable returns with a `Result<T>` type that carries error messages. This avoids ambiguity between "not found" and "unauthorized" when returning `null`.

### Frontend

#### [MODIFY] [api.ts](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/services/api.ts)
- **Auth header logic is duplicated** across every function. Create an Axios **instance with an interceptor** that injects the token automatically:
  ```ts
  const api = axios.create({ baseURL: API_URL });
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- Add a **response interceptor** that catches `401` errors and redirects to login (token expiry handling).
- [updateProfile](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/services/api.ts#62-69) uses `any` type — replace with `UserProfileUpdateDto`.

#### [MODIFY] [AuthContext.tsx](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/context/AuthContext.tsx)
- Add **token expiry checking** — decode the JWT and check `exp` before making requests, or handle 401s from the response interceptor.
- Consider storing auth state in an **Axios instance** rather than raw `localStorage` reads spread across the codebase.

---

## 🟡 Priority 3 — Testing (Currently Zero Coverage)

> [!IMPORTANT]
> There are **no tests** anywhere in the project — no xUnit, no Jest, no Playwright.

### Backend — Unit Tests

#### [NEW] `Backend/JournalBackend.Tests/` (xUnit project)
- **Controller tests**: Mock [IJournalService](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Services/Interfaces/IJournalService.cs#5-17) / [IAuthService](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Services/Interfaces/IAuthService.cs#6-15) with Moq. Verify HTTP status codes, model validation, and authorization behavior.
- **Service tests**: Mock `IRepository`, verify business logic (pin toggle, duplicate title check, etc.).
- **Key test cases**:
  - Creating a duplicate-titled entry returns 400
  - Unauthenticated access to `[Authorize]` endpoints returns 401
  - [TogglePin](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/JournalController.cs#92-110) flips `IsPinned` correctly
  - Pagination returns correct `totalCount`

### Frontend — Component Tests

#### [NEW] Vitest + React Testing Library setup
- Add `vitest` and `@testing-library/react` to `devDependencies`.
- **Test cases**:
  - [AuthContext](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/context/AuthContext.tsx#10-29) correctly sets/clears user state
  - `ProtectedRoutes` redirects unauthenticated users
  - [EntriesPage](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/pages/EntriesPage.tsx#34-309) renders journal cards from mock data
  - API interceptor attaches token header

### Verification Commands
```bash
# Backend tests (once xUnit project is added)
cd Backend/JournalBackend.Tests && dotnet test

# Frontend tests (once Vitest is configured)
cd Frontend/JournalFrontend && npx vitest run
```

---

## 🟢 Priority 4 — Performance & Scalability

### Backend

- **Add DB indexes** on `JournalEntry.CreatedAt` and `JournalEntry.Category` (the `UserId + Title` composite index already exists).
- **Implement response caching** on [GetAllEntries](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Backend/JournalBackend/Controllers/JournalController.cs#29-48) with a short TTL (e.g., 30s) using `[ResponseCache]` or output caching middleware.
- **Add health checks** (`builder.Services.AddHealthChecks().AddSqlServer(...)`) for monitoring.

### Frontend

- **Lazy-load pages** with `React.lazy()` + `Suspense` — currently all pages are eagerly imported in the router.
- **Debounce search** — The search API calls likely fire on every keystroke. Add a 300ms debounce.
- **Virtualize long lists** — If entries grow large, use `react-window` or `@tanstack/react-virtual` for the entries list.
- **Image/avatar optimization** — Ensure avatar images are served in modern formats (WebP) and appropriately sized.

---

## 🔵 Priority 5 — UX & Feature Improvements

### Frontend

- **[LandinPage.tsx](file:///c:/Users/Chris%20Paul/Documents/journal/Journalism/Frontend/JournalFrontend/src/pages/LandinPage.tsx)** has a typo in the filename → rename to `LandingPage.tsx`.
- **No loading/skeleton states** — Add skeleton loaders for the entries list and profile page to improve perceived performance.
- **No empty state** — When a user has zero entries, show an encouraging illustration + "Create your first entry" CTA instead of a blank page.
- **Toast notifications** — Add a toast system (e.g., `sonner` or `react-hot-toast`) for success/error feedback on CRUD operations.
- **Dark/light theme toggle** — The infrastructure for this likely exists given shadcn/ui, but wire it up with a persistent preference.
- **Offline indicator** — Show a banner when the network is down.
- **Confirm dialog on delete** — Prevent accidental deletions with a confirmation modal.

### Backend

- **Add `Tags` model** — Allow entries to have multiple tags (many-to-many) for better organization beyond categories.
- **Export/Import** — Add endpoints to export all entries as JSON/CSV and import them back.
- **Soft delete** — Instead of hard-deleting entries, add an `IsDeleted` flag with a "Trash" view and 30-day auto-purge.
- **Entry versioning/history** — Track edit history for entries.

---

## 📋 Summary: Recommended Execution Order

| Phase | Items | Effort |
|-------|-------|--------|
| **Phase 1** | Secrets management, CORS fix, unauthenticated endpoint fix, timestamp fix | ~2 hours |
| **Phase 2** | Axios interceptors, error middleware, search endpoints, pagination | ~4 hours |
| **Phase 3** | xUnit test project + Vitest setup with initial test suites | ~4 hours |
| **Phase 4** | Lazy loading, debounce, DB indexes, health checks | ~3 hours |
| **Phase 5** | UX polish (toasts, skeletons, empty states, theme toggle) | ~4 hours |
| **Phase 6** | New features (tags, soft delete, export) | ~6 hours |

---

> [!TIP]
> I recommend starting with **Phase 1** (security fixes are non-negotiable) and then **Phase 2** (the missing search endpoints are a live bug). Let me know which phase(s) you'd like me to start implementing!
