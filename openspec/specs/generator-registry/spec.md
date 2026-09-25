# Spec: Generator Registry and Shared Architecture

## Central registry
When compatible with the existing stack, generators SHALL be described by a central registry containing: id, name, environment, category, icon, route, keywords, batch support, export support, valid/invalid support and description.

Sidebar, search, favorites and dashboards SHOULD consume this common source rather than duplicate module metadata.

## Modularity
Generator business logic SHALL be separated from UI where practical. General and port-specific modules SHALL be separated conceptually, without creating artificial directories that conflict with the real stack.

## Reusable components
Prefer shared configurable components for forms, results, copy, regenerate, batch, export, upload, errors, validation, cards, registration sheets and navigation. Do not duplicate entire components between environments when configuration is sufficient.

## New generator baseline
When applicable, every new generator SHALL have name/description/category/environment, synthetic output, regenerate/copy, validation, understandable errors, searchability, favorites and responsive UI; batch/export SHALL be supported where meaningful.
