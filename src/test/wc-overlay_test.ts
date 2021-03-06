import { OverlayElement } from '../wc-overlay.js';
// import {fixture, html} from '@open-wc/testing';

const assert = chai.assert;

suite('wc-overlay', () => {
  test('is defined', () => {
    const el = document.createElement('wc-overlay');
    assert.instanceOf(el, OverlayElement);
  });
  /*
  test('renders with default values', async () => {
    const el = await fixture(html`<my-element></my-element>`);
    assert.shadowDom.equal(el, `
      <h1>Hello, World!</h1>
      <button>Click Count: 0</button>
      <slot></slot>
    `);
  });

  test('renders with a set name', async () => {
    const el = await fixture(html`<my-element name="Test"></my-element>`);
    assert.shadowDom.equal(el, `
      <h1>Hello, Test!</h1>
      <button>Click Count: 0</button>
      <slot></slot>
    `);
  });

  test('handles a click', async () => {
    const el = await fixture(html`<my-element></my-element>`) as MyElement;
    const button = el.shadowRoot!.querySelector('button')!;
    button.click();
    await el.updateComplete;
    assert.shadowDom.equal(el, `
      <h1>Hello, World!</h1>
      <button>Click Count: 1</button>
      <slot></slot>
    `);
  });
*/
});
