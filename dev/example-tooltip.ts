import {LitElement, html, customElement, css, property} from 'lit-element';

/**
 * An example tooltip element.
 *
 * @slot - This element has a slot
 */
@customElement('example-tooltip')
export class ExampleTooltip extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    #content {
      padding: 4px 8px;
      background: #fff;
      color: #000;
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
      background: #fff;
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
      <div id="content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'example-tooltip': ExampleTooltip;
  }
}
