<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleBand } from 'd3-scale';
	import { descending } from 'd3-array';

	import * as friendly from 'friendly-charts';
	import locale from 'friendly-charts/locale/en-US.json';

	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	import Column from './Column.svelte';

	import alphabet from './alphabet';

	$: sortedAlphabet = alphabet.sort((a, b) =>
		descending(a.frequency, b.frequency)
	);
</script>

<div
	class="chart-container"
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle',
		locale,
	}}
>
	<hgroup>
		<h2 class="title">
			The letter E is used most frequently, followed by T and A
		</h2>

		<p class="subtitle">
			Relative frequency of letters in the English language
		</p>
	</hgroup>

	<LayerCake
		padding={{
			top: 10,
			right: 0,
			bottom: 30,
			left: 30,
		}}
		x="letter"
		y="frequency"
		xScale={scaleBand().paddingInner(0.1)}
		yDomain={[0, null]}
		data={sortedAlphabet}
	>
		<Svg>
			<AxisX label="Letter" showLabel={false} let:tick let:index>
				<tspan style:font-weight={index < 3 ? 'bold' : 'normal'}>{tick}</tspan>
			</AxisX>
			<AxisY label="Frequency" gridlines let:tick>
				{tick}
			</AxisY>

			{#each sortedAlphabet as d, i}
				<Column
					index={i}
					label="Letter {d.letter}. {Math.round(d.frequency * 100 * 10) / 10}%"
					fill="#0284c7"
					opacity={0.8}
				/>
			{/each}
		</Svg>
	</LayerCake>

	<div class="source">
		Data from
		<a href="https://observablehq.com/@d3/bar-chart">
			https://observablehq.com/@d3/bar-chart
		</a>
	</div>
</div>

<style>
	.chart-container {
		width: 100%;
		max-width: 600px;
		height: 400px;
		margin: 0 auto;
	}

	.source {
		font-size: 0.8rem;
		color: #666;
	}
</style>
