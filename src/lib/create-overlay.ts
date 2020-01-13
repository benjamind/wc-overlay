export interface OverlayOpts {
  triggerEvent?: Event;
  content: HTMLElement;
  target: HTMLElement;
  targetName?: string;
}

type OverlayContent = HTMLElement;
type OverlayDetail = OverlayOpts;

export interface Overlay {
  close: () => HTMLElement;
  trigger?: string;
  content: OverlayContent;
  placeholder: Comment;
}

const targetMap = new WeakMap<HTMLElement, Overlay[]>();

function createPlaceholder(element: HTMLElement): Comment {
  const placeholder = document.createComment(
    'placeholder for ' + element.nodeName
  );

  /* istanbul ignore else */
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

export function createOverlay(
  src: HTMLElement,
  {triggerEvent, content, target = document.body, targetName}: OverlayOpts
): Overlay | undefined {
  const overlayDetail = {triggerEvent, content, target, targetName};

  const overlayOpenEvent = new CustomEvent<OverlayDetail>('wc-overlay-open', {
    bubbles: true,
    composed: true,
    detail: overlayDetail,
    cancelable: true,
  });

  const open = src.dispatchEvent(overlayOpenEvent);
  if (!open || !overlayDetail.target) {
    return undefined; // something prevented the open event, do nothing
  }

  // get the stack for the target element
  let stack = targetMap.get(overlayDetail.target);
  if (!stack) {
    stack = [];
    targetMap.set(overlayDetail.target, stack);
  }

  // make placeholder, and move content to target
  const placeholder = createPlaceholder(content);
  overlayDetail.target.appendChild(content);

  const overlay: Overlay = {
    content,
    placeholder,
    close: () => {
      content.dispatchEvent(
        new CustomEvent<OverlayDetail>('wc-overlay-close', {
          bubbles: true,
          composed: true,
          detail: overlayDetail,
        })
      );
      // remove the overlay from the stack
      const index = stack?.findIndex((entry) => entry === overlay);
      if (index! >= 0) {
        stack?.splice(index!, 1);
      }
      restorePlaceholder(placeholder, content);
      return content;
    },
  };

  stack.push(overlay);

  return overlay;
}
