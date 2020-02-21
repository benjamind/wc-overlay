const targetMap = new WeakMap<HTMLElement, Overlay[]>();
function getStack(target: HTMLElement): Overlay[] {
  // get the stack for the target element
  let stack = targetMap.get(target);
  if (!stack) {
    stack = [];
    targetMap.set(target, stack);
  }
  return stack;
}

function createPlaceholder(element: HTMLElement): Comment {
  const placeholder = document.createComment(
    'placeholder for ' + element.nodeName
  );

  if (element.parentElement) {
    element.parentElement.replaceChild(placeholder, element);
  }

  return placeholder;
}

function restorePlaceholder(placeholder: Comment, element: HTMLElement): void {
  if (!placeholder.parentElement) {
    return;
  }
  placeholder.parentElement.replaceChild(element, placeholder);
}

export class Overlay extends EventTarget {
  protected triggerEvent?: Event;
  protected triggerOn?: string;
  protected triggerOff?: string;
  protected closeOn?: string;
  protected pointerOverOverlay = false;
  protected pendingClose = false;

  public overlayContainer: HTMLDivElement;

  protected triggerContainer?: HTMLElement;
  protected placeholders = new WeakMap<HTMLElement, Comment>();
  protected target?: HTMLElement;

  private _open = false;
  public get isOpen(): boolean {
    return this._open;
  }

  public constructor() {
    super();
    // create a container element for our overlay content
    // this is what we popup the dom, and we put our content into it
    this.overlayContainer = document.createElement('div');
    this.overlayContainer.style.display = 'contents';
  }

  private removeTriggerListeners() {
    if (this.triggerContainer) {
      if (this.triggerOn) {
        this.triggerContainer.removeEventListener(
          this.triggerOn,
          this.onTriggerOn
        );
      }
      if (this.triggerOff) {
        this.triggerContainer.removeEventListener(
          this.triggerOff,
          this.onTriggerOff
        );
      }
    }
  }

  private removeContentListeners() {
    if (
      this.triggerOff === 'pointerleave' ||
      this.triggerOff === 'pointerout'
    ) {
      this.overlayContainer.removeEventListener(
        this.triggerOff,
        this.onTriggerOff
      );
    }

    if (this.closeOn) {
      this.overlayContainer.removeEventListener(this.closeOn, this.onCloseOn);
    }
  }

  public setTrigger(element: HTMLElement, on: string, off?: string) {
    this.removeTriggerListeners();

    this.triggerContainer = element;
    this.triggerOff = off;
    this.triggerOn = on;

    if (on) {
      element.addEventListener(on, this.onTriggerOn);
    }
    if (off) {
      element.addEventListener(off, this.onTriggerOff);
    }

    // if this popup is responsive to pointer in/out state, add it to the
    // the overlay container too so we can mouse over into popups
    if (
      this.triggerOff === 'pointerleave' ||
      this.triggerOff === 'pointerout'
    ) {
      this.overlayContainer.addEventListener(
        this.triggerOff,
        this.onTriggerOff
      );
    }
  }

  public destroy() {
    // close overlay
    this.close();
    // cleanup event listeners
    this.removeTriggerListeners();
    this.removeContentListeners();
  }

  private onTriggerOn = (ev: Event) => {
    if (this._open) {
      return;
    }
    this.triggerEvent = ev;
    this.open();
  };

  private pointerRemainsInOverlay(ev: PointerEvent) {
    const relatedNode = ev.relatedTarget;
    if (!relatedNode) {
      return false;
    }

    if (
      this.overlayContainer.contains(relatedNode as HTMLElement) &&
      ev.target === this.triggerContainer
    ) {
      return true;
    }
    if (
      ev.target === this.overlayContainer &&
      ev.relatedTarget === this.triggerContainer
    ) {
      return true;
    }
    return false;
  }

