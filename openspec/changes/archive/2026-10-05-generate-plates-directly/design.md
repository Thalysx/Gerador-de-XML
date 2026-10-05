# Design

## Context

Placa already has a complete default and a format selector. The registry prevents immediate activation, and navigation sets Mercosul unless the old-format alias is explicitly requested.

## Goals / Non-Goals

Match badge activation behavior without changing the generation engine, XML or other configured tools.

## Decisions

- Remove the configuration prerequisite only from Placa.
- Preserve the selector value during user activation of the canonical plate option; retain existing navigation semantics and explicit alias selection.
- Reuse the existing generation path and history ownership. Keep the button and shortcut.
- Test activation from option, Home and search for both formats, one history entry per action, regeneration and navigation without generation.

## Risks / Trade-offs

The activation controller must restore the selected format before generation. Keep the explicit old-format alias authoritative and avoid changing stored history contracts.

## Migration Plan

No migration. Validate full tests, production build and browser audit; synchronize the UI delta, archive the completed change and publish the next alpha through the existing Git/Vercel integration.
