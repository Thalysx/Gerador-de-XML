# Design: Immediate UX Improvements

## Approach
Implement this change incrementally against the existing repository. Inspect current patterns first, reuse compatible components/services, isolate business rules from presentation, and avoid parallel old/new implementations that create duplicated or visually mixed application shells.

## Decisions

- Chat renderers preserve a user's scroll position when the message viewport is not near its end. Local and remote conversations share the same proximity rule, including reduced-motion behavior.
- The attachment payload remains the existing explicit XML string sent only with the next remote request. The interaction moves into a `+` menu beside the composer, and the pending attachment is represented by a removable item so later file types can reuse the shell.
- Batch state remains independent from the individual result. Its existing engine and export paths are retained; only placement and coverage change.
- Manual NCM values are normalized to eight digits, deduplicated, removable and applied in order to the current NF-e product rows. Presets remain available, and the reusable list does not create the cargo-generator family reserved for later phases.
- `placa-antiga` remains a compatibility identifier for favorites, history and direct opening, but discovery exposes one Placa entry with a pattern selector.
- XML validation keeps its existing local parser and limits. Selection and drop use the same handler, and the upload target reports which source was loaded or can replace it.

## Responsive and accessibility

The composer menu, pending attachment, batch section, NCM list and upload target remain keyboard operable and labeled. At narrow widths controls wrap without horizontal page scrolling. Status changes use existing live regions and do not rely on color.

## Compatibility
Existing routes and behaviors affected by this change MUST either remain compatible or be migrated deliberately with regression validation.

## Validation
Use the repository's available lint, tests and production build. Verify relevant existing functionality manually when automated coverage is absent.
