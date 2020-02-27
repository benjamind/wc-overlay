---
layout: example.11ty.cjs
title: <wc-overlay> ⌲ Examples ⌲ Basic
tags: example
name: Basic Overlay
description: Using wc-overlay to show a dialog
---

<style>
  #dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 500px;
    height: 500px;
    font-size: 50px;
    background-color: beige;
    border: 1px solid black;
  }

  #mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
  }
</style>

<wc-overlay trigger-on="click" close-on="click" mask-close-on="click">
  <button slot="trigger">Open Overlay</button>
  <div id="dialog">
    Click me or the mask to close!
  </div>
  <div slot="mask" id="mask"></div>
</wc-overlay>

<h3>HTML</h3>

```html
<wc-overlay trigger-on="click" close-on="click" mask-close-on="click">
  <button slot="trigger">Open Overlay</button>
  <div id="dialog">
    Click me or the mask to close!
  </div>
  <div slot="mask" id="mask"></div>
</wc-overlay>
```
