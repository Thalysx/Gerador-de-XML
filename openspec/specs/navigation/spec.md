# Spec: Navigation

## Sidebar
Expanded sidebar SHALL show FUTURE G identity, environment selector, global search, icon + module name, settings and an icon-based collapse control.

Collapsed sidebar SHALL show icons only, keep an icon-based expand control, expose function names through accessible tooltips, and automatically increase usable content width. Collapse state SHOULD persist between navigations when appropriate.

The collapse/expand control MUST NOT be represented as a large textual button or as a replacement for the FUTURE G identity/logo.

## Environment selector
The sidebar SHALL provide **Geradores Gerais** and **QA Portuário**.

Changing environment SHALL update sidebar items, dashboard, search results, shortcuts, favorites and application context without a full-page reload.

## Global search
The application SHALL support generator/function search, with `Ctrl + K` as the preferred shortcut when compatible with the stack.

Search SHALL respect the active environment. Architecture SHOULD permit future cross-environment search.
