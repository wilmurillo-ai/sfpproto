# SFP Prototype (`sfpproto`)

An interactive, high-fidelity prototyping repository for the **Shop Floor Planning (SFP)** Line Dashboard and operator workflows. Built with Next.js (App Router), React, TypeScript, and Peacock Design System 3.0 tokens.

---

## 🎯 Purpose & Scope

> [!NOTE]
> **This repository is primarily an internal design prototyping and iteration tool.**
> It is **not** necessarily a production frontend handoff framework or enterprise production codebase. Instead, it serves as a live, interactive sandbox for the SFP Design Team to:
> - Rapidly test interaction models, responsive layouts, and edge cases in real browser environments.
> - Stress-test component variations (e.g., equipment states, candybar timeframes, KPI card variations).
> - Provide functional, clickable references for user research, stakeholder alignment, and engineering feasibility reviews.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Local Run
```bash
# Clone the repository
git clone <repo-url>
cd SFPproto

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or [http://localhost:3000/dashboard](http://localhost:3000/dashboard)) in your browser to interact with the prototype.

---

## 🤖 Working with AI Agents (Claude Code, Antigravity, Codex, Cursor, etc.)

This repository is intentionally structured to be **AI-agent friendly**, allowing internal SFP designers to build, iterate, and refine UI flows using modern coding assistants (regardless of the specific agent tool you use).

### Recommended Workflow
1. **Branch First**: Always create a feature branch before having an agent make changes (see [Git Workflow](#-git-branching-guidelines) below).
2. **Point to Figma Node URLs**: Provide your agent with exact Figma Dev Mode links or node IDs (e.g. `https://figma.com/design/.../?node-id=XXXX-YYYY&m=dev`).
3. **Reference Existing Components**: Instruct your agent to reuse existing building blocks rather than writing isolated code from scratch:
   - `Sidebar-Equipment` (`components/shared/SidebarEquipment.tsx`)
   - `Candybar` (`components/shared/Candybar.tsx`)
   - `KPICard` (`components/shared/KPICard.tsx`)
   - `ProductionExecution` (`components/shared/ProductionExecution.tsx`)
   - `DateRange` (`components/shared/DateRange.tsx`)
4. **Specify Responsive Breakpoints**: If designing for multiple screen sizes, explicitly note target resolutions. The core app breakpoint is:
   - **Tablet**: `< 1180px` (e.g., collapsed equipment pill, 2×2 KPI grid, slide-over drawer)
   - **Desktop**: `≥ 1180px` (expanded left sidebar, 4-column KPI row)
5. **Enforce Design Tokens**: Remind the agent to reference [`DESIGN.md`](./DESIGN.md) and [`app/globals.css`](./app/globals.css) so that colors, spacing, and typography conform to Peacock Design System 3.0 tokens (`var(--color-...)`, `var(--typography-...)`).
6. **Validate Locally**: Keep `npm run dev` running and visually test interactions, drawer slide-overs, and popovers before finalizing changes.

---

## 🌿 Git Branching Guidelines

To maintain stability on `main` and allow multiple designers to experiment simultaneously:

1. **Create a separate branch for each feature or screen:**
   ```bash
   git checkout -b feature/date-range-filter
   # or
   git checkout -b experiment/equipment-drawer-layout
   ```
2. **Commit incrementally**: Commit related changes with clear messages (e.g., `feat: add DateRange custom picker`).
3. **Review before merging**: Test both Desktop (`≥ 1180px`) and Tablet (`< 1180px`) states in your browser.
4. **Merge or submit PR to `main`**: Once aligned and validated, merge the branch into `main`.

---

## 📁 Repository Structure

```text
SFPproto/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Line Dashboard (main operator view)
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── globals.css             # Peacock DS 3.0 tokens, component & utility styles
│   └── layout.tsx              # Application shell (AppHeader + main wrapper)
├── components/
│   ├── ui/                     # Primitives (Button, Icon, Card, Badge, etc.)
│   ├── shared/                 # SFP Composite Components
│   │   ├── Candybar.tsx        # Line performance & status timeline
│   │   ├── KPICard.tsx         # Simple & Compound KPI metric cards
│   │   ├── SidebarEquipment.tsx# Equipment hierarchy (collapsed pill & expanded panel)
│   │   ├── ProductionExecution.tsx # Processing & Packaging orders view
│   │   ├── DateRange.tsx       # Date & time range picker with presets
│   │   └── index.ts
│   ├── AppHeader.tsx           # Global navigation bar (Dept/Line selector, create menu)
│   └── Sidebar.tsx             # Operator view navigation sidebar
├── lib/
│   ├── breakpoints.ts          # Global breakpoint constants & useBreakpoint hook
│   └── dummyData.ts            # Mock data for shifts, downtime events, and metrics
├── DESIGN.md                   # Peacock DS tokens & visual design reference
└── package.json
```

---

## 💡 Tips for Prototyping

- **Mock Data**: Update or expand datasets in [`lib/dummyData.ts`](./lib/dummyData.ts) when creating new views.
- **Component Exploration**: You can preview and import components directly via `@/components` or `@/components/shared`.
- **Responsive Testing**: Use browser developer tools (or responsive device mode) to verify transitions across the `1180px` boundary.
