# SFP Proto — Peacock Design System & Agent Guidelines

> **Source**: [Peacock Design System 3.0 — PepsiCo](https://library.pepsico.com/?path=/story/guidelines-peacock-agent--peacock-agent)  
> **Figma Foundations**: [UXD_PeacockDS3.0_Foundations](https://www.figma.com/design/zD3VqGCGyktxoizq6c6sCi/UXD_PeacockDS3.0_Foundations?m=auto&node-id=18-118)  
> **Figma Dev Hand-Off**: [SFP-Dev-Hand-Off](https://www.figma.com/design/FfaSxIj8AhIpRekfHi7Aq7/SFP-Dev-Hand-Off?node-id=12585-32385&m=dev)  
> **Last Synchronized**: 2026-09-11

---

## 1. Peacock Design Agent Instructions

Peacock Agent is a single-agent workflow that brings **Peacock Design System context directly into your AI-assisted development workflow**, ensuring consistent, production-ready output from the start.

### Workflow Philosophy

Peacock Agent injects **Peacock Design System context** automatically into every prompt and implements the requested UI directly without unnecessary handoffs or over-complicated subagents:

```
User Prompt ──▶ Peacock Agent (gathers minimal context, chooses components/tokens) ──▶ Direct Implementation ──▶ Summary & Verification
```

### Core Principles
1. **Direct Implementation**: One agent handles research, token selection, implementation, and summary — faster execution and fewer round-trips.
2. **Consistent Design-System Compliant Output**: All UI components use verified semantic tokens and design system conventions rather than arbitrary ad-hoc styles.
3. **No Hardcoded Hex Values**: All styling must use CSS custom properties (`var(--color-...)`).
4. **Dual Appearance Modes**: Support both **Light Peacock** and **Dark Peacock** themes natively.

### Supported Operating Modes

- **Figma-Backed Mode**:
  - **Input**: Figma URL or Node ID (`https://www.figma.com/design/...`).
  - **Behavior**: Uses the Figma Dev Mode MCP tools (`get_design_context`, `get_variable_defs`) to inspect layout, dimensions, components, and token bindings from the design.
  - **Output**: Direct implementation in Next.js matching the Figma design using Peacock tokens.

- **Library-Only Mode**:
  - **Input**: Feature prompt and description only.
  - **Behavior**: Uses built-in Peacock Design System tokens and layout rules without needing a Figma file.
  - **Output**: Clean, consistent Peacock UI components.

---

## 2. Design Token Architecture

Peacock DS uses a **Two-Tier Token System**:
1. **Primitive Tokens**: Foundational color scales and raw dimensional values (`Primitives/Gray/900`, `Primitives/Primary/600`, etc.).
2. **Semantic Tokens**: Contextual, role-based aliases that change based on theme and intent (`Semantic/Background/Layer-01`, `Semantic/Text/Primary`, etc.).

Components **must consume Semantic Tokens** rather than referencing primitives directly.

---

## 3. Semantic Color Tokens (Light vs. Dark Peacock)

Theme switching is handled via CSS variables mapped to the active appearance mode (`[data-theme="light"]` or `[data-theme="dark"]`).

### 3.1 Background Tokens

| Role | CSS Variable | Light Peacock | Dark Peacock | Usage |
|---|---|---|---|---|
| **Default Canvas** | `--color-background-default` | `#f5f9ff` | `#000000` | Page background / main viewport |
| **Layer 01** | `--color-background-layer-01` | `#ffffff` | `#1f1f1f` | Primary cards, panels, content surfaces |
| **Layer 02** | `--color-background-layer-02` | `#f5f9ff` | `#262626` | Card headers, table rows, nested panels |
| **Layer 03** | `--color-background-layer-03` | `#c6dcfb` | `#1f1f1f` | Accent surfaces, active card indicators |
| **Inverse** | `--color-background-inverse` | `#262626` | `#f5f9ff` | Inverted surfaces, high contrast banners |
| **Header** | `--color-background-header` | `#363636` | `#363636` | App navigation header |
| **Utility Low** | `--color-background-utility-low-contrast` | `#dadada` | `#2d2d2d` | Scrollbars, track backgrounds |
| **Utility High** | `--color-background-utility-high-contrast` | `#4b4b4b` | `#4b4b4b` | High contrast utilities, tooltips |

### 3.2 Text Tokens

| Role | CSS Variable | Light Peacock | Dark Peacock | Usage |
|---|---|---|---|---|
| **Text Primary** | `--color-text-primary` | `#2d2d2d` | `#efefef` | Headings, primary body text, titles |
| **Text Secondary** | `--color-text-secondary` | `#4b4b4b` | `#dadada` | Subtitles, labels, secondary metadata |
| **Text Tertiary** | `--color-text-tertiary` | `#656565` | `#a2a2a2` | Helper text, timestamps, captions |
| **Text Inverse** | `--color-text-inverse` | `#efefef` | `#2d2d2d` | Text on inverted or dark backgrounds |
| **Text High Contrast** | `--color-text-high-contrast` | `#000000` | `#ffffff` | High contrast emphasis |
| **Text High Contrast Inv** | `--color-text-high-contrast-inverse` | `#ffffff` | `#000000` | Inverse high contrast text |

### 3.3 Border Tokens

| Role | CSS Variable | Light Peacock | Dark Peacock | Usage |
|---|---|---|---|---|
| **Border Default** | `--color-border-default` | `#d8e7fb` | `#404040` | Card borders, dividers, subtle outlines |
| **Border Divider** | `--color-border-divider` | `#dadada` | `#404040` | List separators, table gridlines |

### 3.4 Interactive Tokens

| Role | CSS Variable | Light Peacock | Dark Peacock | Usage |
|---|---|---|---|---|
| **Primary** | `--color-interaction-primary` | `#034895` | `#7db3fc` | Primary action buttons, active links |
| **Primary Hover** | `--color-interaction-primary-hover` | `#012b5e` | `#034895` | Primary action hover state |
| **Primary Pressed** | `--color-interaction-primary-pressed` | `#012451` | `#01346f` | Primary action active/pressed state |
| **On Primary** | `--color-interaction-onPrimary` | `#ffffff` | `#ffffff` | Text/icons inside primary buttons |
| **Focus** | `--color-interaction-focus` | `#0061c7` | `#3582e6` | Focus outlines and active input borders |
| **Hover** | `--color-interaction-hover` | `#d8e7fb` | `#2d2d2d` | Table row hover, list item hover |
| **Disabled** | `--color-interaction-disabled` | `#b1b1b1` | `#838383` | Disabled button/input text |
| **Disabled BG** | `--color-interaction-disabled-background` | `#dadada` | `#4b4b4b` | Disabled button/input background |
| **Form Background** | `--color-interaction-form-background` | `#ffffff` | `#262626` | Input fields, textareas, selects |
| **Form Border** | `--color-interaction-form-border` | `#c0c0c0` | `#656565` | Input default border |
| **Form Border Hover**| `--color-interaction-form-border-hover` | `#838383` | `#a2a2a2` | Input hover border |

### 3.5 Feedback & Status Tokens

| Status | CSS Variable | Light Peacock | Dark Peacock | Usage |
|---|---|---|---|---|
| **Success Default** | `--color-feedback-success-default` | `#027c06` | `#027c06` | Success badges, check icons, KPI up |
| **Success BG** | `--color-feedback-success-background` | `#dff8dc` | `#052f05` | Success message backgrounds, pill tags |
| **Success High** | `--color-feedback-success-high-contrast` | `#166a15` | `#55d050` | High-contrast success text/accent |
| **Warning Default** | `--color-feedback-warning-default` | `#d7ac01` | `#d7ac01` | Warning alerts, caution badges |
| **Warning BG** | `--color-feedback-warning-background` | `#faf2b4` | `#3d1c00` | Warning pill backgrounds, toast alerts |
| **Warning High** | `--color-feedback-warning-high-contrast` | `#7a4c0e` | `#d7ac01` | High-contrast warning text |
| **Error Default** | `--color-feedback-error-default` | `#c12c01` | `#c12c01` | Error messages, stop states, critical alerts |
| **Error BG** | `--color-feedback-error-background` | `#ffe5de` | `#4d0f03` | Error pill backgrounds, downtime alerts |
| **Error High** | `--color-feedback-error-high-contrast` | `#ab2b09` | `#fe7c5f` | High-contrast error text/accent |
| **Info Default** | `--color-feedback-info-default` | `#0662c4` | `#0662c4` | Information icons, guidance notes |
| **Info BG** | `--color-feedback-info-background` | `#e8f0fb` | `#002451` | Info callout backgrounds |
| **Info High** | `--color-feedback-info-high-contrast` | `#0755aa` | `#7db3fc` | High-contrast info text |

### 3.6 Data Visualization Tokens

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| Qualitative 01 | `--data-viz-qualitative-01` | `#004895` | Primary metric series |
| Qualitative 02 | `--data-viz-qualitative-02` | `#16749e` | Secondary metric series |
| Qualitative 03 | `--data-viz-qualitative-03` | `#027c06` | Healthy / target series |
| Qualitative 04 | `--data-viz-qualitative-04` | `#d7ac01` | Warning threshold series |
| Qualitative 05 | `--data-viz-qualitative-05` | `#c12c01` | Loss / downtime series |
| Qualitative 06 | `--data-viz-qualitative-06` | `#5c4ec9` | Auxiliary equipment series |

---

## 4. Typography Tokens

Peacock DS standardizes on the **Inter** font family across all surfaces.

### 4.1 Type Scale

| Scale | CSS Variable | Font Size | Line Height | Usage |
|---|---|---|---|---|
| **Highlight Large** | `--font-size-highlight-large` | `40px` | `40px` | Hero KPI values, rate monitors |
| **Highlight Medium**| `--font-size-highlight-medium` | `32px` | `38px` | Card KPI metrics |
| **Highlight Small** | `--font-size-highlight-small` | `28px` | `30px` | Sub-KPI indicators |
| **Heading H1** | `--font-size-heading-page-title` | `28px` | `34px` | Page titles (`/Dashboard`, `/Efficiency`) |
| **Heading H2** | `--font-size-heading-section-title` | `22px` | `28px` | Section titles, panel headers |
| **Heading H3** | `--font-size-heading-subsection-title` | `18px` | `24px` | Card headers, table headings |
| **Heading H4** | `--font-size-heading-paragraph-title` | `16px` | `22px` | Group titles, sub-card headers |
| **Paragraph Large** | `--font-size-paragraph-large` | `16px` | `24px` | Prominent body text, modals |
| **Paragraph Default**| `--font-size-paragraph-default` | `14px` | `22px` | Standard interface text, table cells |
| **Paragraph Small** | `--font-size-paragraph-small` | `12px` | `20px` | Badges, timestamps, secondary labels |

### 4.2 Font Weights

| Token | CSS Variable | Value |
|---|---|---|
| Regular | `--typography-font-weight-regular` | `400` |
| Medium | `--typography-font-weight-medium` | `500` |
| SemiBold | `--typography-font-weight-semi-bold` | `600` |
| Bold | `--typography-font-weight-bold` | `700` |

---

## 5. Spacing Tokens

Peacock uses an 8pt base grid with a 4px half-step:

| Token | CSS Variable | Value | Usage |
|---|---|---|---|
| `spacing-0` | `--spacing-0` | `0px` | Reset |
| `spacing-2` | `--spacing-2` | `2px` | Fine border offsets, sub-pixel alignments |
| `spacing-4` | `--spacing-4` | `4px` | Compact tag padding, inline icon gap |
| `spacing-8` | `--spacing-8` | `8px` | Element gap, badge padding, compact layout |
| `spacing-12` | `--spacing-12` | `12px` | Input padding, compact card padding |
| `spacing-16` | `--spacing-16` | `16px` | Standard card padding, standard gap |
| `spacing-20` | `--spacing-20` | `20px` | Section spacing |
| `spacing-24` | `--spacing-24` | `24px` | Page container padding, major section gap |
| `spacing-32` | `--spacing-32` | `32px` | Button height default, component spacing |
| `spacing-40` | `--spacing-40` | `40px` | Large button height, header margin |
| `spacing-48` | `--spacing-48` | `48px` | Major layout gutters |
| `spacing-64` | `--spacing-64` | `64px` | Page section separators |
| `spacing-80` | `--spacing-80` | `80px` | Hero container padding |

---

## 6. Corner Radius Tokens

Peacock defines contextual border-radius tokens:

| Token Category | Token Name | CSS Variable | Value | Usage |
|---|---|---|---|---|
| **Action** | Small | `--border-radius-action-small` | `2px` | Toolbars, micro buttons |
| **Action** | Medium | `--border-radius-action-medium` | `4px` | Secondary buttons |
| **Action** | Large | `--border-radius-action-large` | `8px` | Standard primary buttons |
| **Action** | Rounded | `--border-radius-action-rounded` | `9999px` | Pill buttons, filter chips |
| **Container** | Small | `--border-radius-container-small` | `2px` | Tooltips, popover sub-items |
| **Container** | Medium | `--border-radius-container-medium` | `4px` | Nested cards, dropdown menus |
| **Container** | Large | `--border-radius-container-large` | `8px` | Primary dashboard cards, panels |
| **Input** | Medium | `--border-radius-input-medium` | `4px` | Text inputs, date pickers |
| **Input** | Rounded | `--border-radius-input-rounded` | `9999px` | Search bar |

---

## 7. Elevation / Shadow Tokens

| Level | CSS Variable | Values (X Y Blur Spread Color) | Usage |
|---|---|---|---|
| **Elevation 0** | `--elevation-0` | `none` | Flat surfaces |
| **Elevation 1** | `--elevation-1` | `0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 1px 2px 0 rgba(0, 0, 0, 0.08)` | Dashboard cards, tiles |
| **Elevation 2** | `--elevation-2` | `0 4px 6px -1px rgba(0, 0, 0, 0.16), 0 2px 4px -1px rgba(0, 0, 0, 0.10)` | Popovers, dropdowns, hover cards |
| **Elevation 3** | `--elevation-3` | `0 10px 15px -3px rgba(0, 0, 0, 0.20), 0 4px 6px -2px rgba(0, 0, 0, 0.12)` | Modals, floating drawers |

---

## 8. Theme Implementation & Switching

Tokens are applied globally in [`app/globals.css`](./app/globals.css) via `:root` (Light Peacock) and `[data-theme="dark"]` (Dark Peacock).

### Theme Switching Mechanism
```html
<!-- Light Peacock Mode -->
<html data-theme="light">

<!-- Dark Peacock Mode (Default for Operator Console) -->
<html data-theme="dark">
```

### Component Best Practices
1. **Never use raw color values**: Always use `var(--color-background-layer-01)` or `var(--color-text-primary)` instead of `#fff` or `#111`.
2. **Layering structure**:
   - Window / Body: `--color-background-default`
   - Panels / Cards: `--color-background-layer-01`
   - Card Headers / Nested rows: `--color-background-layer-02`
   - Active / Highlight: `--color-background-layer-03`
3. **Card Border Radius**: Default to `var(--border-radius-container-large)` (8px).
4. **Card Padding**: Default to `var(--spacing-16)` or `var(--spacing-20)`.
5. **Interactive Controls**: Buttons use `var(--border-radius-action-rounded)` (pill) or `var(--border-radius-action-large)` (8px), with text `var(--color-interaction-onPrimary)`.

---

## 9. SFP Proto Navigation & Component Architecture

### Route Hierarchy
- `/Dashboard` — Line Dashboard (KPI cards, live line state, downtime alerts)
- `/Schedule` — Production line scheduling and changeovers
- `/Summary` — Production summary overview
- `/Downtimes` — Unplanned & planned downtime tracker
- `/Efficiency` — OEE, line efficiency analysis
- `/Attainment` — Plan vs actual attainment metrics
- `/Equipment` — Equipment status & diagnostics
- `/RateLoss` — Line speed and throughput rate loss
- `/Waste` — Scrap and material waste tracking

### Shared Component Architecture (`app/components/`)
- `AppHeader.tsx` — Global header with operator profile, theme toggle, and line switcher
- `NavTabs.tsx` — Horizontal navigation tabs for the 9 operator routes
- `KPICard.tsx` — Standard metric card with status pill, trend indicator, and sparkline
- `StatusBadge.tsx` — Semantic feedback pills (Running, Stopped, Warning, Scheduled)
- `DataTable.tsx` — Peacock DS data table styling
