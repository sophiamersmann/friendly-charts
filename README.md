# Friendly Charts

Screen reader friendly charts with minimal effort

## Install

```bash
npm install friendly-charts
```

> **Warning**
>
> Under construction

## Features

You ✨ bring your own chart ✨ and Friendly Charts will:

- expose a chart description to screen readers
- make your chart keyboard accessible, allowing screen reader users to explore charts via keyboard interactions

Friendly Charts exports a number of functions that expect a DOM element as input. Friendly Charts is framework agnostic but in Svelte and Solid, for example, the exported functions can be applied as use directives/actions.

The interaction design for keyboard accessible charts is borrowed from [Visa Chart Components](https://developer.visa.com/pages/chart-components):

- _TAB_ to the chart area
- _ENTER_ to drill down a level
- _ESCAPE_ to drill up a level
- _LEFT_ and _RIGHT_ arrows to move between sibling elements
- _UP_ and _DOWN_ arrows to move across groups

https://user-images.githubusercontent.com/12461810/191855514-5c5db343-8b8c-48e2-8829-bf7314938def.mov

## Example

To make a chart friendly, apply the `chart` function to a container element, providing a chart title, subtitle and description. To make the chart keyboard accessible, use the `axis`, `symbol` and `group` functions to outline the chart's structure and provide accessible names. Friendly charts will then wire up the necessary focus and event management to let a screen reader user navigate the chart via keyboard interactions.

Bar chart (Svelte):

```svelte
<script>
  import * as friendly from 'friendly-charts';
  import locale from 'friendly-charts/locale/en-US.json';

  // data
  const data = [
    { category: "A", value: 82 },
    { category: "B", value: 50 },
    { category: "C", value: 10 }
  ];

  // dimensions
  const width = 300;
  const height = 100;
  const padding = { top: 0, right: 0, bottom: 20, left: 20 };
  const boundedWidth = width - padding.left - padding.right;
  const boundedHeight = height - padding.top - padding.bottom;
  const barHeight = 14;

  // x and y coordinates
  const maxValue = Math.max(...data.map((d) => d.value));
  const spacing = (boundedHeight - data.length * barHeight) / (data.length + 1);
  const getX = value => value * (boundedWidth / maxValue);
  const getY = index => index * barHeight + (index + 1) * spacing;
</script>

<!-- FRIENDLY ACTION: declare a chart and link to its title and subtitle -->
<div use:friendly.chart={{ title: '.title', subtitle: '.subtitle', type: 'bar', locale }} >
  <!-- title and subtitle -->
  <hgroup>
    <h2 class="title"> Chart title </h2>
    <p class="subtitle"> Chart subtitle </p>
  </hgroup>

  <svg {width} {height}>
    <g style:transform="translate({padding.left}px, {padding.top}px)">

      <!-- FRIENDLY ACTION: declare the x-axis, give it a label and link to its ticks -->
      <g use:friendly.axis={{ label: 'Axis label', direction: 'x', ticks: '.tick text' }}>
        {#each [0, 20, 40, 60, 80] as tick (tick)}
          <g class="tick" transform="translate({getX(tick)},{boundedHeight})">
            <!-- grid line -->
            <line y1={-boundedHeight} stroke="lightgray" />
            <!-- tick label -->
            <text fill="gray"> {tick} </text>
          </g>
        {/each}
      </g>

      <!-- bars -->
      <g>
        {#each data as d, i (d.category)}
          <g class="bar" transform="translate(0,{getY(i)})">

            <!-- FRIENDLY ACTION: declare a bar and give it an accessible label -->
            <rect use:friendly.symbol={{ label: `${d.category}. ${d.value}`, type: 'bar', position: i }} width={getX(d.value)} height={barHeight} fill="#0284c7" />

            <!-- label -->
            <text y="0.75em"> {d.category} </text>
          </g>
        {/each}
      </g>

    <g>
  </svg>
</div>

<style>
	* {
		margin: 0;
	}

	hgroup {
		margin-bottom: 8px;
	}

	hgroup h2 {
		font-size: 1.25rem;
	}

	.tick text {
		font-size: 0.8rem;
		transform: translateY(1em);
		text-anchor: middle;
	}

	.bar text {
		transform: translateX(-5px);
		text-anchor: end;
		font-weight: bold;
	}
</style>
```

CodeSandbox: https://codesandbox.io/s/friendly-tiny-bar-chart-10weeu?file=/App.svelte

## Documentation

Exported are:

- `chart`: exposes a chart description and makes the chart keyboard accessible
- `axis`: declares an axis
- `symbol`: declares a symbol (e.g. a single bar)
- `group`: declares a group of symbols (e.g. bars of the same category)
- `focus`: custom focus ring to highlight active elements on navigation (only needed to override default styles)

### `chart(node, options)`

_Exposes a chart description and makes the chart keyboard accessible_

**Examples:**

```js
import { chart } from 'friendly-charts';
import locale from 'friendly-charts/locale/en-US.json';

// minimal configuration
chart(node, {
	title: 'Chart title',
	subtitle: 'Chart subtitle',
	type: 'bar',
	locale,
});

// .title and .subtitle are selectors that point to elements within the chart container
chart(node, { title: '.title', subtitle: '.subtitle', type: 'bar', locale });

// debug mode
chart(node, {
	title: 'Chart title',
	subtitle: 'Chart subtitle',
	type: 'bar',
	locale,
	debug: true,
});
```

**Options:**

- `title` **(required)**: chart title, either the title itself or a selector that points to an element within the chart container
- `subtitle` **(required)**: chart subtitle, either the subtitle itself or a selector that points to an element within the chart container
- `type` (**required**; `'line'`, `'bar'` or `'scatter'`): chart type
- `locale` **(required)**: locale, usually imported from Friendly Charts, but you can bring your own
- `summary`: brief summary of the chart, either the summary itself or a selector that points to an element within the chart container
- `purpose`: an explanation of the chart's purpose, either the explanation itself or a selector that points to an element within the chart container
- `description`: long description of the chart, either the description itself or a selector that points to an element within the chart container
- `axes`: list of axis descriptions (see Section [axis](#axisnode-options)), only needed if an axis is not visually present in the chart
- `debug` (default: `false`): display an overlay that shows what a screen reader would announce on interaction with the chart

### `axis(node, options)`

_Declares an axis_

**Examples:**

```js
import { axis } from 'friendly-charts';

// minimal configuration
axis(node, { label: 'Axis label' });

// .label is a selector that points to a descendant of `node`
axis(node, { label: '.label' });

// specify a direction
axis(node, { label: 'Axis label', direction: 'x' });

// infer ticks from the DOM by specifying a selector
axis(node, { label: 'Axis label', direction: 'y', ticks: '.tick text' });

// specify ticks manually
axis(node, { label: 'Axis label', direction: 'y', ticks: [0, 2, 4, 6] });
```

**Options:**

- `label` **(required)**: axis label, either the label itself or a selector that points to a descendant of `node`
- `direction` (`'x'` or `'y'`): axis direction
- `ticks`: either a list of ticks or a selector that points to the tick labels (must be descendants of `node`)

### `symbol(node, options)`

_Declares a symbol (e.g. a single bar)_

**Examples:**

```js
import { symbol } from 'friendly-charts';

// line
symbol(node, { label: 'Symbol label', type: 'line', position: 0 });

// bar
symbol(node, { label: 'Symbol label', type: 'bar', position: 0 });

// add additional description to highlight the symbol
symbol(node, {
	label: 'Symbol label',
	type: 'line',
	position: 0,
	highlight: 'Some interesting remark to highlight this line',
});

// symbol contained within a group with id `some-unique-group-id`
// (only necessary if the symbol is not nested within that group)
symbol(node, {
	label: 'Symbol label',
	type: 'point',
	position: 0,
	parentId: 'some-unique-group-id',
});
```

**Options:**

- `label` **(required)**: symbol label, either the label itself or a selector that points to the label element
- `type` (**required**; `'line'`, `'bar'` or `'point'`): symbol type
- `position` **(required)**: position of the symbol among sibling symbols, determines the order on LEFT/RIGHT navigation
- `id`: symbol id (automatically generated if not given)
- `parentId`: id of the group that contains the symbol, only needed if the symbol is not a descendant of the group element
- `highlight`: additional description to highlight the symbol (e.g. could be used to describe its significance within the chart)

### `group(node, options)`

_Declares a group of symbols (e.g. bars of the same category)_

**Examples:**

```js
import { group } from 'friendly-charts';

// minimal configuration
group(node, { label: 'Group label', position: 0 });

// a group that also represents a symbol of type line (e.g. a line that contains the points it is made of)
group(node, {
	label: 'Group label',
	position: 0,
	id: 'unique-group-id',
	type: 'line',
});
```

**Options:**

- `label` **(required)**: group label, either the label itself or a selector that points to a descendant of `node`
- `position` **(required)**: position of the group among sibling groups, determines the order on LEFT/RIGHT navigation
- `id`: group id (automatically generated if not given)
- `type` (`'line'`, `'bar'` or `'point'`): some groups also represent a symbol of some type (e.g. a line that contains the points it is made of)
- `highlight`: additional group description, could be used to describe a trend or the importance of the group within the chart

### `focus(node)`

_Focus ring to highlight active elements on navigation (only needed to override default styles)_

**Examples:**

```js
import { focus } from 'friendly-charts';

// the given element will be used as focus ring
focus(node);
```
