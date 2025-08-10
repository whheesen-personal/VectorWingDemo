## Platform Evaluation and Tech Stack Decision

### Executive summary

Build a web-first, modular platform using widely adopted, enterprise-proven technologies to minimize delivery risk and vendor lock-in while meeting strict security and scalability needs.

- **Frontend**: React 18 + Next.js 14 (App Router) with TypeScript, Material UI, and a commercial, well-supported scheduler/Gantt component.
- **Backend**: Node.js 20 LTS with NestJS (TypeScript), PostgreSQL 16, Prisma ORM, Redis for caching/queues, WebSockets for realtime.
- **Auth & biometrics**: Keycloak (OIDC) for SSO/RBAC; CAC/PIV via mutual TLS at the edge; mission sign-off with WebAuthn (Windows Hello/Touch ID/YubiKey) as the primary biometric mechanism.
- **Reporting & analytics**: Server-rendered PDFs (Puppeteer) for official forms; optional Metabase for ad‑hoc reporting; OpenAPI-first services.
- **Deployment**: Docker for dev; Kubernetes with Helm for prod (cloud or on‑prem); GitHub Actions CI/CD; Prometheus + Grafana; Loki logs.
- **Compliance & security**: TLS 1.3, STIG hardening, NIST 800‑53 controls coverage, pgAudit, comprehensive audit trails, RLS in PostgreSQL.

This selection prioritizes mainstream, well-supported frameworks and libraries to avoid getting stuck, while offering a clear path from MVP to accredited, scalable production.

---

### Key constraints from requirements

- Mission‑critical reliability, strict RBAC, complete auditability, CAC/PIV support, biometric authorization for mission sign‑off.
- Rich scheduling UI (drag‑and‑drop, resource timelines), realtime updates, offline data capture for training records, large-scale reporting.
- Modular architecture; ability to deploy on secure networks (on‑prem) or cloud; multi‑unit/tenant data segregation.

### Evaluation criteria

- **Maturity & ecosystem**: Large contributor base, long-term support, rich documentation.
- **Security & compliance**: Proven fit for CAC/PIV, WebAuthn, Fed/DoD environments.
- **Productivity**: Strong type-safety, tooling, testing, and dev ergonomics.
- **Scalability & ops**: Horizontal scale support; first-class container/K8s support.
- **Licensing**: Favor OSS for core; permit reputable commercial UI components to derisk complex UX (scheduler/Gantt).

---

## Frontend

- **Framework**: React 18 + Next.js 14 App Router (TypeScript)
  - Rationale: Most widely adopted React meta-framework; SSR/SSG/ISR, routing, image optimization, edge support; excellent docs and community.
  - Offline/PWA: Next-PWA plugin; IndexedDB via Dexie for offline grading forms and queued sync.
- **UI kit**: Material UI (MUI 6)
  - Rationale: Mature, accessible, themable, excellent docs; avoids lock‑in; pairs well with TanStack libs.
- **Data grid**: MUI Data Grid (start with Community; upgrade to Pro/X as needed)
- **Drag & drop**: dnd-kit (actively maintained) for strip operations.
- **Scheduler/Gantt (critical choice)**:
  - Final recommendation: **Syncfusion React** Scheduler + Gantt (commercial) for enterprise-grade timelines, resource views, printing/export, and first-class support.
  - Alternatives: FullCalendar + Scheduler (commercial); Bryntum Scheduler (commercial); react-calendar-timeline (OSS, less active).
  - Rationale: Complex scheduling is high risk; commercial component substantially reduces build time and risk with strong vendor support.
- **Forms**: React Hook Form + Zod resolvers for robust validation UX.
- **State & data**: TanStack Query for server state; Redux Toolkit for UI/app state where needed.
- **Charts**: ECharts or Recharts (OSS) for dashboards.

## Backend

- **Runtime & framework**: Node.js 20 LTS + NestJS (TypeScript)
  - Rationale: Opinionated structure (modules, DI, testing), OpenAPI generation, guards/interceptors for RBAC, WebSockets gateway, mature ecosystem.
- **API style**: REST/JSON with OpenAPI 3.1 as the canonical contract; server events/WebSockets for realtime; webhooks for integration.
- **Database**: PostgreSQL 16
  - Features: Partitioning for scale, row-level security (RLS) for tenant/unit isolation, pgAudit for immutable audit, pgcrypto for field-level encryption.
  - ORM: Prisma for developer productivity and safe migrations; supported widely in TS ecosystems.
- **Caching & queues**: Redis 7; BullMQ for job orchestration (notifications, report generation, audit fan‑out).
- **Realtime**: NestJS WebSockets; Redis pub/sub for scale‑out.
- **File/PDF generation**: Headless Chrome via Puppeteer for official forms and FA documents.

## Authentication, authorization, and biometrics

- **SSO & RBAC**: Keycloak (self‑hosted) as IAM/IdP using OpenID Connect.
  - Maps roles (Student/Instructor/Scheduler/SOF/Commander/Admin) to tokens; supports fine‑grained permissions via NestJS guards/policies.
