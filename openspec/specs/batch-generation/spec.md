# Spec: Batch Generation

Batch generation SHALL remain available and evolve with safe configurable quantities.

For generator screens, preferred order is: configuration → Generate → individual result → batch generation.

Batch SHALL appear below the individual result rather than above it.

A `Limpar` action SHALL clear only batch results when individual and batch states are independent; it MUST NOT unnecessarily reset generator configuration or individual result.
