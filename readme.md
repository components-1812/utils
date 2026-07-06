# @components-1812/utils

Lightweight utilities for building native Web Components with JavaScript.

This package is designed to solve three repetitive tasks when working with Custom Elements:

1. **Attributes (`Attr`)**: `get`/`set` helpers for reading and writing attributes with casting and validation.
2. **Components (`ComponentUtils`)**: helpers for creating HTML/SVG nodes and querying elements with composed selectors.
3. **Styles (`ComponentStyleSheets` / `ComponentStyles`)**: `raw`, `links`, and `adoptedStyleSheets` style collections for applying styles to a `shadowRoot`.

```javascript
import Attr from '@components-1812/utils/attributes/index.js';
import { ComponentUtils as $ } from '@components-1812/utils/component/index.js';
import { ComponentStyleSheets, ComponentStyles } from '@components-1812/utils/styles/index.js';
```

> Note: `Attr` currently exposes `string`, `number`, `boolean`, `color`, and `list` from `attributes/index.js`.

---

## Attributes (`Attr`)

Each attribute utility follows the same idea:

- `get(element, name, defaultValue?, options?)` reads the attribute and returns a normalized value.
- `set(element, name, value, options?)` validates, normalizes, and writes the attribute.
- If `value == null`, `set` removes the attribute.
- Options usually accept `validate`, a function that decides whether the value is valid before writing or returning it.

### `Attr.string`

Converts any value to `string`, trims it by default, and allows text validation.

```javascript
const element = document.createElement('user-card');

Attr.string.set(element, 'label', '  Franco  ');

element.getAttribute('label'); // "Franco"
Attr.string.get(element, 'label', 'Anonymous'); // "Franco"

Attr.string.set(element, 'label', 'ok', {
    validate: (value) => value.length >= 3
}); // false, does not overwrite the previous attribute

Attr.string.get(element, 'missing', 'Anonymous'); // "Anonymous"
```

You can also disable trimming when reading:

```javascript
element.setAttribute('label', '  Keep spaces  ');

Attr.string.get(element, 'label', null, { trim: false }); // "  Keep spaces  "
```

### `Attr.number`

Reads and writes numeric attributes. If the value cannot be converted with `Number(value)`, it returns the default value or refuses to write.

```javascript
const element = document.createElement('my-box');

Attr.number.set(element, 'width', '320');

element.getAttribute('width'); // "320"
Attr.number.get(element, 'width', 100); // 320

Attr.number.set(element, 'width', -10, {
    validate: (value) => value >= 0
}); // false

Attr.number.get(element, 'height', 100); // 100
```

Typical usage inside a Web Component property:

```javascript
get width() {
    return Attr.number.get(this, 'width', this.constructor.defaults.width);
}

set width(value) {
    Attr.number.set(this, 'width', value, {
        validate: (number) => number >= 0
    });
}
```

### `Attr.boolean`

Works with boolean attributes. Writing `true` adds the attribute; writing `false` removes it through `toggleAttribute`.

```javascript
const element = document.createElement('my-toggle');

Attr.boolean.set(element, 'disabled', true);

element.hasAttribute('disabled'); // true
Attr.boolean.get(element, 'disabled'); // true

Attr.boolean.set(element, 'disabled', false);

element.hasAttribute('disabled'); // false
Attr.boolean.get(element, 'disabled'); // false
```

It also accepts the strings `"true"` and `"false"`:

```javascript
Attr.boolean.set(element, 'open', 'true');
Attr.boolean.get(element, 'open'); // true

Attr.boolean.set(element, 'open', 'false');
Attr.boolean.get(element, 'open'); // false
```

### `Attr.color`

Validates CSS colors with `CSS.supports('color', value)` and returns a `Color` instance.

```javascript
const element = document.createElement('color-chip');

Attr.color.set(element, 'color', 'rgba(255, 144, 20, 0.68)');

const color = Attr.color.get(element, 'color');

color.value; // "rgba(255, 144, 20, 0.68)"
color.hex; // "#ff9015ad"
color.rgb; // "rgb(255 144 20 / 0.68)"
color.hsl; // "hsl(32 100% 54% / 0.68)"
color.alpha; // 0.68
color.channels.r; // 255
```

You can request alternate formats:

```javascript
color.toRgb({ legacy: true }); // "rgba(255, 144, 20, 0.68)"
color.toHsl({ legacy: true }); // "hsla(32, 100%, 54%, 0.68)"
color.toHex({ alpha: false }); // "#ff9015"
```

And validate before writing:

