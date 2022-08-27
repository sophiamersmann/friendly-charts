<script>
	import '../style/index.css';
</script>

<a href="/">Home</a>
<a href="/examples">Examples</a>

<main>
	<slot />
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
	}
</style>
