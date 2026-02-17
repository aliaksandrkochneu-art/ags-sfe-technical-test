# Submission Notes

## Key Decisions

**MSW**: Created `ProductsApiContext` provider to manage MSW worker lifecycle. The provider starts the worker on mount and exposes a `loaded` state, ensuring components only fetch data once the mock API is ready. Service worker file shared via copy between host and remote to avoid duplication.

**Design System**: Chose `@base-ui/react` for headless, accessible components (Button, Input, Select) with full styling control via SCSS modules. This provides flexibility while maintaining accessibility out of the box.

**Performance**: Implemented virtual scrolling with `@tanstack/react-virtual` to handle 2000+ products efficiently. Used `useMemo` for filtered products and categories to prevent unnecessary recalculations. Responsive grid calculates columns dynamically using ResizeObserver.

**State Management**: Separated concerns into focused hooks - `useProducts` handles data fetching, filtering, sorting, and search logic, while `useVirtualizedGrid` manages grid layout and virtualization. All state is local with React hooks.

**Testing**: Used Vitest with React Testing Library to test component rendering, user interactions, and hook behavior. MSW worker is mocked in tests to avoid service worker complexity.

**Accessibility**: Semantic HTML with proper ARIA labels, keyboard navigation via Base UI components, and `aria-live` regions for dynamic content updates.

## Architecture

```
apps/remote-products/src/
  components/
    ProductCard/          - Reusable card component with SCSS modules
    ProductList/          - Main list component with filters & virtualized grid
    ProductsApiContext/   - Context provider managing MSW worker lifecycle
  hooks/
    useProducts.ts        - Data fetching, filtering, sorting, search
    useVirtualizedGrid.ts - Grid layout & virtualization with ResizeObserver
  assets/icons/           - SVG icons as React components via vite-plugin-svgr
  msw/                    - Mock Service Worker handlers & browser setup
  types.ts                - Shared TypeScript types
```

## TODOs (if more time)

- Add debounce to search input for better performance
- Add skeleton loading states
- Add pagination or infinite scroll indicator
- Add product detail modal/drawer
- E2E tests with Playwright
- Dark mode support
