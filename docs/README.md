js-curling-scoreboard / [Exports](modules.md)

# js-curling-scoreboard

A standalone, dependency-free JavaScript module for rendering a curling scoreboard. This package supports club-style, baseball-style, and simple scoreboard layouts.

![image](https://user-images.githubusercontent.com/397836/120390207-6d398c80-c2fb-11eb-852c-b0def31e3c15.png)

![image](https://user-images.githubusercontent.com/397836/120390399-a70a9300-c2fb-11eb-9bda-720405a0f5cf.png)

## Usage

For API documentation, see [API Docs](docs/modules.md).

To show a scoreboard, you need at minimum a container (any `HTMLElement`) and a `GameState`.

Here's a minimal example:

```ts
const container = document.getElementById("scoreboardContainer");
scoreboard.render(container, {ends: []});
```

For a more full-featured example, open the file `index.html` in a browser.

### Distribution

In the `dist/` folder you will find both unminified and minified scripts.

### Module format

The output file is a UMD JavaScript module. You can import this with most bundlers or module loaders. Or, you can directly load it in a `<script>` tag, which will generate a global variable called `scoreboard` exposing all of the module's exports. See `index.html` for an example.
