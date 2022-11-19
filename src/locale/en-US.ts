import type { ChartType } from '../chart';
import type { AxisDirection, AxisType, Tick } from '../axis';
import type { SymbolType } from '../symbol';

const listToText = (ls: any[], and = true) => {
	if (ls.length === 0) return '';
	if (ls.length === 1) return ls[0].toString();

	if (!and) return ls.join(', ');

	return ls.slice(0, -1).join(', ') + ' and ' + ls[ls.length - 1];
};

function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

function chartName(type: ChartType) {
	switch (type) {
		case 'bar':
			return 'bar chart';
		case 'line':
			return 'line chart';
		case 'scatter':
			return 'scatter plot';
		case 'slope':
			return 'slope chart';
	}
}

function symbolName(type: SymbolType, { plural = false } = {}) {
	switch (type) {
		case 'bar':
			return plural ? 'bars' : 'bar';
		case 'line':
			return plural ? 'lines' : 'line';
		case 'point':
			return plural ? 'points' : 'point';
	}
}

export default {
	screenReaderInformation: {
		static: ({ chartTitle }: { chartTitle: string }) =>
			`Chart titled '${chartTitle}'. ` +
			'This section contains additional information about this chart.',
		interactive: ({
			chartTitle,
			chartType,
		}: {
			chartTitle: string;
			chartType: ChartType;
		}) =>
			`Keyboard interactive ${chartName(chartType)}, titled '${chartTitle}'. ` +
			'This section contains additional information about this chart. ' +
			'Pressing TAB takes you to the chart area.',
	},

	keyboardInstructions: () =>
		'Press ENTER on the chart area or a group to drill down a level. ' +
		'Press ESCAPE to drill up a level. ' +
		'Press TAB to exit the chart. ' +
		'Use LEFT and RIGHT arrows to move between sibling elements. ' +
		'Use UP and DOWN arrows to move across groups.',

	chartTitle: ({ chartTitle }: { chartTitle: string }) =>
		`Chart title: ${chartTitle}`,
	chartSubtitle: ({ chartSubtitle }: { chartSubtitle: string }) =>
		`Chart subtitle: ${chartSubtitle}`,

	headings: {
		purpose: () => 'Purpose',
		description: () => 'Description',
		chartLayoutDescription: () => 'Chart layout description',
		keyboardInstructions: () => 'Keyboard instructions',
	},

	controller: {
		label: ({
			chartTitle,
			chartSubtitle,
		}: {
			chartTitle: string;
			chartSubtitle?: string;
		}) => {
			let s = chartTitle + '.';
			if (chartSubtitle) s += ' ' + chartSubtitle + '.';
			return s + ' Navigate into the chart area by pressing ENTER.';
		},
		shortLabel: ({ chartType }: { chartType?: ChartType }) => {
			if (chartType) {
				return 'Interactive ' + chartName(chartType) + '.';
			} else {
				return 'Interactive chart.';
			}
		},
	},

	chartLayout: ({
		chartType,
		nChartElements,
	}: {
		chartType: ChartType;
		nChartElements: number;
	}) => {
		switch (chartType) {
			case 'bar':
				return nChartElements === 1
					? 'This is a bar chart with a single bar.'
					: `This is a bar chart with ${nChartElements} bars.`;
			case 'line':
				return nChartElements === 1
					? 'This is a line chart with a single line.'
					: `This is a line chart with ${nChartElements} lines.`;
			case 'scatter':
				return nChartElements === 1
					? 'This is a scatter plot with a single data point.'
					: `This is a scatter plot with ${nChartElements} data points.`;
			case 'slope':
				return nChartElements === 1
					? 'This is a slope chart with a single slope.'
					: `This is a slope chart with ${nChartElements} slopes.`;
		}
	},

	axis: ({
		label,
		type,
		direction,
		ticks,
	}: {
		label: string;
		type: AxisType;
		direction?: AxisDirection;
		ticks?: Tick[];
	}) => {
		const axis = direction ? direction + ' axis' : 'axis';

		if (ticks && ticks.length > 0 && type === 'continuous') {
			let s = `This chart has a continuous ${axis}, titled ${label}, `;
			if (ticks.length >= 2) {
				return (
					s +
					`with a range that starts with ${ticks[0]} and ends with ${
						ticks[ticks.length - 1]
					}.`
				);
			} else if (ticks.length === 1) {
				return s + `with a single tick, ${ticks[0]}.`;
			}
		} else if (ticks && ticks.length > 0 && type === 'categorical') {
			let s = `This chart has a categorical ${axis}, titled ${label}, `;
			if (ticks.length === 1) {
				return s + `with a single tick, ${ticks[0]}.`;
			} else if (ticks.length === 2) {
				return s + `with ticks ${ticks[0]} and ${ticks[1]}`;
			} else if (ticks.length <= 6) {
				return s + `with ticks ${listToText(ticks)}.`;
			} else {
				return (
					s +
					`with ticks ${listToText(ticks.slice(0, 3), false)}, and more.` +
					`The last tick is ${ticks[ticks.length - 1]}.`
				);
			}
		}

		return `This chart has a ${axis}, titled ${label}.`;
	},

	symbol: ({
		label,
		type,
		position,
		nSiblings,
		highlight,
	}: {
		label: string;
		type: SymbolType;
		position: number;
		nSiblings: number;
		highlight?: string;
	}) => {
		let s = label + '.';
		if (highlight) s += ' ' + highlight + '.';
		return s + ` ${capitalize(type)} ${position} of ${nSiblings}.`;
	},

	root: ({
		nMembers,
		memberType,
	}: {
		nMembers: number;
		memberType?: 'group' | SymbolType;
	}) => {
		if (nMembers === 0) return 'Empty chart.';
		memberType = memberType!;

		const groups = nMembers > 1 ? 'groups' : 'group';
		if (memberType === 'group') {
			return `This chart contains ${nMembers} ${groups}.`;
		}
		const symbols = symbolName(memberType, { plural: true });
		return `This chart contains ${nMembers} interactive ${symbols}.`;
	},

	group: ({
		label,
		position,
		nSiblings,
		nMembers,
		memberType,
		symbolType,
		highlight,
	}: {
		label: string;
		position: number;
		nSiblings: number;
		nMembers: number;
		memberType?: 'group' | SymbolType;
		symbolType?: SymbolType;
		highlight?: string;
	}) => {
		let s = symbolType ? label + '.' : 'Group ' + label + '.';
		if (highlight) s += ' ' + highlight + '.';
		if (symbolType)
			s += `${symbolName(symbolType)} ${position} of ${nSiblings}.`;

		if (nMembers === 0) return symbolType ? ' Empty group.' : ' Empty.';
		memberType = memberType!;

		if (symbolType) s += ' Group that';

		if (memberType === 'group') {
			const groups = nMembers > 1 ? 'groups' : 'group';
			s += ` contains ${nMembers} ${groups}.`;
		} else {
			s += ` contains ${nMembers} ${symbolName(memberType, {
				plural: nMembers > 1,
			})}.`;
		}

		return s;
	},
};
