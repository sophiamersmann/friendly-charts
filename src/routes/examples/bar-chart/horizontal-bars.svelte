<script lang="ts">
	import { scaleLinear } from 'd3-scale';
	import { descending, max } from 'd3-array';
	import { format } from 'd3-format';

	import * as friendly from '$lib/friendly-charts';

	import _alphabet from './alphabet.json';

	let alphabet = _alphabet;
	$: {
		alphabet.sort((a, b) => descending(a.frequency, b.frequency));
		alphabet = alphabet.slice(0, 3);
	}

	let width = 0;
	const marginRight = 45;

	$: maxFreq = max(alphabet, (d) => d.frequency) as number;

	$: x = scaleLinear()
		.domain([0, maxFreq])
		.range([0, width - marginRight]);
</script>

<div
	class="wrapper"
	bind:clientWidth={width}
	use:friendly.chart={{
		title: 'The letter E is used most frequently, followed by T and A',
		subtitle: 'Relative frequency of letters in the English language'
	}}
>
	<div
		use:friendly.visual={{
			axes: [
				{ label: 'Letters', direction: 'y', ticks: alphabet.map((d) => d.letter) },
				{ label: 'Frequency', direction: 'x', ticks: alphabet.map((d) => d.frequency) }
			]
		}}
	>
		{#if width}
			{#each alphabet as { letter, frequency }, i (letter)}
				<div class="unit">
					<div class="label">Letter {letter}</div>
					<div
						class="annotated-bar"
						use:friendly.symbol={{
							type: 'bar',
							label: '.annotation',
							position: i
						}}
					>
						<div class="bar" style:width="{x(frequency)}px" />
						<div class="annotation">{format('.1%')(frequency)}</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	.wrapper {
		--c-accent: var(--c-blue-300);
		font-size: var(--font-size-sm);
	}

	.label {
		font-weight: var(--font-weight-bold);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		fill: var(--c-chart-tick);
	}

	.unit {
		margin: 10px 0;
	}

	.label {
		font-weight: bold;
	}

	.annotated-bar {
		display: flex;
		align-items: center;
	}

	.bar {
		display: inline-block;
		height: 1em;
		background-color: var(--c-ui-accent-blue);
	}

	.annotation {
		margin-left: 4px;
		font-weight: var(--font-weight-regular);
		font-size: var(--font-size-xs);
		line-height: var(--line-height-3xs);
		fill: var(--c-chart-tick);
	}
</style>
