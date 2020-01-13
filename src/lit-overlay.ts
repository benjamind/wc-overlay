import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
} from 'lit-element';
import {createOverlay, Overlay} from './lib/create-overlay';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('lit-overlay')
export class LitOverlay extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
    #content {
      display: none;
    }
  `;

  private _open = false;

  @property({reflect: true, type: Boolean})
  public set open(value: boolean) {
    if (!this._open && value) {
      this.openOverlay();
    } else {
      this.closeOverlay();
    }

    this._open = value;
  }
  public get open(): boolean {
    return this._open;
  }

  @property({reflect: true, type: String, attribute: 'trigger-on'})
  public triggerOn?: string;

  @property({reflect: true, type: String, attribute: 'trigger-off'})
  public triggerOff?: string;

  @property({reflect: true, type: String, attribute: 'close-on'})
  public closeOn?: string;

  @property({reflect: true, type: Boolean})
  public mask: boolean = false;

  @query('#trig')
  protected triggerContainer!: HTMLSlotElement;

  @query('#content')
  protected contentContainer!: HTMLSlotElement;

  protected overlay?: Overlay;
  protected triggerEvent?: Event;
  protected pointerOverOverlay = false;
  protected pendingClose = false;

  public render() {
    return html`
      <slot name="trigger" id="trig"></slot>
      <slot id="content"></slot>
    `;
  }

  public firstUpdated() {
    if (this.triggerOn) {
      this.triggerContainer.addEventListener(this.triggerOn, this.onTriggerOn);
    }
    if (this.triggerOff) {
      this.triggerContainer.addEventListener(
        this.triggerOff,
        this.onTriggerOff
      );
    }
  }

  private onTriggerOn = (ev: Event) => {
    this.triggerEvent = ev;
    this.open = true;
  };

  private pointerRemainsInOverlay(ev: PointerEvent) {
    if (
      ev.relatedTarget === this.overlay?.content &&
      ev.target === this.triggerContainer
    ) {
      return true;
    }
    if (
      ev.target === this.overlay?.content &&
      ev.relatedTarget === this.triggerContainer
    ) {
      return true;
    }
    return false;
  }

  private onTriggerOff = (ev: Event) => {
    if (
      (ev.type === 'pointerleave' || ev.type === 'pointerout') &&
      this.pointerRemainsInOverlay(ev as PointerEvent)
    ) {
      // special case, if this is a pointer out style event
      // and we're moving from overlay to target or vice versa
      // then we didn't 'leave'

      return;
    } else {
      this.triggerEvent = ev;
      this.open = false;
    }
  };

  protected createOverlay(content: HTMLElement): Overlay | undefined {
    return createOverlay(this, {
      triggerEvent: this.triggerEvent,
      content,
      target: document.body,
    });
  }

  protected openOverlay() {
    const content = this.extractSlotContent(this.contentContainer);
    if (!content) {
      // can't open an overlay with no content
      this.open = false;
      return;
    }

    this.overlay = this.createOverlay(content);

    if (!this.overlay) {
      // failed to open the overlay
      this.open = false;
      return;
    }

    // if this popup is responsive to pointer in/out state, add it to the
    // the overlay content too so we can mouse over into popups
    if (
      this.triggerOff === 'pointerleave' ||
      this.triggerOff === 'pointerout'
    ) {
      this.overlay.content.addEventListener(this.triggerOff, this.onTriggerOff);
    }
    // track pointer over overlay state
    /*this.overlay.content.addEventListener('pointerenter', () => {
      this.pointerOverOverlay = true;
      content.addEventListener(
        'pointerleave',
        (ev) => {
          this.pointerOverOverlay = false;
          if (this.pendingClose) {
            this.triggerEvent = ev;
            this.open = false;
          }
        },
        {once: true}
      );
    });*/

    if (this.closeOn) {
      this.overlay.content.addEventListener(
        this.closeOn,
        () => {
          this.open = false;
        },
        {once: true}
      );
    }
  }

  protected closeOverlay() {
    if (this.overlay) {
      this.overlay.close();
      this.triggerEvent = undefined;
      this.overlay = undefined;
    }
  }

  private extractSlotContent(slot: HTMLSlotElement): HTMLElement | null {
    const nodes = slot.assignedNodes();
    const elements = nodes.filter(
      (node) => node instanceof HTMLElement
    ) as HTMLElement[];

    if (elements.length) {
      return elements[0];
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-overlay': LitOverlay;
  }
}
