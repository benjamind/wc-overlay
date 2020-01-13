import {customElement} from 'lit-element';

import {createPopupOverlay} from './lib/create-popup';
import {LitOverlay} from './lit-overlay';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('lit-popup')
export class LitPopup extends LitOverlay {
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
    'lit-popup': LitPopup;
  }
}
