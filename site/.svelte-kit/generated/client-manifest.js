export { matchers } from './client-matchers.js';

export const components = [
	() => import("../../src/routes/__layout.svelte"),
	() => import("../runtime/components/error.svelte"),
	() => import("../../src/routes/examples/__layout.svelte"),
	() => import("../../src/routes/examples/bar-chart/grouped-bars.svelte"),
	() => import("../../src/routes/examples/bar-chart/horizontal-bars.svelte"),
	() => import("../../src/routes/examples/bar-chart/vertical-bars.svelte"),
	() => import("../../src/routes/examples/index.svelte"),
	() => import("../../src/routes/examples/line-chart/interactive.svelte"),
	() => import("../../src/routes/examples/line-chart/static.svelte"),
	() => import("../../src/routes/index.svelte")
];

export const dictionary = {
	"": [[0, 9], [1]],
	"examples": [[0, 2, 6], [1]],
	"examples/bar-chart/grouped-bars": [[0, 2, 3], [1]],
	"examples/bar-chart/horizontal-bars": [[0, 2, 4], [1]],
	"examples/bar-chart/vertical-bars": [[0, 2, 5], [1]],
	"examples/line-chart/interactive": [[0, 2, 7], [1]],
	"examples/line-chart/static": [[0, 2, 8], [1]]
};