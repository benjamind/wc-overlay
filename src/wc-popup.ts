import {customElement} from 'lit-element';

import {createPopupOverlay} from './lib/create-popup';
import {LitOverlay} from './wc-overlay';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('wc-popup')
export class LitPopup extends LitOverlay {
  public triggerOn?: string = 'pointerenter';
  public triggerOff?: string = 'pointerleave';

  protected createOverlay(content: HTMLElement) {
    const overlay = createPopupOverlay(this, {
      relativeTo: this.triggerContainer.assignedNodes()[0] as HTMLElement,
      overlay: {
        triggerEvent: this.triggerEvent,
        content,
        target: document.body,
      },
      popper: {
        placement: 'bottom',
      },
    });
    return overlay;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-popup': LitPopup;
  }
}
