# Freight Cost Control

Static React/Vite dashboard for international freight cost analysis. Built for GitHub Pages only: no backend, no SSR, no API routes, no database.

## UI Concept

1. Operations cockpit, not admin template: KPI strip, route lattice background, dense but calm work surface.
2. Inline editing is main UX: click table cell, edit, press Enter or blur, localStorage saves instantly.
3. Every edit recalculates KPI, ЖД vs море comparison, leaderboard, charts, and route badges.
4. Data model supports direct rail, intra-Russia rail, sea lines, and editable additional expenses.
5. Demo data is seeded from priced workbook rows: sea container rows 30-72 and direct rail rows 87-98.
6. Currency toggle works fully on frontend with fixed local coefficients.
7. Empty/no-results states keep the dashboard usable when filters remove all rows.
8. Export buttons download current data as CSV or JSON without server logic.

## Project Structure

```text
src/
  components/
    Charts.tsx
    EditableCell.tsx
    FilterBar.tsx
    KpiStrip.tsx
    RouteTable.tsx
    Toolbar.tsx
  data/
    demoRoutes.ts
  features/
    dashboard/
      Dashboard.tsx
  hooks/
    usePersistentRoutes.ts
  styles/
    index.css
  types/
    logistics.ts
  utils/
    analytics.ts
    export.ts
    filters.ts
    format.ts
```

## Data Model

Each route row uses:

```ts
type RouteRecord = {
  id: string;
  origin_country: string;
  origin_city: string;
  origin_port_or_station: string;
  destination_country: string;
  destination_city: string;
  destination_port_or_station: string;
  transport_type: "rail_direct" | "rail_domestic" | "sea";
  shipping_line: string;
  route_name: string;
  cost: number;
  currency: "RUB" | "USD" | "CNY" | "EUR";
  transit_days: number;
  updated_at: string;
  comment: string;
  additional_expenses: string;
};
```

## Local Run

```bash
npm ci
npm run dev
```

Open the Vite URL printed in the terminal.

## Verify

```bash
npm run lint
npm run typecheck
npm run build
```

## GitHub Pages Deploy

1. Push to `main`.
2. In GitHub repo settings, set Pages source to GitHub Actions.
3. Workflow `.github/workflows/deploy-pages.yml` builds the static Vite app and uploads `dist`.

The app uses `vite.config.ts` `base` derived from `GITHUB_REPOSITORY` inside Actions, so asset paths work under `https://<user>.github.io/<repo>/`.

## Storage

Data is saved to:

```text
localStorage["freight-dashboard-routes"]
```

The storage key is intentionally stable across releases so client-entered rows and edits survive GitHub Pages deploys. Schema changes are tracked separately in `localStorage["freight-dashboard-routes-schema-version"]`; old keys such as `freight-dashboard-routes-v4` are read as legacy data and migrated into the stable key.

Before `Demo` or `Clear` replaces data, the current rows are copied to `localStorage["freight-dashboard-routes-last-backup"]`.

Use `Demo` to reset seeded rows or `Clear` to empty all local data.
