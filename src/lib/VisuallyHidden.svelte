<div>
	<slot />
</div>

<style>
	/* content is _visually_ hidden but still accessible to screen readers */
	div {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		width: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
	}
</style>
