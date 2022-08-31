<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { range } from 'd3-array';
	import { line as d3line } from 'd3-shape';

	import Arrow from '$lib/BezierArrow.svelte';
	import Table from '$lib/Table.svelte';
	import VisuallyHidden from '$lib/VisuallyHidden.svelte';

	import * as friendly from '$lib/friendly-charts';
	import locale from '$lib/friendly-charts/locale/de-DE.json';

	import { px, translate } from '$lib/utils';
	import * as tokens from '$lib/tokens';

	import type { Coordinates, TableColumn } from 'src/types';

	const data = [
		{ month: 1, rain: 30, rainAvg: 9 },
		{ month: 2, rain: 25, rainAvg: 8 },
		{ month: 3, rain: 1, rainAvg: 2 },
		{ month: 4, rain: 27, rainAvg: 14 },
		{ month: 5, rain: 27, rainAvg: 13 },
		{ month: 6, rain: 61, rainAvg: 17 },
		{ month: 7, rain: 42, rainAvg: 11 },
		{ month: 8, rain: 54, rainAvg: 22 },
		{ month: 9, rain: 103, rainAvg: 8 },
		{ month: 10, rain: 23, rainAvg: 4 },
		{ month: 11, rain: 26, rainAvg: 4 },
		{ month: 12, rain: 63, rainAvg: 8 }
	];
	const dLast = data[data.length - 1];
	const dHighlight = data[8];

	let width = 0;
	const height = 400;
	const margin = {
		top: tokens.sPx5,
		right: 25,
		bottom: tokens.sPx6,
		left: 25
	};
	$: boundedWidth = width - margin.left - margin.right;
	$: boundedHeight = height - margin.top - margin.bottom;

	$: x = scaleLinear().domain([0, 13]).range([0, boundedWidth]);
	$: y = scaleLinear().domain([0, 100]).range([boundedHeight, 0]);

	let tableColumns: TableColumn<typeof data[0]>[];
	$: tableColumns = [
		{ name: 'Monat', getValue: (d) => d.month },
		{ name: 'Regenmenge 2021 (in l/qm)', getValue: (d) => d.rain },
		{ name: 'Regenmenge 2000-2020 (in l/qm)', getValue: (d) => d.rainAvg }
	];

	const xTicks = range(1, 13);
	const xTickLabels = new Map([
		[1, 'Januar'],
		[12, 'Dezember']
	]);
	const xTickLength = tokens.sPx2;
	const xTickLabelPadding = tokens.sPx1;

	const grid = range(0, 112.5, 12.5);
	const yTickLabels = range(0, 125, 25);
	const yTickLabelPadding = tokens.sPx1;

	const summer = [6, 9];

	$: lineRain = d3line<typeof data[0]>()
		.x((d) => x(d.month))
		.y((d) => y(d.rain));

	$: lineRainAvg = d3line<typeof data[0]>()
		.x((d) => x(d.month))
		.y((d) => y(d.rainAvg));

	const annotationOffset = [-tokens.sPx6, tokens.sPx6];
	const annotationLength = 110;

	function computeArrowCoords(
		dataPoint: Coordinates,
		labelPoint: Coordinates
	): {
		start: Coordinates;
		end: Coordinates;
		startHandleOffset: Coordinates;
		endHandleOffset: Coordinates;
	} {
		const start = labelPoint;
		const end = [dataPoint[0] - tokens.sPx2, dataPoint[1]] as Coordinates;

		const xLen = end[0] - start[0];
		const yLen = start[1] - end[1];

		return {
			start,
			end,
			startHandleOffset: [0.05 * xLen, -0.6 * yLen],
			endHandleOffset: [-0.8 * xLen, 0]
		};
	}
</script>

<svelte:head>
	<title>Liniendiagramm: Diesjähriger Niederschlag im Sommer deutlich höher als üblich</title>
</svelte:head>

<div
	class="chart"
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle',
		description: [
			'Der Chart zeigt ein Diagramm mit zwei Linien. Die erste Linie zeigt den monatlichen',
			'Niederschlag in Liter pro Quadratmeter 2021 in Berlin. Die Regenmenge steigt in den',
			'Sommermonaten 2021 deutlich an und erreicht einen Höchststand von 103 Liter pro',
			'Quadratmeter im September. Das ist deutlich höher als die durchschnittliche Regenmenge in',
			'den Sommermonaten der letzten zehn Jahre. In diesem Zeitraum has es auch in den',
			'Sommermonaten durchschnittlich nie mehr als 25 Liter pro Quadratmeter geregnet.'
		].join(' '),
		locale
	}}
