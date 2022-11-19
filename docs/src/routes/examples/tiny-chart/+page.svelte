<script>
	import * as friendly from 'friendly-charts';
	import locale from 'friendly-charts/locale/en-US';

	// data
	const data = [
		{ category: 'A', value: 82 },
		{ category: 'B', value: 50 },
		{ category: 'C', value: 10 },
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
	const getX = (value) => value * (boundedWidth / maxValue);
	const getY = (index) => index * barHeight + (index + 1) * spacing;
</script>

<!-- FRIENDLY ACTION: declare a chart and link to its title and subtitle -->
<div
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle',
		type: 'bar',
		locale,
	}}
>
	<!-- title and subtitle -->
	<hgroup>
		<h2 class="title">Chart title</h2>
		<p class="subtitle">Chart subtitle</p>
	</hgroup>

	<svg {width} {height}>
		<g style:transform="translate({padding.left}px, {padding.top}px)">
			<!-- FRIENDLY ACTION: declare the x-axis, give it a label and link to its ticks -->
			<g
				use:friendly.axis={{
					label: 'Axis label',
					direction: 'x',
					ticks: '.tick text',
				}}
			>
				{#each [0, 20, 40, 60, 80] as tick (tick)}
					<g class="tick" transform="translate({getX(tick)},{boundedHeight})">
						<!-- grid line -->
						<line y1={-boundedHeight} stroke="lightgray" />
						<!-- tick label -->
						<text fill="gray">
							{tick}
						</text>
					</g>
				{/each}
			</g>

			<!-- bars -->
			<g>
				{#each data as d, i (d.category)}
					<g class="bar" transform="translate(0,{getY(i)})">
						<!-- FRIENDLY ACTION: declare a bar and give it an accessible label -->
						<rect
							use:friendly.symbol={{
								label: `${d.category}. ${d.value}`,
								type: 'bar',
								position: i,
							}}
							width={getX(d.value)}
							height={barHeight}
							fill="#0284c7"
						/>

						<!-- label -->
						<text y="0.75em">
							{d.category}
						</text>
					</g>
				{/each}
			</g>

			<g /></g
		></svg
	>
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
