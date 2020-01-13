---
layout: page.11ty.cjs
title: <wc-overlay> ⌲ Home
---

# &lt;wc-overlay>

In `<wc-overlay>` we attempt to provide APIs and web components which can be used to create overlays and popups which work well with ShadowDOM containment.

A common problem in ShadowDOM is that of encapsulation of displayed content. Say you have a dialog, its size is set such that it does not allow overflow of content, but you want custom tooltips on elements inside the dialog, and you want these to correctly escape the containment of the dialog. `<wc-popup>` and the `createPopup` function help solve this problem.

In `<wc-overlay>` we define an `overlay` as an element which appears above other DOM, potentially being hoisted up through the DOM to some layer where it should be displayed. This is the base building block of the library. We define a `popup` as an overlay, but with the added functionality of positioning said overlay relative to some other element. To achieve this `<wc-overlay>` uses the [`popper.js`](https://popper.js.org/) library.

## <wc-overlay> usage

<section class="columns">
  <div>
  
`<wc-overlay>` can be used to hoist an element out of the current location in the DOM up to another location in the DOM (by default, `document.body`):

```html
<div style="overflow: hidden; width: 300px; height: 200px">
  <wc-overlay trigger-on="click" close-on="click">
    <button slot="trigger">Open Overlay</button>
    <div
      style="width: 500px; height: 500px; font-size: 50px; background-color: beige; border: 1px solid black"
    >
      Click me to close!
    </div>
  </wc-overlay>
</div>
```

  </div>
  <div>

  <div style="overflow: hidden; width: 300px; height: 200px">
    <wc-overlay trigger-on="click" close-on="click">
      <button slot="trigger">Open Overlay</button>
      <div
        style="width: 500px; height: 500px; font-size: 50px; background-color: beige; border: 1px solid black; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
      >
        Click me to close!
      </div>
    </wc-overlay>
  </div>

  </div>
</section>

## <wc-popup> usage

<section class="columns">
  <div>

`<wc-popup>` can be used to show a popup when a trigger element emits a specific event, by default it uses `pointerenter` and `pointerleave` to create hover popup behavior:

```html
<wc-popup>
  <button slot="trigger">Open</button>
  <div>My cool content on hover</div>
</wc-popup>
```

  </div>
  <div>

<wc-popup>
  <button slot="trigger">Open</button>
  <div>My cool content on hover</div>
</wc-popup>

  </div>
</section>
