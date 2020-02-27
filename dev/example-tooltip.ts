import {LitElement, html, customElement, css, property} from 'lit-element';

@customElement('example-tooltip')
export class ExampleTooltip extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: -apple-system, Helvetica Neue, Segoe UI, Roboto, Oxygen,
        Ubuntu, Cantarell, Open Sans, sans-serif;
      background: #333;
      color: white;
      font-weight: bold;
      padding: 4px 8px;
      font-size: 13px;
      border-radius: 4px;
    }

    #arrow,
    #arrow::before {
      position: absolute;
      width: 8px;
      height: 8px;
      z-index: -1;
    }

    #arrow::before {
      content: '';
      transform: rotate(45deg);
      background: #333;
    }

    :host([placement^='top']) {
      margin-bottom: 8px;
    }

    :host([placement^='bottom']) {
      margin-top: 8px;
    }

    :host([placement^='left']) {
      margin-right: 8px;
    }

    :host([placement^='right']) {
      margin-left: 8px;
    }

    :host([placement^='top']) #arrow {
      bottom: 4px;
    }

    :host([placement^='bottom']) #arrow {
      top: 4px;
    }

    :host([placement^='left']) #arrow {
      right: 4px;
    }

    :host([placement^='right']) #arrow {
      left: 4px;
    }
  `;

  @property({attribute: false})
  public get arrow() {
    return this.shadowRoot?.querySelector('#arrow');
  }

  public render() {
    return html`
      <div id="arrow"></div>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'example-tooltip': ExampleTooltip;
  }
}
