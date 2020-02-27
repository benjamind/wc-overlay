---
layout: example.11ty.cjs
title: <wc-overlay> ⌲ Examples ⌲ Popup
tags: example
name: Popup Example
description: Using wc-popup with a tooltip
---

<wc-popup>
  <button slot="trigger">Open</button>
  <div id="tooltip" role="tooltip">
      My tooltip
      <div id="arrow" data-popper-arrow></div>
  </div>
</wc-popup>

<style>
  #tooltip {
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

  #tooltip[placement^='top'] > #arrow {
    bottom: -4px;
  }

  #tooltip[placement^='bottom'] > #arrow {
    top: -4px;
  }

  #tooltip[placement^='left'] > #arrow {
    right: -4px;
  }

  #tooltip[placement^='right'] > #arrow {
    left: -4px;
  }
</style>

<h3>HTML</h3>

```html
<wc-popup>
  <button slot="trigger">Open</button>
  <div id="tooltip" role="tooltip">
    My tooltip
    <div id="arrow" data-popper-arrow></div>
  </div>
</wc-popup>
```
