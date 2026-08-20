# Phase 4 — Authentication (OI-Truck / Truck Lagbe)

> Frontend-only, localStorage-backed. App: `frontend/`. Next 16.3 + React 19 + TS + Tailwind 4.
> Shell is PowerShell (use `;`). Import via `@/` alias. This plan requires source edits — run it with an implementation-capable agent.

## Goal
Make the entire app actually consume the existing `AuthContext`: real login/register, role-based route guards, role-based post-login redirects, and logout UI. `AuthContext` is already a complete, correct engine mounted at the root (`app/layout.tsx:24`); today **nothing uses it** for auth flows.

## Locked Decisions
1. **Canonical routes:** keep `/login` + `/register`; wire them to `useAuth`; **delete** the empty stubs `app/auth/login`, `app/auth/register`, `app/auth/forgot-password`.
2. **Driver flow:** driver registration creates a `User` with `role:"driver"`, `isActive:false`. `login()` already blocks inactive accounts. Admin approval flips `isActive:true`, then the driver can log in. Seed one approved demo driver. Retire the legacy `trucklagbe-driver-applications` store.
3. **Protection matrix:** gate `/booking` + customer areas; tracking public (see table). `/admin/*` admin-only; `/driver/*` driver-only except driver registration.
4. **Redirects:** post-login admin→`/admin`, driver→`/driver`, customer→`/dashboard`. Authenticated users hitting `/login` or `/register` bounce to their dashboard. Logout → `/`.
5. **Out of scope:** per-customer booking ownership (bookings have no `userId`; customer currently sees ALL bookings). Flagged as follow-up.

## Current State (verified)
- `context/AuthContext.tsx`: store `trucklagbe_users` + `trucklagbe_current_user`; `login(email,password)` checks password + `isActive` (returns `"Your account is currently inactive."`); `register(userData)` currently forces `isActive:true` and does **not** auto-login; also `logout`, `updateUser`, `getUsersByRole`. Seeds: `admin@trucklagbe.com/admin123`, `customer@trucklagbe.com/customer123`. **No driver seeded.**
- `app/login/page.tsx`: legacy — reads `trucklagbe-customer` / `trucklagbe-driver-applications` (hyphen keys), ignores password, never touches `trucklagbe_users`. Seeded users cannot log in.
- `app/register/page.tsx`: role chooser → `/register/customer` and `/driver/register`. Exports a shared `Success` component (imported by both register pages).
- `app/register/customer/page.tsx`: writes a single `trucklagbe-customer` object (not the users array).
- `app/driver/register/page.tsx`: writes `trucklagbe-driver-applications` (status "Pending"). Linked from `Navbar`, `/register` chooser, and `app/driver/page.tsx:131`.
- `app/auth/{login,register,forgot-password}/page.tsx`: **empty (0 lines)** → break `next build`.
- `app/admin/layout.tsx`, `app/driver/layout.tsx`: no guards. Sidebars show hardcoded users; headers have no logout.
- `app/profile/page.tsx`: uses `useBooking` only; hardcoded "Welcome Back!"; states auth is "for later".
- Legacy keys confined to the 3 files above.

## Design

### Guard mechanism = client-side (forced by architecture)
Auth state lives in `localStorage`, loaded async via `isLoaded`. Middleware/server guards can't see it, so guards are client components.

Create `frontend/components/auth/RouteGuard.tsx` (`"use client"`):
- Props: `{ role?: UserRole | UserRole[]; children: ReactNode }`.
- `const { user, isLoaded } = useAuth(); const pathname = usePathname();`
- If `!isLoaded` → render a full-page spinner (prevents redirect flash / hydration mismatch).
- If `!user` → in `useEffect`, `router.replace('/login?next=' + encodeURIComponent(pathname))`; render spinner meanwhile.
- If `role` set and `user.role` not allowed → in `useEffect`, `router.replace(dashboardFor(user.role))`; render spinner.
- Else render `children`.
- Do all redirects inside `useEffect` (never during render).
- Helper `dashboardFor(role)`: admin→`/admin`, driver→`/driver`, customer→`/dashboard` (colocate in the guard or a small `lib`/`hooks` util; reuse in login/register bounce logic).

### AuthContext changes (`context/AuthContext.tsx`)
- `register(userData)` (keep `Omit<User,"id"|"createdAt"|"isActive">`, `role` provided by caller):
  - `const isActive = userData.role !== "driver";`
  - Build `newUser` with that `isActive`; keep duplicate-email guard.
  - `setUsers(prev => [...prev, newUser]);`
  - If `isActive` → auto-login: `setUser(newUser)` + `localStorage.setItem("trucklagbe_current_user", JSON.stringify(newUser))`.
  - Return `{ success, user: newUser, message }`.
