// Re-exported from printing_core so a web consumer has the geometry it needs
// without a second import.
export {
  DEFAULT_MARGIN_MM,
  pageCss,
  pageGeometry,
  usablePageHeight,
  usablePageMm,
} from '@sudobility/printing_core';
export type {
  PageGeometry,
  PaperOrientation,
  PaperSize,
} from '@sudobility/printing_core';

export * from './print-slice.js';
export * from './use-draw-gate.js';
export * from './print-detached.js';