- **CAC/PIV**: mTLS at the reverse proxy (NGINX Ingress/Envoy) with certificate to user mapping; federate to Keycloak for session issuance.
- **Biometric mission sign‑off**: WebAuthn (FIDO2) platform authenticators (Windows Hello, Touch ID) and/or security keys (e.g., YubiKey).
  - Rationale: Broadest browser/device support, standards-based, no custom drivers in browser.
  - Audit: Sign a challenge bound to mission ID; store signature attestations with timestamp and actor.
  - Hardware scanners: If external USB fingerprint readers are mandated, plan a companion desktop bridge (native service) as a later phase; not required for MVP due to complexity and driver variance.

## Notifications and messaging

- **In‑app realtime**: WebSockets with Redis pub/sub; presence and acknowledgment tracking.
- **Email**: SMTP (on‑prem MTA or SES); retry with backoff via BullMQ.
- **Push**: Web Push (VAPID) for PWA; optional SMS (Twilio) for urgent ops alerts (policy‑controlled).

## Reporting and analytics

- **Operational reports**: Server-rendered PDFs (Puppeteer) for daily flight schedules, Flight Authorization, progress reports, compliance checklists.
- **Ad‑hoc analytics**: Metabase (OSS) connected to read replicas; row‑level filters enforced; exports in CSV/Excel with audit logging.
- **Dashboards**: In‑app charts powered by API queries; heavy analytics can be offloaded to a separate read replica or warehouse later.

## Deployment, DevOps, and observability

- **Environments**: Docker Compose for dev; Kubernetes (Helm charts) for staging/prod (cloud or on‑prem OpenShift/RKE/K3s).
- **CI/CD**: GitHub Actions with codegen (OpenAPI), linting, tests, SCA, container scans (Trivy), signed images (cosign), progressive delivery.
- **Ingress & TLS**: NGINX Ingress; cert-manager; TLS 1.3 everywhere; mTLS for internal services handling sensitive ops.
- **Secrets & config**: Externalized via sealed secrets or HashiCorp Vault.
- **Monitoring**: Prometheus + Grafana, Alertmanager; logs via Loki; tracing via OpenTelemetry.

## Security and compliance posture

- **Standards**: OWASP ASVS, NIST 800‑53 controls coverage, DoD STIG baselines for OS, containers, and DB.
- **Data protection**: Encryption in transit (TLS 1.3) and at rest; field‑level encryption for PII/medical; RLS for unit/tenant isolation.
- **Audit**: pgAudit for DB; application audit tables with append-only semantics; immutable log shipping and alerting on tamper signals.
- **Access**: Least privilege by default; periodic access reviews; Just‑in‑Time elevation for admin tasks.

## Risks and mitigations

- **Scheduler/Gantt complexity**: High. Mitigate with a commercial, supported component (Syncfusion or FullCalendar Scheduler). Budget license vs months of build/debug.
- **Biometric hardware diversity**: Avoid browser‑driver coupling by standardizing on WebAuthn; add desktop bridge only if mandated.
- **On‑prem constraints**: Package with K8s‑ready deploys; avoid cloud‑specific services; document offline/DR modes.
- **Data volume growth**: Partition Postgres tables; read replicas for reporting; archival policies.

## Final selection (go‑forward plan)

- Frontend: React + Next.js (TS), MUI, dnd-kit, TanStack Query/Redux; **Syncfusion React Scheduler/Gantt**.
- Backend: NestJS (TS), REST/OpenAPI, WebSockets; PostgreSQL + Prisma; Redis + BullMQ.
- Auth: Keycloak (OIDC), CAC/PIV via mTLS at edge; **WebAuthn** for mission sign‑off.
- Reporting: Puppeteer PDFs; Metabase for ad‑hoc.
- DevOps: Docker → Kubernetes (Helm), GitHub Actions, Prometheus/Grafana/Loki, Vault/sealed secrets.

This stack is mainstream, well-documented, and field-proven, minimizing risk of dead ends.

## Prototype/MVP scope

- Primary demo: Scheduling timeline with resource views (aircraft/sims/instructors), drag‑and‑drop reassignments, conflict checks, realtime updates, and visible authorization status per mission.
- Critical workflow: Mission Authorization using WebAuthn sign‑off recorded with immutable audit entry; visible in schedule and in daily Flight Authorization PDF.
- Secondary demo: Crew currency dashboard integrated in scheduling rules; basic training record form (online/offline) for a sortie with sync.

## Library list and versions (initial)

- React 18, Next.js 14, TypeScript 5, MUI 6, dnd‑kit, TanStack Query 5, React Hook Form + Zod.
- Syncfusion React Scheduler/Gantt (current LTS release).
- NestJS 10, Prisma 5, PostgreSQL 16, Redis 7, BullMQ, OpenAPI 3.1, WebAuthn server library (simplewebauthn).
- Puppeteer, Metabase (OSS), Prometheus/Grafana/Loki, OpenTelemetry.

## Next steps

1. Procure Syncfusion (or FullCalendar Scheduler) license; validate legal/compliance.
2. Stand up bootstrap repo with monorepo or multi‑repo; scaffold Next.js and NestJS; wire Keycloak and WebAuthn POC.
3. Define initial Postgres schema (scheduling, crew, authorization, audit) with Prisma; enable pgAudit and RLS.
4. Build the Scheduling MVP view and Authorization flow; generate Flight Authorization PDF.
5. Prepare deployment manifests (Helm), CI/CD, and baseline monitoring.


