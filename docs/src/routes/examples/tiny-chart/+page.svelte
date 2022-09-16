<script>
	import * as friendly from 'friendly-charts';
	import locale from 'friendly-charts/locale/en-US.json';

	// data
	const data = [
		{ category: 'A', value: 82 },
		{ category: 'B', value: 50 },
		{ category: 'C', value: 10 },
	];

	// dimensions
	const width = 480;
	const height = 100;
	const padding = { top: 0, right: 0, bottom: 20, left: 20 };
	const boundedWidth = width - padding.left - padding.right;
	const boundedHeight = height - padding.top - padding.bottom;
	const barHeight = 14;

	// x and y coordinates
	const maxValue = 82;
	const spacing = (boundedHeight - data.length * barHeight) / (data.length + 1);
	const getX = (value) => value * (boundedWidth / maxValue);
	const getY = (index) => index * barHeight + (index + 1) * spacing;
</script>

<!-- FRIENDLY ACTION: declare a chart and link to its title and subtitle -->
<div
	use:friendly.chart={{
		title: '.title',
		subtitle: '.subtitle',
		locale,
	}}
	style:background-color="white"
	style:padding="14px"
	style:width="max-content"
	style:margin="0 auto"
	style:box-shadow="0 0 6px 0px rgb(0 0 0 / 10%)"
>
	<!-- title and subtitle -->
	<hgroup style:margin-bottom="8px">
		<h2 class="title" style:margin="0" style:font-size="1.15rem">
			Chart title
		</h2>
		<p class="subtitle" style:margin="0">Chart subtitle</p>
	</hgroup>

	<svg {width} {height}>
		<g style:transform="translate({padding.left}px, {padding.top}px)">
			<!-- FRIENDLY ACTION: declare the x-axis, give it a label and link to its ticks -->
			<g
				class="axis-x"
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
						<text
							style:font-size="0.8rem"
							style:transform="translateY(1em)"
							style:text-anchor="middle"
							fill="gray"
						>
							{tick}
						</text>
					</g>
				{/each}
			</g>

			<!-- bars -->
			<g>
				{#each data as d, i (d.category)}
					<g transform="translate(0,{getY(i)})">
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
						<text
							y="0.75em"
							style:transform="translateX(-5px)"
							style:text-anchor="end"
							style:font-weight="bold"
						>
							{d.category}
						</text>
					</g>
				{/each}
			</g>

			<g /></g
		></svg
	>
</div>