```javascript
Attr.color.set(element, 'color', '#111', {
    validate: (color) => color.alpha === 1
});
```

### `Attr.list`

Returns a token list associated with an attribute, similar to `DOMTokenList`, with optional support for allowed tokens.

```javascript
const element = document.createElement('my-panel');

const state = Attr.list.get(element, 'state', {
    supportedTokens: ['open', 'closed', 'loading']
});

state.add('open');
element.getAttribute('state'); // "open"

state.toggle('loading');
element.getAttribute('state'); // "open loading"

state.contains('open'); // true
state.replace('open', 'closed'); // true
state.value; // "closed loading"
state[0]; // "closed"
```

Unsupported tokens are ignored:

```javascript
state.add('invalid');
element.getAttribute('state'); // "closed loading"
```

You can also iterate over the list:

```javascript
for (const token of state) {
    console.log(token);
}

state.forEach((token, index) => {
    console.log(index, token);
});
```

---

## ComponentUtils

Recommended import:

```javascript
import { ComponentUtils as $ } from '@components-1812/utils/component/index.js';
```

### `ComponentUtils.create.html`

Creates HTML elements and lets you configure classes, attributes, `data-*`, text, inner HTML, and children.

```javascript
const title = $.create.html('h2', {
    classes: ['card-title'],
    textContent: 'Profile'
});

const button = $.create.html('button', {
    classes: ['primary'],
    attributes: {
        type: 'button',
        'aria-label': 'Open profile'
    },
    data: {
        action: 'open',
        id: 'user-1'
    },
    textContent: 'Open'
});

const card = $.create.html('article', {
    classes: ['card'],
    children: [title, button]
});
```

Approximate result:

```html
<article class="card">
    <h2 class="card-title">Profile</h2>
    <button type="button" aria-label="Open profile" data-action="open" data-id="user-1">
        Open
    </button>
</article>
```

If you need HTML content that you control:

```javascript
const icon = $.create.html('span', {
    classes: ['icon'],
    html: '<strong>!</strong>'
});
```

### `ComponentUtils.create.svg`

Creates SVG nodes using `document.createElementNS`.

```javascript
const svg = $.create.svg('svg', {
    attributes: {
        viewBox: '0 0 24 24',
        width: '24',
        height: '24',
        'aria-hidden': 'true'
    },
    children: [
        $.create.svg('circle', {
            attributes: {
                cx: '12',
                cy: '12',
                r: '10',
                fill: 'currentColor'
            }
        })
    ]
});
```

### `ComponentUtils.query`

Builds a selector by combining:

- A base selector.
- Exact attributes.
- Exact data attributes.
- `all` mode to return an array.

```javascript
const root = this.shadowRoot;

const button = $.query(root, 'button', {
    attributes: {
        type: 'button'
    },
    data: {
        action: 'save'
    }
});
```

Equivalent to:

```javascript
root.querySelector('button[type="button"][data-action="save"]');
```

To get all matching results:

```javascript
const items = $.query(root, '.item', {
    data: { selected: 'true' },
    all: true
});

items.forEach((item) => {
    item.classList.add('is-visible');
});
```

---

## Styles

### `StyleCollection`

`StyleCollection` stores unique values and lets you define a `validator` and a `mapper`. It is the base collection used by the internal style helpers.

```javascript
import { StyleCollection } from '@components-1812/utils/styles/index.js';

const links = new StyleCollection({
    validator: (value) => URL.canParse(value, document.baseURI),
    mapper: (value) => new URL(value, document.baseURI).href
});

links.add('./theme.css', './layout.css', './theme.css');

links.size; // 2
links.has(new URL('./theme.css', document.baseURI).href); // true
links.toArray(); // normalized URLs

for (const href of links) {
    console.log(href);
}

links.clear();
```

### `ComponentStyleSheets` and `ComponentStyles`

`ComponentStyleSheets` groups styles that can later be used by `ComponentStyles` inside a component.

```javascript
import { ComponentStyleSheets, ComponentStyles } from '@components-1812/utils/styles/index.js';

const sheet = new CSSStyleSheet();
sheet.replaceSync(':host { display: block; }');

const sharedStyles = new ComponentStyleSheets({
    raw: `
        .box {
            inline-size: 100%;
            block-size: 100%;
        }
    `,
    links: ['./theme.css'],
    adopted: [sheet]
});
```

Inside a Custom Element:

```javascript
this.attachShadow({ mode: 'open' });

this.componentStyles = new ComponentStyles(this, this.constructor.styleSheets);
this.componentStyles.apply();
```

