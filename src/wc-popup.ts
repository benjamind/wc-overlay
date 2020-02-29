import {
  customElement,
  html,
  LitElement,
  css,
  property,
  query,
  PropertyValues,
} from 'lit-element';

import {
  Overlay,
  OverlayContentRequestEvent,
  OverlayOpenedEvent,
} from './lib/create-overlay';
import {createPopper, Instance, Modifier, Options} from '@popperjs/core';

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('wc-popup')
export class PopupElement extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
    #content {
      display: none;
    }
  `;

  protected overlay: Overlay;

  private _open = false;

  @property({reflect: true, type: Boolean})
  public set open(value: boolean) {
    if (value) {
      this.overlay.open();
    } else if (!value) {
      this.overlay.close();
    }
    const oldOpen = this._open;
    this._open = this.overlay.isOpen;
    this.requestUpdate('open', oldOpen);
  }

  public get open(): boolean {
    return this._open;
  }

  @property({type: String, attribute: 'trigger-on'})
  public triggerOn = 'pointerenter';

  @property({type: String, attribute: 'trigger-off'})
  public triggerOff? = 'pointerleave';

  @property({type: String, attribute: 'close-on'})
  public closeOn?: string;

  @property()
  public placement: Options['placement'] = 'auto';

  @query('#trig')
  protected triggerContainer!: HTMLSlotElement;

  @query('#content')
  protected contentContainer!: HTMLSlotElement;

  protected popper?: Instance;

  public render() {
    return html`
      <slot name="trigger" id="trig"></slot>
      <slot id="content"></slot>
    `;
  }

  public constructor() {
    super();
    this.overlay = new Overlay();
    this.overlay.overlayContainer.style.display = 'block';
    this.overlay.addEventListener(
      'wc-overlay-content',
      this.handleContentRequest
    );
    this.overlay.addEventListener('wc-overlay-opened', this.onOverlayOpened);
    this.overlay.addEventListener('wc-overlay-closed', this.onOverlayClosed);
  }

  private handleContentRequest = (evt: Event) => {
    const requestEvent = evt as OverlayContentRequestEvent;
    requestEvent.detail.content = this.getPopupContent();
    requestEvent.detail.closeOn = this.closeOn;
  };

  protected onOverlayOpened = (ev: Event) => {
    const overlayOpenedEvent = ev as OverlayOpenedEvent;
    const content = overlayOpenedEvent.detail.content;
    const attribModifier: Modifier<{
      content: OverlayOpenedEvent['detail']['content'];
    }> = {
      name: 'attribModifier',
      enabled: true,
      phase: 'write',
      options: {
        content,
      },
      // main function applies placement attribute to content
      fn: ({state, options}) => {
        if (options.content && state.placement) {
          options.content.forEach((el) =>
            el.setAttribute('placement', state.placement)
          );
        }
        return undefined;
      },
      // effect removes the attribute
      effect: ({state, options}) => {
        return () => {
          if (options.content && state.placement) {
            options.content.forEach((el) => el.removeAttribute('placement'));
          }
        };
      },

      requires: ['computeStyles'],
    };
    const reference =
      this.triggerContainer.assignedElements()[0] || this.parentElement;

    this.popper = createPopper(reference, this.overlay.overlayContainer, {
      placement: this.placement,
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: this.getArrow(content),
          },
        },
        attribModifier,
      ],
    });
    this.open = true;
  };

  protected onOverlayClosed = () => {
    if (this.popper) {
      this.popper.destroy();
      this.popper = undefined;
    }
    this.open = false;
  };

  protected getArrow = (content?: HTMLElement[]): HTMLElement | undefined => {
    if (content) {
      for (const el of content) {
        const possibleArrow = el as HTMLElement & {arrow: HTMLElement};
        return possibleArrow.arrow;
      }
    }
    return undefined;
  };

  protected getPopupContent = (): HTMLElement => {
    const content = this.extractSlotContent();
    if (content) {
      return content;
    }

    throw new Error('No slotted content!');
  };

  public updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (
      changedProperties.has('triggerOn') ||
      changedProperties.has('triggerOff')
    ) {
      this.overlay.setTrigger(
        this.triggerContainer,
        this.triggerOn,
        this.triggerOff
      );
    }
  }

  protected extractSlotContent = (): HTMLElement | undefined => {
    const slot = this.contentContainer;
    const nodes = slot.assignedNodes({flatten: true});
    const elements = nodes.filter(
      (node) => node instanceof HTMLElement
    ) as HTMLElement[];

    if (elements.length) {
      return elements[0];
    }

    return undefined;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-popup': PopupElement;
  }
}