  private onTriggerOff = (ev: Event) => {
    // if we're not open, or the event was already handled by the on trigger, do nothing
    if (!this.open || ev === this.triggerEvent) {
      return;
    }
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
      this.close();
    }
  };

  protected createOverlay(): void {
    if (!this.triggerContainer) {
      return;
    }

    // fire an event to query for the target for our overlay content
    const overlayOpenEvent: OverlayOpenEvent = new CustomEvent(
      'wc-overlay-open',
      {
        bubbles: true,
        composed: true,
        detail: {
          triggerEvent: this.triggerEvent,
          content: this.overlayContainer,
          target: document.body,
          targetName: undefined,
        },
        cancelable: true,
      }
    );

    const open = this.triggerContainer.dispatchEvent(overlayOpenEvent);
    // retrieve the detail after the event was handled and query it for info
    const overlayDetail = overlayOpenEvent.detail;

    if (!open || !overlayDetail.target) {
      return; // something prevented the open event, do nothing
    }

    // cache the target and get the stack of overlays for that target container
    this.target = overlayDetail.target;
    const stack = getStack(this.target);

    // add our overlay to that target and to the stack
    stack.push(this);
    this.target.appendChild(this.overlayContainer);
  }

  public open(): HTMLElement | HTMLElement[] | undefined {
    if (this.isOpen) {
      return;
    }
    // fire an event to request the content for our overlay
    const contentQuery: OverlayContentRequestEvent = new CustomEvent(
      'wc-overlay-content',
      {
        bubbles: true,
        composed: true,
        detail: {
          content: undefined,
          closeOn: undefined,
          foo: true,
        },
        cancelable: false,
      }
    );
    this.dispatchEvent(contentQuery);
    const {content, closeOn} = contentQuery.detail;

    if (!content) {
      // can't open an overlay with no content
      this.close();
      return;
    }

    // steal the content and add it to our container
    const contentElements = Array.isArray(content) ? content : [content];
    contentElements.forEach((el) => {
      const placeholder = createPlaceholder(el);
      this.placeholders.set(el, placeholder);
      this.overlayContainer.appendChild(el);
    });

    if (closeOn) {
      this.overlayContainer.addEventListener(closeOn, this.onCloseOn, {
        once: true,
      });
    }

    this.createOverlay();

    this._open = true;

    const overlayOpenedEvent: OverlayOpenedEvent = new CustomEvent(
      'wc-overlay-opened',
      {
        detail: {content, overlay: this, trigger: this.triggerEvent!},
      }
    );
    this.dispatchEvent(overlayOpenedEvent);
    return content;
  }

  protected onCloseOn = () => {
    this.close();
  };

  public close() {
    if (!this.isOpen) {
      return;
    }
    // fire an event to see if we can close
    const overlayCloseEvent: OverlayCloseEvent = new CustomEvent(
      'wc-overlay-close',
      {
        bubbles: true,
        composed: true,
        detail: {overlay: this},
      }
    );
    this.overlayContainer.dispatchEvent(overlayCloseEvent);
    if (!this.target) {
      throw new Error('No target for opened overlay?');
    }
    // remove the overlay from the stack
    const stack = getStack(this.target);
    const index = stack.findIndex((entry) => entry === this);
    if (index >= 0) {
      stack.splice(index, 1);
    }

    // restore the content
    while (this.overlayContainer.firstChild) {
      const placeholder = this.placeholders.get(
        this.overlayContainer.firstChild as HTMLElement
      );
      if (!placeholder) {
        continue;
      }
      restorePlaceholder(
        placeholder,
        this.overlayContainer.firstChild! as HTMLElement
      );
    }
    this.overlayContainer.parentElement?.removeChild(this.overlayContainer);

    this.triggerEvent = undefined;
    this._open = false;

    const overlayClosedEvent: OverlayClosedEvent = new CustomEvent(
      'wc-overlay-closed',
      {
        detail: {overlay: this},
      }
    );
    this.dispatchEvent(overlayClosedEvent);
  }
}

export type OverlayContentRequestEvent = CustomEvent<{
  content: HTMLElement | HTMLElement[] | undefined;
  closeOn: string | undefined;
}>;

export type OverlayOpenEvent = CustomEvent<{
  triggerEvent?: Event;
  content: HTMLElement;
  target: HTMLElement;
  targetName?: string;
}>;

export type OverlayOpenedEvent = CustomEvent<{
  content: HTMLElement | HTMLElement[] | undefined;
  overlay: Overlay;
  trigger: Event;
}>;

export type OverlayCloseEvent = CustomEvent<{overlay: Overlay}>;
export type OverlayClosedEvent = CustomEvent<{overlay: Overlay}>;
