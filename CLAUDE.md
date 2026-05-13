# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run serve        # Dev server on port 8080
npm run build        # Production build + zip
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Prettier format
npm run test:unit    # Unit tests (Vitest)
npm run test:ui      # E2E tests (Cypress, opens UI)
npm run test         # E2E tests (headless, requires preview server)
```

## Architecture

**Stack:** Vue 2.7 + TypeScript, Vuetify 2, Vuex 3, Vite. This is a web UI for Klipper 3D printer firmware, communicating with a Moonraker API server over WebSocket.

### Component Patterns

All components use **Vue Class Components** with decorators — never Options API or `<script setup>`:

```typescript
@Component({ components: { ... } })
export default class MyComponent extends Mixins(BaseMixin) {
    @Prop({ required: true }) declare readonly value: string
    // class members: Props → data fields → getters → @Watch → lifecycle → methods
}
```

Use `@/` alias for all imports (e.g. `import X from '@/store/types'`).

### Custom Styling System

This fork adds a global design token system defined in `src/components/ui/Panel.vue` (`<style>` non-scoped block):

- **CSS variables** — `--master-bg`, `--master-radius`, `--master-inner-bg`, `--master-inner-border`, etc.
- **`.dark-wrapper`** — the reusable styled container class (rounded, semi-transparent dark background, subtle border). Use this instead of custom card/container styles.
- **Outer panel transparency** — `blocks-main-panel` and `blocks-axis-panel` are intentionally transparent; the high-specificity rule `.v-application .v-card.v-sheet.panel.blocks-{name}` overrides Vuetify defaults.
- **Panel toolbar** — always transparent via `.panel-toolbar { background-color: transparent }` in scoped styles.

### Custom Pages & Panels

The `feat/dynamic_layout` branch adds custom dashboard panels under `src/components/panels/OurPanels/`:
- `ourPrinting.vue` — Printing Dashboard (`blocks-main-panel`)
- `axispanel.vue` — Machine Control (`blocks-axis-panel`)
- `ourDashboard.vue` — used inside the printing panel

`src/pages/Dashboard.vue` has a `redesignMode = true` flag that renders these custom panels in a scrollable vertical layout with a dot-nav (`dotNavPanels`, `setupObserver`, `scrollToPanel`).

### Store

Vuex modules under `src/store/`: `socket/`, `printer/`, `server/` (with submodules for history, jobQueue, power, spoolman, etc.), `gui/` (UI state), `files/`, `farm/`, `editor/`, `gcodeviewer/`.

### i18n

All user-facing strings go through `$t()`. Add new keys to `src/locales/en.json` in alphabetical order (enforced by ESLint).

### Icons

Import from `@mdi/js`, assign to a class property, reference in template. No `mdi-` string literals in templates.
