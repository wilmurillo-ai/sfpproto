# Components Architecture

This folder contains all shared UI components for the SFP prototype.
Components are organized by category and designed to be reused across all pages.

## Folder Structure

```
components/
├── ui/           # Primitive UI atoms (Button, Badge, Input, Select, etc.)
├── layout/       # Structural layout components (Header, Sidebar, PageShell, etc.)
├── charts/       # Data visualization components (Gauge, LineChart, BarChart, DonutChart, etc.)
└── shared/       # Composite/domain components (KpiTile, ScheduleBar, StatusDot, etc.)
```

## Guidelines

- **One component per file**, named with PascalCase (e.g. `KpiTile.tsx`)
- All components must be typed with TypeScript interfaces
- Use CSS variables from `globals.css` — never hardcode colors
- Client-only components (`useState`, `useEffect`, event handlers) must include `'use client'` directive
- Server components by default — keep them pure where possible
- Export a single default export per file

## Categories

### `ui/` — Primitive atoms
Low-level building blocks with no business logic:
- `Button.tsx` — primary, secondary, ghost, icon variants
- `Badge.tsx` — status pills (green, red, yellow, blue, gray)
- `Input.tsx` — text input
- `Select.tsx` — dropdown select
- `Tooltip.tsx` — hover tooltip
- `Divider.tsx` — horizontal rule

### `layout/` — Structural layout
Components that define the app shell and page structure:
- `AppHeader.tsx` (currently at `/components/AppHeader.tsx` — to be migrated)
- `Sidebar.tsx` (currently at `/components/Sidebar.tsx` — to be migrated)
- `PageShell.tsx` — wraps each page (header + scrollable content area)
- `PageHeader.tsx` — page title + subtitle block
- `Section.tsx` — labeled section with card wrapper

### `charts/` — Data visualization
SVG and canvas-based chart components:
- `Gauge.tsx` — circular gauge / donut gauge (used on Dashboard)
- `LineChart.tsx` — SVG line/area chart (used on Efficiency)
- `BarChart.tsx` — grouped bar chart (used on Attainment)
- `DonutChart.tsx` — donut/pie chart (used on Rate Loss, Waste)
- `ProgressBar.tsx` — horizontal progress bar with label

### `shared/` — Composite domain components
Higher-level components that combine primitives with SFP-specific logic:
- `KpiTile.tsx` — KPI stat card (label, value, unit, delta badge)
- `ScheduleBar.tsx` — production timeline bar
- `StatusDot.tsx` — colored status indicator dot
- `DataTable.tsx` — styled table with header/body/sort support
- `SectionCard.tsx` — titled card panel with header slot
- `CategoryBar.tsx` — labeled horizontal bar (for breakdowns)