>
	<hgroup>
		<h2 class="title">Diesjähriger Niederschlag im Sommer deutlich höher als üblich</h2>

		<p class="subtitle">
			Monatliche Regenmenge in Liter pro Quadratmeter 2021 im Vergleich zum Durchschnitt der Jahre
			2000 - 2020 in Berlin.
		</p>
	</hgroup>

	<div class="svg-wrapper" bind:clientWidth={width} style:height={px(height)}>
		{#if width}
			<svg {width} {height} viewBox={[0, 0, width, height].join(' ')}>
				<g transform={translate([margin.left, margin.top])}>
					<g class="summer-highlight">
						<rect
							x={x(summer[0])}
							y={-margin.top}
							width={x(summer[1]) - x(summer[0])}
							height={boundedHeight + margin.top}
						/>
						<text
							x={x(summer[0]) + (x(summer[1]) - x(summer[0])) / 2}
							y={boundedHeight}
							dy={-tokens.sPx2}
						>
							Sommer
						</text>
					</g>

					<g class="axis-y">
						{#each grid as gridValue}
							<g class="tick" transform={translate([0, y(gridValue)])}>
								<line x1={x.range()[0]} x2={x.range()[1]} />
								{#if yTickLabels.includes(gridValue)}
									<text dx={-yTickLabelPadding}>{gridValue}</text>
								{/if}
							</g>
						{/each}

						<text class="label" x={-margin.left} dy={-margin.top}> Regen in l/qm </text>
					</g>

					<g class="axis-x" transform={translate([0, boundedHeight])}>
						<line class="zero-line" x1={x.range()[0]} x2={x.range()[1]} />

						{#each xTicks as tick}
							<g class="tick" transform={translate([x(tick), 0])}>
								<line y2={xTickLength} stroke="green" />
								{#if xTickLabels.has(tick)}
									<text dy="1em" transform={translate([0, xTickLength + xTickLabelPadding])}>
										{xTickLabels.get(tick)}
									</text>
								{/if}
							</g>
						{/each}
					</g>

					<g class="shapes">
						<g class="rain rain-avg">
							<path d={lineRainAvg(data)} />
							<text x={x(dLast.month)} dx={tokens.sPx2} y={y(dLast.rainAvg)} dy="-1em">
								2000
								<tspan x={x(dLast.month)} dx={tokens.sPx2} dy="1em">bis</tspan>
								<tspan x={x(dLast.month)} dx={tokens.sPx2} dy="1em"> 2020 </tspan>
							</text>
						</g>
						<g class="rain rain-2021">
							<path d={lineRain(data)} />
							<text x={x(dLast.month)} y={y(dLast.rain)} dx={tokens.sPx2}> 2021 </text>
						</g>
					</g>

					<g
						class="annotation"
						transform={translate([-annotationLength + annotationOffset[0], annotationOffset[1]])}
					>
						<text x={x(dHighlight.month)} y={y(dHighlight.rain)}>
							September war der
							<tspan x={x(dHighlight.month)} dy="1.15em"> regenreichste Monat </tspan>
						</text>
					</g>

					<Arrow
						class="arrow"
						{...computeArrowCoords(
							[x(dHighlight.month), y(dHighlight.rain)],
							[
								x(dHighlight.month) + annotationOffset[0] - annotationLength / 4,
								y(dHighlight.rain) + annotationOffset[1] / 2
							]
						)}
						color={tokens.cChartAnnotation}
					/>
				</g>
			</svg>
		{/if}
	</div>

	<div class="source">Quelle: Ausgedachte Daten</div>
</div>

<VisuallyHidden>
	<Table
		{data}
		columns={tableColumns}
		caption="Monatliche Regenmenge in Liter pro Quadratmeter in Berlin"
		class="visually-hidden"
	/>
</VisuallyHidden>

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

	.summer-highlight rect {
		fill: var(--c-chart-area);
	}

	.summer-highlight text {
		text-anchor: middle;
		font-style: italic;
		fill: var(--c-ui-gray-400);
	}

	.shapes path {
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.shapes .rain text {
		font-weight: var(--font-weight-bold);
	}

	.shapes .rain-2021 path {
		stroke-width: 4;
		stroke: var(--c-accent);
	}

	.shapes .rain-2021 text {
		dominant-baseline: middle;
		fill: var(--c-accent);
	}

	.shapes .rain-avg path {
		stroke-width: 2;
		stroke: var(--c-beige-400);
		stroke-dasharray: 2 4;
	}

	.shapes .rain-avg text {
		fill: var(--c-beige-400);
	}

	.annotation text {
		font-family: Georgia, serif;
		font-style: italic;
		font-size: var(--font-size-xs);
		line-height: var(--line-height-2xs);
		color: var(--c-chart-annotation);
		fill: var(--c-chart-annotation);
	}

	.tick text {
		font-weight: var(--font-weight-regular);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		fill: var(--c-chart-tick);
	}
</style>