When `link rel="stylesheet"` resources finish loading, `ComponentStyles`:

- Dispatches the `ready-links` event.
- Adds the `ready-links` attribute to the element.

```javascript
this.addEventListener('ready-links', (event) => {
    console.log(event.detail.results);
});
```

---

## Recommended Web Component Pattern

The proposed pattern separates each component into two classes:

1. **Base class**: defines defaults, Custom Element registration, and public properties synchronized with attributes.
2. **Final class**: manages `shadowRoot`, styles, lifecycle, internal state, and rendering.

The advantage is that the component API stays isolated from its visual representation. The base class explains how the component is used; the final class explains how it is rendered and how it reacts.

### 1. Base class: API, defaults, and registration

```javascript
import Attr from '@components-1812/utils/attributes/index.js';
import { ComponentStyleSheets } from '@components-1812/utils/styles/index.js';

export class CounterButtonBase extends HTMLElement {

    static VERSION = '0.0.0';
    static DEFAULT_TAG_NAME = 'counter-button';

    static defaults = {
        count: 0,
        label: 'Clicks',
        disabled: false,
        color: 'royalblue'
    };

    static styleSheets = null;

    static define(tagName = this.DEFAULT_TAG_NAME, styleSheets = {}) {
        if (window.customElements.get(tagName)) {
            console.warn(`Custom element with tag name "${tagName}" is already defined.`);
            return;
        }

        this.styleSheets = new ComponentStyleSheets(styleSheets);
        window.customElements.define(tagName, this);
    }

    get count() {
        return Attr.number.get(this, 'count', this.constructor.defaults.count);
    }

    set count(value) {
        Attr.number.set(this, 'count', value, {
            validate: (count) => count >= 0
        });
    }

    get label() {
        return Attr.string.get(this, 'label', this.constructor.defaults.label);
    }

    set label(value) {
        Attr.string.set(this, 'label', value, {
            validate: (label) => label.length > 0
        });
    }

    get disabled() {
        return Attr.boolean.get(this, 'disabled', this.constructor.defaults.disabled);
    }

    set disabled(value) {
        Attr.boolean.set(this, 'disabled', value);
    }

    get color() {
        return Attr.color.get(this, 'color', Attr.color.parseColor(this.constructor.defaults.color));
    }

    set color(value) {
        Attr.color.set(this, 'color', value);
    }
}
```

### 2. Final class: rendering, events, and state

```javascript
import { ComponentUtils as $ } from '@components-1812/utils/component/index.js';
import { ComponentStyles } from '@components-1812/utils/styles/index.js';
import { CounterButtonBase } from './CounterButtonBase.js';

export class CounterButton extends CounterButtonBase {

    static observedAttributes = ['count', 'label', 'disabled', 'color'];

    #connected = false;

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.componentStyles = new ComponentStyles(this, this.constructor.styleSheets);
        this.componentStyles.apply();
    }

    connectedCallback() {
        this.#connected = true;
        this.render();
    }

    disconnectedCallback() {
        this.#connected = false;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.#connected && oldValue !== newValue) {
            this.render();
        }
    }

    increment() {
        if (this.disabled) return;

        this.count += 1;

        this.dispatchEvent(new CustomEvent('counter-change', {
            detail: { count: this.count },
            bubbles: true,
            composed: true
        }));
    }

    render() {
        let button = $.query(this.shadowRoot, 'button', {
            data: { role: 'counter' }
        });

        if (!button) {
            button = $.create.html('button', {
                attributes: { type: 'button' },
                data: { role: 'counter' }
            });

            button.addEventListener('click', () => this.increment());
            this.shadowRoot.append(button);
        }

        button.disabled = this.disabled;
        button.style.setProperty('--counter-color', this.color.hex);
        button.textContent = `${this.label}: ${this.count}`;
    }
}
```

### 3. Definition and usage

```javascript
import { CounterButton } from './CounterButton.js';

CounterButton.define('counter-button', {
    raw: `
        button {
            color: white;
            border: 0;
            border-radius: 6px;
            padding: 0.65rem 0.9rem;
            background: var(--counter-color, royalblue);
            cursor: pointer;
        }

        button:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }
    `
});
```

```html
<counter-button count="3" label="Likes" color="#1c89bf"></counter-button>
```

```javascript
const counter = document.querySelector('counter-button');

counter.addEventListener('counter-change', (event) => {
    console.log(event.detail.count);
});

counter.count = 10;
counter.disabled = false;
```
