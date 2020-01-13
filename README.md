# LitElement TypeScript starter

This project includes a sample component using LitElement with TypeScript.

## Setup

Install dependencies:

```bash
npm i
```

## Build

This sample uses the TypeScript compiler to produce JavaScript that runs in modern browsers.

To build the JavaScript version of your component:

```bash
npm run build
```

To watch files and rebuild when the files are modified, run the following command in a separate shell:

```bash
npm run build:watch
```

Both the TypeScript compiler and lit-analyzer are configured to be very strict. You may want to change `tsconfig.json` to make them less strict.

## Testing

This sample uses Karma, Chai, Mocha, and the open-wc test helpers for testing. See the [open-wc testing documentation](https://open-wc.org/testing/testing.html) for more information.

Tests can be run with the `test` script:

```bash
npm test
```

## Dev Server

This sample uses open-wc's [es-dev-server](https://github.com/open-wc/open-wc/tree/master/packages/es-dev-server) for previewing the project without additional build steps. ES dev server handles resolving Node-style "bare" import specifiers, which aren't supported in browsers. It also automatically transpiles JavaScript and adds polyfills to support older browsers.

To run the dev server and open the project in a new browser tab:

```bash
npm run serve
```

There is a development HTML file located at `/dev/index.html` that you can view at http://localhost:8000/dev/index.html.

## Editing

If you use VS Code, we highly reccomend the [lit-plugin extension](https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin), which enables some extremely useful features for lit-html templates:

- Syntax highlighting
- Type-checking
- Code completion
- Hover-over docs
- Jump to definition
- Linting
- Quick Fixes

The project is setup to reccomend lit-plugin to VS Code users if they don't already have it installed.

## Linting

Linting of TypeScript files is provided by [ESLint](eslint.org) and [TypeScript ESLint](https://github.com/typescript-eslint/typescript-eslint). In addition, [lit-analyzer](https://www.npmjs.com/package/lit-analyzer) is used to type-check and lint lit-html templates with the same engine and rules as lit-plugin.

The rules are mostly the recommended rules from each project, but some have been turned off to make LitElement usage easier. The recommended rules are pretty strict, so you may want to relax them by editing `.eslintrc.json` and `tsconfig.json`.

To lint the project run:

```bash
npm run lint
```

## Formatting

[Prettier](https://prettier.io/) is used for code formatting. It has been pre-configured according to the Polymer Project's style. You can change this in `.prettierrc.json`.

Prettier has not been configured to run when commiting files, but this can be added with Husky and and `pretty-quick`. See the [prettier.io](https://prettier.io/) site for instructions.

## Static Site

This project includes a simple website generated with the [eleventy](11ty.dev) static site generator and the templates and pages in `/docs-src`. The site is generated to `/docs` and intended to be checked in so that GitHub pages can serve the site [from `/docs` on the master branch](https://help.github.com/en/github/working-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

To enable the site go to the GitHub settings and change the GitHub Pages &quot;Source&quot; setting to &quot;master branch /docs folder&quot;.</p>

To build the site, run:

```bash
npm run docs
```

To serve the site locally, run:

```bash
npm run docs:serve
```

To watch the site files, and re-build automatically, run:

```bash
npm run docs:watch
```

The site will usually be served at http://localhost:8000.

## More information

See [Get started](https://lit-element.polymer-project.org/guide/start) on the LitElement site for more information.

# Goals

Create a declarative and imperative API for 'promoting' elements from deep in a ShadowDOM.

# Declarative API

- Trigger promotion based on an arbitrary event name from child content.
- Allow specific elements to be targetted as triggers
- Promote to document.body by default, but allow customization through DOM hierarchy or property
- Support a background mask 1 level behind the overlay, this can be used for triggering close behavior
- Allow custom mask element
- Allow dismissal from event from content, trigger, or mask

```html
<lit-overlay
  trigger-open="click"
  trigger-close="click"
  mask
  mask-close="click"
  content-close="my-dialog-close"
  target="dialogs-container"
>
  <my-dialog></my-dialog>
</lit-overlay
```

# Tooltips

Creating tooltips for ShadowDOM is awkward, needs promotion to higher layers, and also needs position management.

Suggest use of `@popperjs/core` to give this capability, as peer dependency.

- Make use of imperative overlay promotion API to promote a tooltip element and then use popper to position it.
- Close when trigger element pointer-out event
- Support 'arrow' slot to contain custom arrow content, if required
- Can also use ::parts API to style and use before/after pseudo selectors
- Support 'content' slot to contain HTML content that will be shown in the tooltip
- Remaining content remains in document flow and is unaffected by tooltip element, display:content

```html
<lit-tooltip>
  <div slot="content">Tooltip <b>text</b> with arbitrary html!</div>
  <button>My cool button</button>
</lit-tooltip>

<lit-tooltip tip="A simple tooltip">
  <button>My cool button</button>
</lit-tooltip>
```

Actual tooltip will be rendered as a `lit-tip` element unless another element is specified:

```html
<lit-tip>
  # shadow
  <div id="arrow"><slot name="arrow"></slot></div>
  <div id="content"><slot></slot></div>
</lit-tip>
```

Custom elements will be expected to support the same slots.
