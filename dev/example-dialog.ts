/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

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
