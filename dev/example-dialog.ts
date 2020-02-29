import {LitElement, html, customElement, css, query} from 'lit-element';

@customElement('example-dialog')
export class ExampleDialog extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 300px;
      height: 300px;
      border: 1px solid black;
      background: #fff;
      border-radius: 5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      overflow: hidden;
      padding: 40px;
    }

    button {
      background-color: #fff;
      color: black;
      margin: 0 auto;
      border: 1px solid black;
      border-radius: 5px;
      padding: 10px;
    }

    button:focus {
      border-color: #00c;
    }
  `;

  @query('button')
  private firstFocusableElement!: HTMLElement;

  public render() {
    return html`
      <div id="container">
        <slot></slot>
        <button id="close" @click=${this.onClose}>
          Close Overlay
        </button>
      </div>
    `;
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.tabIndex = 0;
  }

  private onClose = () => {
    this.dispatchEvent(
      new CustomEvent('dialog-close', {
        bubbles: true,
        composed: true,
      })
    );
  };

  public focus = () => {
    this.firstFocusableElement.focus();
    this.tabIndex = -1;
  };

  public blur = () => {
    this.tabIndex = 0;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'example-dialog': ExampleDialog;
  }
}
