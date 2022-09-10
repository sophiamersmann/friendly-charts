<!--
	@component
	Generates an HTML y-axis.

	From: https://layercake.graphics/ (MIT)
 -->
<script>
	import { getContext } from 'svelte';
	import * as friendly from 'friendly-charts';

	const { padding, xRange, yScale } = getContext('LayerCake');

	/** @type {String} - The axis' label */
	export let label;

	/** @type {Boolean} [showLabel=true] - Show label */
	export let showLabel = true;

	/** @type {Boolean} [gridlines=false] - Extend lines from the ticks into the chart space */
	export let gridlines = false;

	/** @type {Boolean} [tickMarks=false] - Show a vertical mark for each tick. */
	export let tickMarks = false;

	/** @type {Number|Array|Function} [ticks=4] - If this is a number, it passes that along to the [d3Scale.ticks](https://github.com/d3/d3-scale) function. If this is an array, hardcodes the ticks to those values. If it's a function, passes along the default tick values and expects an array of tick values in return. */
	export let ticks = 4;

	/** @type {Number} [xTick=0] - How far over to position the text marker. */
	export let xTick = 0;

	/** @type {Number} [yTick=0] - How far up and down to position the text marker. */
	export let yTick = 0;

	/** @type {Number} [dxTick=0] - Any optional value passed to the `dx` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal. */
	export let dxTick = 0;

	/** @type {Number} [dyTick=-4] - Any optional value passed to the `dy` attribute on the text marker and tick mark (if visible). This is ignored on the text marker if your scale is ordinal. */
	export let dyTick = -4;

	/** @type {String} [textAnchor='start'] The CSS `text-anchor` passed to the label. This is automatically set to "end" if the scale has a bandwidth method, like in ordinal scales. */
	export let textAnchor = 'start';

	$: isBandwidth = typeof $yScale.bandwidth === 'function';

	$: tickVals = Array.isArray(ticks)
		? ticks
		: isBandwidth
		? $yScale.domain()
		: typeof ticks === 'function'
		? ticks($yScale.ticks())
		: $yScale.ticks(ticks);
</script>

<g
	class="axis y-axis"
	transform="translate({-$padding.left}, 0)"
	use:friendly.axis={{
		label,
		direction: 'y',
		ticks: '.tick text',
	}}
>
	{#each tickVals as tick, i (tick)}
		<g
			class="tick tick-{tick}"
			transform="translate({$xRange[0] +
				(isBandwidth ? $padding.left : 0)}, {$yScale(tick)})"
		>
			{#if gridlines}
				<line
					class="gridline"
					x2="100%"
					y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
					y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				/>
			{/if}
			{#if tickMarks}
				<line
					class="tick-mark"
					x1="0"
					x2={isBandwidth ? -6 : 6}
					y1={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
					y2={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				/>
			{/if}
			<text
				x={xTick}
				y={yTick + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}
				dx={isBandwidth ? -9 : dxTick}
				dy={isBandwidth ? 4 : dyTick}
				style="text-anchor:{isBandwidth ? 'end' : textAnchor};"
			>
				<slot {tick} index={i} />
			</text>
		</g>
	{/each}
	{#if showLabel}
		<text class="label" y={-$padding.top}>
			↑ {label}
		</text>
	{/if}
</g>

<style>
	.label {
		font-size: 0.725em;
		fill: #4d4d4d;
	}

	.tick {
		font-size: 0.725em;
		font-weight: 200;
	}

	.tick line {
		stroke: #aaa;
	}
	.tick .gridline {
		stroke-dasharray: 2;
	}

	.tick text {
		fill: #666;
	}

	.tick.tick-0 line {
		stroke-dasharray: 0;
	}
</style>
