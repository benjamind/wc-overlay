import {
  LitElement,
  html,
  customElement,
  property,
  css,
  query,
  PropertyValues,
} from 'lit-element';
import {Overlay, OverlayContentRequestEvent} from './lib/create-overlay';

/**
 * An element which can hoist the content given to its slots to another location within the dom.
 *
 * @slot [mask] - The mask slot content will be shown in the overlay below the other content
 * @slot - The general content slot will accept a single element to move into the overlay content
 */
@customElement('wc-overlay')
export class OverlayElement extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
    #content,
    #mask {
      display: none;
    }
  `;

  protected overlay: Overlay;

  @property({reflect: true, type: Boolean})
  public set open(value: boolean) {
    this.overlay.open = value;
  }
  public get open(): boolean {
    return this.overlay.open;
  }

  @property({reflect: true, attribute: 'trigger-on'})
  public triggerOn = 'click';

  @property({reflect: true, attribute: 'trigger-off'})
  public triggerOff?: string;

  @property({reflect: true, attribute: 'close-on'})
  public closeOn?: string;

  @property({reflect: true, attribute: 'mask-close-on'})
  public maskCloseOn = 'click';

  @query('#trig')
  protected triggerContainer!: HTMLSlotElement;

  @query('#content')
  protected contentContainer!: HTMLSlotElement;

  @query('#mask')
  protected maskContainer!: HTMLSlotElement;

  public render() {
    return html`
      <slot name="trigger" id="trig"></slot>
      <slot id="content"></slot>
      <slot name="mask" id="mask"></slot>
    `;
  }

  public constructor() {
    super();
    this.overlay = new Overlay();
    this.overlay.addEventListener(
      'wc-overlay-content',
      this.handleContentRequest
    );
  }

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

  private handleContentRequest = (evt: Event) => {
    const requestEvent = evt as OverlayContentRequestEvent;

    const maskContent = this.extractSlotContent(this.maskContainer);

    if (maskContent && this.maskCloseOn) {
      maskContent.addEventListener(
        this.maskCloseOn,
        () => {
          this.overlay.open = false;
        },
        {once: true}
      );
    }

    requestEvent.detail.content = [
      maskContent,
      this.extractSlotContent(this.contentContainer),
    ];
    requestEvent.detail.closeOn = this.closeOn;
  };

  protected extractSlotContent = (slot: HTMLSlotElement): HTMLElement => {
    const nodes = slot.assignedNodes({flatten: true});
    const elements = nodes.filter(
      (node) => node instanceof HTMLElement
    ) as HTMLElement[];

    if (elements.length) {
      return elements[0];
    }
    throw new Error('No slotted content');
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-overlay': OverlayElement;
  }
}
