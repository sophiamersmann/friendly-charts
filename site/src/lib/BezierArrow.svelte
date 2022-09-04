<script lang="ts">
	/**
	 * Bézier curve, to be embedded within an SVG.
	 *
	 * A Bézier curve is defined by a start and end point, as well as two control points, one for each
	 * end. See
	 * [MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#b%C3%A9zier_curves) for
	 * more information.
	 *
	 * CSS variables:
	 *
	 * - `--color`: color of the arrow (default: black)
	 * - `--width`: stroke width of the arrow (default: 1)
	 *
	 * **Note:**: The exposed CSS variables can only be passed through the `style` tag. Passing these
	 * CSS variables as `--props` has no effect.
	 *
	 * @component
	 */

	import type { Coordinates } from '../types';

	type HeadAnchor = 'start' | 'end' | 'both';

	/** start coordinates */
	export let start: Coordinates;

	/** end coordinates */
	export let end: Coordinates;

	/** bezier handle offset from start coordinates */
	export let startHandleOffset: Coordinates = [0, 0];

	/** bezier handle offset from end coordinates */
	export let endHandleOffset: Coordinates = [0, 0];

	/** start bezier handle coordinates; if given, `startHandleOffset` is ignored */
	export let startHandle: Coordinates | undefined = undefined;

	/** end bezier handle coordinates; if given, `endHandleOffset` is ignored */
	export let endHandle: Coordinates | undefined = undefined;

	/** position of the arrow head */
	export let headAnchor: HeadAnchor = 'end';

	/** length of the arrow head */
	export let headLength: number | undefined = undefined;

	/** angle of the arrow head */
	export let headAngle = 55;

	/** renders bezier handle points for debugging */
	export let debug = false;

	const dist = (p1: Coordinates, p2: Coordinates) =>
		Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));

	const clamp = (n: number, min = 0, max = 1) => Math.min(Math.max(n, min), max);

	const equals = (p1: Coordinates, p2: Coordinates) => p1[0] === p2[0] && p1[1] === p2[1];

	const addOffset = (p: Coordinates, o: Coordinates): Coordinates => [p[0] + o[0], p[1] + o[1]];

	const bezierCurve = (
		start: Coordinates,
		end: Coordinates,
		startHandle: Coordinates,
		endHandle: Coordinates
	) => ['M', start, 'C', startHandle, endHandle, end].join(' ');

	function arrowHead(point: Coordinates, handle: Coordinates, { length = 4, theta = 45 } = {}) {
		const xLen = handle[0] - point[0];
		const yLen = handle[1] - point[1];

		const distance = Math.sqrt(Math.pow(xLen, 2) + Math.pow(yLen, 2));
		const ratio = length / distance;

		const mid = [point[0] + xLen * ratio, point[1] + yLen * ratio] as Coordinates;

		function rotate(p: Coordinates, pivot: Coordinates, theta: number) {
			const thetaRad = (theta * Math.PI) / 180;
			return [
				pivot[0] + (p[0] - pivot[0]) * Math.cos(thetaRad) - (p[1] - pivot[1]) * Math.sin(thetaRad),
				pivot[1] + (p[0] - pivot[0]) * Math.sin(thetaRad) + (p[1] - pivot[1]) * Math.cos(thetaRad)
			];
		}

		return ['M', rotate(mid, point, theta), 'L', point, 'L', rotate(mid, point, -theta)].join(' ');
	}

	function arrow(
		start: Coordinates,
		end: Coordinates,
		startHandle: Coordinates,
		endHandle: Coordinates,
		headAnchor: HeadAnchor,
		headOptions: { length: number; theta: number }
	) {
		let d = bezierCurve(start, end, startHandle, endHandle);

		if (headAnchor === 'start' || headAnchor === 'both') {
			const handle = equals(start, startHandle) ? end : startHandle;
			d += arrowHead(start, handle, headOptions);
		}

		if (headAnchor === 'end' || headAnchor === 'both') {
			const handle = equals(end, endHandle) ? start : endHandle;
			d += arrowHead(end, handle, headOptions);
		}

		return d;
	}

	$: sHandle = startHandle || addOffset(start, startHandleOffset);
	$: eHandle = endHandle || addOffset(end, endHandleOffset);

	$: headOptions = {
		length: headLength || clamp(0.08 * dist(start, end), 4, 8),
		theta: headAngle
	};
</script>

<g class:arrow={true} {...$$restProps}>
	{#if debug}
		<g class="debug">
			{#each [sHandle, eHandle] as coords}
				<circle cx={coords[0]} cy={coords[1]} r="5" />
			{/each}
			{#each [[start, sHandle], [end, eHandle]] as [s, e]}
				<line x1={s[0]} y1={s[1]} x2={e[0]} y2={e[1]} />
			{/each}
		</g>
	{/if}

	<path d={arrow(start, end, sHandle, eHandle, headAnchor, headOptions)} />
</g>

<style>
	.arrow {
		--_color: var(--color, var(--c-ui-gray-500));
		--_width: var(--width, 1);
	}

	path {
		stroke: var(--_color);
		stroke-width: var(--_width);
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}

	.debug circle {
		fill: none;
		stroke: orange;
	}

	.debug line {
		stroke: orange;
	}
</style>
