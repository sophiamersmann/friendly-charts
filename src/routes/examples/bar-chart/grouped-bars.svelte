<script lang="ts">
	import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale';
	import { max, range, groups } from 'd3-array';
	import { schemeSpectral } from 'd3-scale-chromatic';
	import { format } from 'd3-format';

	import * as friendly from '$lib/friendly-charts';
	import locale from '$lib/friendly-charts/locale/en-US.json';

	import { px, translate } from '$lib/utils';
	import stateAges from './state-ages.json';

	type Age = Exclude<keyof typeof stateAges[0], 'name'>;

	let width = 0;
	const height = 400;
	const margin = {
		top: 20,
		right: 0,
		bottom: 20,
		left: 10
	};
	$: boundedWidth = width - margin.left - margin.right;
	$: boundedHeight = height - margin.top - margin.bottom;

	const ages = Object.keys(stateAges[0]).filter((key) => key !== 'name') as Age[];

	$: flatStateAges = ages.flatMap((age) =>
		stateAges.map((d) => ({ state: d.name, age, population: d[age] }))
	);

	$: states = stateAges.map((d) => d.name);

	$: maxPopulation = max(flatStateAges, (d) => d.population / 1e6) as number;

	$: x = scaleBand(states, [0, boundedWidth]).paddingInner(0.2).paddingOuter(0.1);
	$: z = scaleBand(ages, [0, x.bandwidth()]).padding(0.1);
	$: y = scaleLinear([0, maxPopulation], [boundedHeight, 0]);

	$: color = scaleOrdinal(ages, schemeSpectral[ages.length]);

	$: data = groups(
		flatStateAges.filter((d) => states.includes(d.state)),
		(d) => d.state
	);
</script>

<div
	class="chart"
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle',
		locale
	}}
>
	<hgroup>
		<h2 class="title">California has the highest population</h2>

		<p class="subtitle">Population in millions in California, Texas and Florida by age</p>
	</hgroup>

	<div>TODO: Legend</div>

	<div class="svg-wrapper" bind:clientWidth={width} style:height={px(height)}>
		{#if width}
			<svg {width} {height} viewBox={[0, 0, width, height].join(' ')}>
				<g transform={translate([margin.left, margin.top])}>
					<g
						class="axis-y"
						use:friendly.axis={{
							label: 'Population in millions',
							direction: 'y',
							ticks: '.tick text'
						}}
					>
						{#each range(0, Math.ceil(maxPopulation)) as population}
							<g class="tick" transform={translate([0, y(population)])}>
								<line x1={x.range()[0]} x2={x.range()[1]} />
								<text dx={-4}>{population}</text>
							</g>
						{/each}

						<text class="label" x={-margin.left} dy={-margin.top}>Population (millions)</text>
					</g>

					<g class="shapes">
						{#each data as [state, _data], i (state)}
							<g class="bar-group" use:friendly.group={{ label: state, position: i }}>
								{#each _data as d, j}
									<rect
										width={z.bandwidth()}
										height={y(0) - y(d.population / 1e6)}
										x={x(d.state) + z(d.age)}
										y={y(d.population / 1e6)}
										fill={color(d.age)}
										use:friendly.symbol={{
											type: 'bar',
											label: `${d.age}, ${format('.1f')(d.population / 1e6)} millions`,
											position: j
										}}
									/>
								{/each}
							</g>
						{/each}
					</g>

					<g
						class="axis-x"
						transform={translate([0, boundedHeight])}
						use:friendly.axis={{ label: 'States', direction: 'x', ticks: '.tick text' }}
					>
						<line class="zero-line" x1={x.range()[0]} x2={x.range()[1]} />

						{#each states as state (state)}
							<g class="tick" transform={translate([x(state) + x.bandwidth() / 2, 0])}>
								<line y2="4" />
								<text dy="1em" transform={translate([0, 4 + 2])}>
									{state}
								</text>
							</g>
						{/each}
					</g>
				</g>
			</svg>
		{/if}
	</div>

	<div class="source">
		Data from https://observablehq.com/@d3/grouped-bar-chart?collection=@d3/charts
	</div>
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
