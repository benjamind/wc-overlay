import {createPopper, Options} from '@popperjs/core';
import {createOverlay, OverlayOpts, Overlay} from './create-overlay';

export function createPopup(
  relativeTo: HTMLElement,
  content: HTMLElement,
  opts?: Partial<Options>
): void {
  createPopper(relativeTo, content, opts);
}

export interface PopupOverlayOpts {
  relativeTo: HTMLElement;
  overlay: OverlayOpts;
  popper: Partial<Options>;
}

export function createPopupOverlay(
  src: HTMLElement,
  opts: PopupOverlayOpts
): Overlay | undefined {
  const overlay = createOverlay(src, opts.overlay);
  if (!overlay) {
    return;
  }
  const popper = createPopper(opts.relativeTo, overlay?.content, opts.popper);
  overlay.content.addEventListener('wc-overlay-close', () => {
    popper.destroy();
  });
  overlay.content.addEventListener('wc-overlay-update', () => {
    popper.forceUpdate();
  });
  return overlay;
}