- Driver approval: **reuse existing `updateUser({ ...driverUser, isActive: true })`** (persists users; no new API needed). Optional thin `approveUser(id)` convenience only if desired.

### Post-login redirect / bounce rules
- `/login` success: read `next` via `useSearchParams()`; if present go there, else `dashboardFor(user.role)`. Show `result.message` on failure (includes the inactive-driver message).
- `/login` and `/register*`: if `isLoaded && user`, `router.replace(next ?? dashboardFor(user.role))` in `useEffect`.

### Route-protection matrix
| Route | Access |
|---|---|
| `/`, `/trucks`, `/tracking`, `/tracking/[id]` | Public |
| `/login`, `/register`, `/register/customer`, `/driver/register` | Public (bounce if already authed) |
| `/booking`, `/dashboard`, `/bookings`, `/bookings/[id]`, `/profile`, `/payment/[id]` | Customer (login required) |
| `/admin/*` | Admin only |
| `/driver/*` except `/driver/register` | Driver only (active) |

## Ordered Task List

### 1. Auth engine + seed
- [ ] `context/AuthContext.tsx`: make `register` role-aware (`isActive = role !== "driver"`) and auto-login active users; return created user.
- [ ] `data/users.ts`: add an approved demo driver `User` (e.g. `driver@trucklagbe.com` / `driver123`, `role:"driver"`, `isActive:true`). Use a unique id (e.g. `"user-driver-001"`) to avoid confusion with `data/drivers.ts` records.

### 2. Guard
- [ ] Create `components/auth/RouteGuard.tsx` + `dashboardFor(role)` helper (spinner while `!isLoaded`; redirect logic in `useEffect`).

