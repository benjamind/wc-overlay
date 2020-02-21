import {LitElement, html, customElement, css} from 'lit-element';

/**
 * An example dialog element.
 *
 * @slot - This element has a slot
 */
@customElement('example-dialog')
export class ExampleDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 300px;
      height: 300px;
      border: 1px solid black;
      background: #ccc;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
    }
    #close {
      position: absolute;
      top: 0;
      right: 0;
    }
  `;

  public render() {
    return html`
      <button id="close" @click=${this.onClose}>x</button>
      <slot></slot>
    `;
  }

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent('dialog-close', {
        bubbles: true,
        composed: true,
      })
    );
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'example-dialog': ExampleDialog;
  }
}
