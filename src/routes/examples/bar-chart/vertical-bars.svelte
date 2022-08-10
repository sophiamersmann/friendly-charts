<script lang="ts">
	import { scaleBand, scaleLinear } from 'd3-scale';
	import { descending, max, range, ticks } from 'd3-array';

	import * as friendly from '$lib/friendly-charts';

	import { px, translate } from '$lib/utils';
	import _alphabet from './alphabet.json';

	let alphabet = _alphabet;
	$: {
		alphabet.sort((a, b) => descending(a.frequency, b.frequency));
		alphabet = alphabet;
	}

	let width = 0;
	const height = 400;
	const margin = {
		top: 20,
		right: 0,
		bottom: 20,
		left: 25
	};
	$: boundedWidth = width - margin.left - margin.right;
	$: boundedHeight = height - margin.top - margin.bottom;

	$: maxFreq = max(alphabet, (d) => d.frequency) as number;

	$: x = scaleBand()
		.domain(alphabet.map((d) => d.letter))
		.range([0, boundedWidth])
		.padding(0.1);
	$: y = scaleLinear().domain([0, maxFreq]).range([boundedHeight, 0]);
</script>

<div
	class="chart"
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle'
	}}
>
	<hgroup>
		<h2 class="title">The letter E is used most frequently</h2>

		<p class="subtitle">Relative frequency of letters in the English language</p>
	</hgroup>

	<div class="svg-wrapper" bind:clientWidth={width} style:height={px(height)}>
		{#if width}
			<svg {width} {height} viewBox={[0, 0, width, height].join(' ')} use:friendly.visual>
				<g transform={translate([margin.left, margin.top])}>
					<g
						class="axis-x"
						transform={translate([0, boundedHeight])}
						use:friendly.axis={{ label: 'Letters', direction: 'x', ticks: '.tick text' }}
					>
						<line class="zero-line" x1={x.range()[0]} x2={x.range()[1]} />

						{#each alphabet as { letter } (letter)}
							<g class="tick" transform={translate([x(letter) + x.bandwidth() / 2, 0])}>
								<line y2="4" stroke="red" />
								<text dy="1em" transform={translate([0, 4 + 2])}>
									{letter}
								</text>
							</g>
						{/each}
					</g>

					<g
						class="axis-y"
						use:friendly.axis={{ label: 'Frequency', direction: 'y', ticks: '.tick text' }}
					>
						{#each range(0, Math.ceil(maxFreq * 100)) as freq}
							<g class="tick" transform={translate([0, y(freq / 100)])}>
								<line x1={x.range()[0]} x2={x.range()[1]} />
								<text dx={-4}>{freq}%</text>
							</g>
						{/each}

						<text class="label" x={-margin.left} dy={-margin.top}>↑ Frequency</text>
					</g>

					<g class="bars">
						{#each alphabet as { letter, frequency }, i (letter)}
							<rect
								width={x.bandwidth()}
								height={y(0) - y(frequency)}
								x={x(letter)}
								y={y(frequency)}
								use:friendly.symbol={{
									type: 'bar',
									label: `Letter ${letter}. ${frequency * 100}%`,
									position: i
								}}
							/>
						{/each}
					</g>

					<g class="shapes" />
				</g>
			</svg>
		{/if}
	</div>

	<div class="source">Data from https://observablehq.com/@d3/bar-chart</div>
</div>

<style>
	svg {
		overflow: visible;
	}

	.title {
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-base);
		line-height: var(--line-height-xs);
		color: var(--c-ui-gray-500);
		margin-bottom: var(--s-px-1);
	}

	.subtitle {
		font-weight: var(--font-weight-semi-bold);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-2xs);
		color: var(--c-ui-gray-500);
		margin-bottom: var(--s-px-4);
	}

	.source {
		font-weight: var(--font-weight-semi-bold);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		color: var(--c-ui-gray-300);
		margin-top: var(--s-px-3);
	}

	.svg-wrapper {
		--c-accent: var(--c-blue-300);
		font-size: var(--font-size-sm);
	}

	.label {
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		fill: var(--c-chart-tick);
	}

	.axis-x .zero-line {
		stroke: var(--c-chart-axis);
	}

	.axis-x .tick line {
		stroke: var(--c-chart-axis);
	}

	.axis-x .tick text {
		text-anchor: middle;
	}

	.axis-y .tick line {
		stroke: var(--c-chart-grid);
		stroke-width: 0.5px;
	}

	.axis-y .tick text {
		text-anchor: end;
		dominant-baseline: middle;
	}

	.axis-y .label {
		dominant-baseline: hanging;
	}

	.bars rect {
		fill: var(--c-ui-accent-blue);
		fill-opacity: 0.8;
	}

	.tick text {
		font-weight: var(--font-weight-regular);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		fill: var(--c-chart-tick);
	}
</style>
