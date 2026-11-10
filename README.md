# @sudobility/printing

Web printing for `@sudobility` apps. The browser paginates and rasterizes; this
library arranges the DOM and emits the right CSS (`@page`, the detached-print
machinery, the draw-readiness gate). Built on `@sudobility/printing_core`.

> **Phase 0 scaffold.** This package currently ships only `pageCss`. The
> detached-print helper (`printDetached`), the `PrintSlice` wrapper, and the
> `useDrawGate` hook land in Phase 1. See the design doc at
> `music_app_rn/docs/printing-libraries.md`.

## Install

```sh
bun add @sudobility/printing
```
