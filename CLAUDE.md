# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start        # Dev server (Vite)
npm run build    # Production build → build/
npm run dev      # Preview production build
```

There is no test runner configured beyond the legacy CRA `App.test.js`; no test command is functional.

## Architecture

This is a personal portfolio site (maesela.tech) built with React 18 + Vite, deployed on Vercel.

**Routing** (`src/App.jsx`): React Router v6 handles all routes. The active routes are `/` (Home), `/shoutout`, `/about`, and `redirect/tinkr` (external redirect). Unmatched routes fall through to the `Construction` page.

**Data** (`src/data.js`): All portfolio content is defined here as typed class instances (`Experience`, `Education`, `Certification`, `Video`, `Project`). Each has a `shown` boolean flag that gates whether it renders. To add or update content, edit this file.

**Theme** (`src/contexts/ThemeContext.jsx`): `ThemeProvider` wraps the app. Theme is persisted in `localStorage` and applied via `data-theme` attribute on `<html>`. Supports `"light"`, `"dark"`, and `"system"`. Use `useTheme()` hook in components to read/set the theme.

**SVGs**: Imported as named React components via `vite-plugin-svgr`. All `.svg` files are auto-transformed.

**Styling**: Plain CSS with co-located `styles.css` per component/page. Shared styles live in `src/components/shared.css` and `src/App.css`. Theming is done via CSS custom properties scoped to `[data-theme="dark"]` / `[data-theme="light"]`.

**Custom fonts**: BL Melody (multiple weights) and Uncut Sans, loaded from `src/fonts/` as `.woff` files.