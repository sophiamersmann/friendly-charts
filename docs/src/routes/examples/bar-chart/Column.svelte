<!--
  @component
  Generates an SVG column chart.

	From: https://layercake.graphics/ (MIT)
 -->
<script>
	import { getContext } from 'svelte';
	import * as friendly from 'friendly-charts';

	const { data, xGet, yGet, x, yRange, xScale, y } = getContext('LayerCake');

	export let index;

	export let label;

	/** @type {String} [fill='#00e047'] - The shape's fill color. */
	export let fill = '#00e047';

	/** @type {String} [stroke='#000'] - The shape's stroke color. */
	export let stroke = '#000';

	/** @type {Number} [strokeWidth=0] - The shape's stroke width. */
	export let strokeWidth = 0;

	/** @type {Number} [opacity=1] - The shape's opacity */
	export let opacity = 1;

	$: datum = $data[index];

	$: columnWidth = (d) => {
		const vals = $xGet(d);
		return Math.abs(vals[1] - vals[0]);
	};

	$: columnHeight = (d) => {
		return $yRange[0] - $yGet(d);
	};

	$: colHeight = columnHeight(datum);
	$: xGot = $xGet(datum);
	$: xPos = Array.isArray(xGot) ? xGot[0] : xGot;
	$: colWidth = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(datum);
	$: yValue = $y(datum);
</script>

<rect
	class="column"
	data-id={index}
	data-range={$x(datum)}
	data-count={yValue}
	x={xPos}
	y={$yGet(datum)}
	width={colWidth}
	height={colHeight}
	{fill}
	{stroke}
	stroke-width={strokeWidth}
	{opacity}
	use:friendly.symbol={{
		type: 'bar',
		label,
		position: index,
	}}
/>