### 3. Login
- [ ] Rewrite `app/login/page.tsx` to call `useAuth().login(email, password)`; use the password field; redirect via `next` or `dashboardFor(role)`; show `message` on failure; remove all legacy-store logic; bounce if already authed; gate on `isLoaded`.
- [ ] "Forgot password?" affordance: not feasible in a localStorage demo — **remove/disable** the button (mark "coming soon"). Do not create a route (we're deleting `/auth/*`).

### 4. Register
- [ ] `app/register/customer/page.tsx`: call `useAuth().register({ name, email, phone, password, role:"customer" })`; on success (auto-logged-in) `router.replace('/dashboard')`; show duplicate-email `message`; remove `trucklagbe-customer` write.
- [ ] `app/driver/register/page.tsx`: call `useAuth().register({ ..., role:"driver" })` → inactive user; keep the "Application submitted / pending approval" success screen; do **not** log in; remove `trucklagbe-driver-applications` write. (Optional in-scope: also create a linked `Driver` record via `DriverContext` for the management UI; minimum requirement is the driver `User`.)
- [ ] Keep `/register` chooser and both register URLs as-is (no route moves) — least churn; `Success` import stays valid.

### 5. Remove broken stubs
- [ ] Delete `app/auth/login/page.tsx`, `app/auth/register/page.tsx`, `app/auth/forgot-password/page.tsx` (and now-empty `app/auth/` dirs). Confirm nothing links to `/auth/*` (grep clean today).

### 6. Apply guards
- [ ] `app/admin/layout.tsx`: wrap chrome + children in `<RouteGuard role="admin">`.
- [ ] `app/driver/layout.tsx`: `usePathname()`; if `=== '/driver/register'` render `<>{children}</>` (public, no portal chrome, no guard); else wrap in `<RouteGuard role="driver">`.
- [ ] Wrap each customer page's content in `<RouteGuard role="customer">`: `app/dashboard/page.tsx`, `app/booking/page.tsx`, `app/bookings/page.tsx`, `app/bookings/[id]/page.tsx`, `app/profile/page.tsx`, `app/payment/[id]/page.tsx`.

### 7. Logout + real user display
- [ ] `components/Navbar.tsx` (public/customer): consume `useAuth()`. Logged-out → Login/Sign up (as today). Logged-in → user name/role, link to `dashboardFor(role)`, and a **Logout** button (`logout()` then `router.push('/')`). Update desktop buttons and the mobile "Account" section; gate on `isLoaded` to avoid flicker.
- [ ] `components/admin/AdminHeader.tsx`: show `user.name` + **Logout** (→ `/login`).
- [ ] `components/driver/DriverHeader.tsx`: show `user.name` + **Logout** (→ `/login`).
- [ ] `components/admin/AdminSidebar.tsx` / `components/driver/DriverSidebar.tsx`: replace hardcoded footer identity ("Admin Rahman" / "Hasan Mahmud") with real `user` from `useAuth()`.
- [ ] `app/profile/page.tsx`: show real `user` (name/email/phone/role) in the profile card + "Account Information" section; drop the "add backend later" copy.

### 8. Admin driver approval (makes register→approve→login work end-to-end)
- [ ] `app/admin/drivers/page.tsx`: add a "Pending Driver Approvals" section sourced from `getUsersByRole("driver").filter(u => !u.isActive)`; Approve → `updateUser({ ...u, isActive:true })`. Stop reading `trucklagbe-driver-applications`. (Full rewrite of this page is out of scope — keep the change focused on approval.)

### 9. Adjacent type-bug fix (in files we already touch)
- [ ] `app/driver/page.tsx`: `useAuth()` returns `user`, not `currentUser` — fix the destructure (`const { user, isLoaded: authLoaded } = useAuth();`) and all `currentUser` usages. This is a real `TS2339` in the driver portal we are guarding.

## Risks & Pre-existing Issues (call out; do not silently absorb)
- **Repo is not currently `tsc`-clean.** Independent of this work: `app/driver/page.tsx` `currentUser`, and `Booking`-drift in `app/dashboard/page.tsx` + `app/bookings/page.tsx` + `app/bookings/[id]/page.tsx` (`price`/`date`/`vehicleName`/`destination`, statuses `Accepted`/`Completed`/lowercase not in the `BookingStatus` union). Phase 4 must not add new errors; a fully green `tsc`/`build` also needs the separate bookings bug-fix task. Establish the tsc baseline before/after.
- **Overlap with bug-fix task:** `bookings/page.tsx` and `bookings/[id]/page.tsx` have known broken imports (`../components/...`, `../context/...`) + `Booking`-drift. Wrapping them in `RouteGuard` (via `@/components/auth/RouteGuard`) is additive; coordinate so both tasks land coherently.
- **Next 16 `useSearchParams()` gotcha:** reading `next` in `/login` may require a `<Suspense>` boundary at build time. Wrap the searchParams-dependent part in `<Suspense>` (or read `window.location.search` in `useEffect`). Consult `frontend/node_modules/next/dist/docs/`.
- **Stray `dist/` artifacts** exist (`context/dist/AuthContext.js`, `app/admin/users/dist/page.js`). Not Phase 4 scope; consider gitignoring/removing separately.
- **Passwords are plaintext in localStorage** — demo only; never ship.

## Validation
Automated (from `frontend/`):
- [ ] `npx tsc --noEmit` — no *new* errors vs. baseline.
- [ ] `npm run lint`.
- [ ] `npm run build` — must pass (empty `/auth` pages gone).
- [ ] Grep: no remaining refs to `trucklagbe-customer`, `trucklagbe-driver-applications`, or `/auth/`.

Manual (reset first: clear `trucklagbe_*` keys in DevTools → Application → Local Storage):
- [ ] Admin login (`admin@trucklagbe.com/admin123`) → lands `/admin`; `/admin/*` reachable; `/driver` blocked; header Logout → `/`.
- [ ] Seeded driver login → lands `/driver`; `/admin` blocked.
- [ ] Customer register → auto-logged-in → `/dashboard`; `/booking`, `/bookings`, `/profile` reachable.
- [ ] Driver register → "pending approval"; login blocked with inactive message; admin approves in `/admin/drivers`; driver can now log in.
- [ ] Guest: `/`, `/trucks`, `/tracking` open; `/booking` and `/dashboard` → `/login?next=...`; after login returns to intended page.
- [ ] Authed user visiting `/login` or `/register` → bounced to their dashboard.
- [ ] Duplicate-email register → shows error, no dup created.

## Follow-ups (not in Phase 4)
- Add `userId` to `Booking`, stamp at creation, filter customer views by owner (true per-user dashboards/bookings).
- Unify `DriverContext`/`data/drivers.ts` with driver `User` records; richer driver profile from the application form.
- Normalize `BookingStatus` + fix `Booking`-drift pages (`dashboard`, `bookings/*`).
- Move shared `Success` out of `app/register/page.tsx` into `components/`.

## Minor Open Items (defaulted; change if desired)
- Driver registration stays at `/driver/register` (guarded-layout exception) rather than moving to `/register/driver` — chosen for least churn (3 existing links).
- Forgot-password removed/disabled rather than stubbed.
