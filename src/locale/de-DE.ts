import type { ChartType } from '../chart';
import type { AxisDirection, AxisType, Tick } from '../axis';
import type { SymbolType } from '../symbol';

import * as utils from '../locale';

function chartName(type: ChartType) {
	switch (type) {
		case 'bar':
			return 'Balkendiagramm';
		case 'line':
			return 'Liniendiagramm';
		case 'scatter':
			return 'Steigungsdiagramm';
		case 'slope':
			return 'Streudiagramm';
	}
}

function symbolName(type: SymbolType, { plural = false } = {}) {
	switch (type) {
		case 'bar':
			return plural ? 'Balken' : 'Balken';
		case 'line':
			return plural ? 'Linien' : 'Linie';
		case 'point':
			return plural ? 'Datenpunkten' : 'Punkt';
		case 'area':
			return plural ? 'Flächen' : 'Fläche';
	}
}

export default {
	screenReaderInformation: {
		static: ({ chartTitle }: { chartTitle: string }) =>
			`Chart mit Titel '${chartTitle}'. ` +
			'Dieser Abschnitt enthält mehr Informationen über den Chart.',
		interactive: ({
			chartTitle,
			chartType,
		}: {
			chartTitle: string;
			chartType: ChartType;
		}) =>
			`Tastatur-bedienbares ${chartName(
				chartType
			)} mit Titel '${chartTitle}'. ` +
			'Dieser Abschnitt enthält mehr Informationen über den Chart. ' +
			'Die TAB-Taste führt in den Chart Bereich.',
	},

	keyboardInstructions: () =>
		'Drücke ENTER auf dem Chart oder einer Gruppe, um ein Level nach unten zu steigen. ' +
		'Drücke ESCAPE, um ein Level nach oben zu steigen. ' +
		'Drücke TAB, um den Chart zu verlassen. ' +
		'Nutze LINKS und RECHTS Pfeile, um benachbarten Elemente zu besuchen. ' +
		'Nutze OBEN und UNTEN Pfeile, um zwischen Gruppen zu wechseln.',

	chartTitle: ({ chartTitle }: { chartTitle: string }) =>
		`Chart Titel: ${chartTitle}`,
	chartSubtitle: ({ chartSubtitle }: { chartSubtitle: string }) =>
		`Chart Untertitel: ${chartSubtitle}`,

	headings: {
		purpose: () => 'Zweck',
		description: () => 'Beschreibung',
		chartLayoutDescription: () => 'Beschreibung des Chart Layouts',
		keyboardInstructions: () => 'Erläuterungen zur Tastaturbedienung',
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
			return s + ' Die ENTER-Taste führt in den Chart Bereich.';
		},
		shortLabel: ({ chartType }: { chartType?: ChartType }) => {
			if (chartType) {
				return 'Interaktives ' + chartName(chartType) + '.';
			} else {
				return 'Interaktives Diagramm.';
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
		let s = `Dies ist ein ${chartName(chartType)} `;

		switch (chartType) {
			case 'bar':
				return nChartElements === 1
					? s + 'mit einem Balken.'
					: s + `mit ${nChartElements} Balken.`;
			case 'line':
				return nChartElements === 1
					? s + 'mit einer Linie.'
					: s + `mit ${nChartElements} Linien.`;
			case 'scatter':
				return nChartElements === 1
					? s + 'mit einem Datenpunkt.'
					: s + `mit ${nChartElements} Datenpunkten.`;
			case 'slope':
				return nChartElements === 1
					? s + 'mit einer Linie.'
					: s + `mit ${nChartElements} Linien.`;
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
		const axis = direction ? direction + '-Achse' : 'Achse';

		if (ticks && ticks.length > 0 && type === 'continuous') {
			let s = `Dieser Chart hat eine ${axis} mit Titel ${label}, `;
			if (ticks.length >= 2) {
				return (
					s +
					`die mit ${ticks[0]} beginnt und mit ${
						ticks[ticks.length - 1]
					} endet.`
				);
			} else if (ticks.length === 1) {
				return s + `mit einem Wert, ${ticks[0]}.`;
			}
		} else if (ticks && ticks.length > 0 && type === 'categorical') {
			let s = `Dieser Chart hat eine kategorische ${axis} mit Titel ${label}, `;
			if (ticks.length === 1) {
				return s + `mit einem Wert, ${ticks[0]}.`;
			} else if (ticks.length === 2) {
				return s + `mit Werten ${ticks[0]} und ${ticks[1]}`;
			} else if (ticks.length <= 6) {
				return s + `mit Werten ${utils.listToText(ticks, { and: 'und' })}.`;
			} else {
				return (
					s +
					`mit Werten ${utils.listToText(ticks.slice(0, 3), {
						and: 'und',
						useAnd: false,
					})}, und mehr.` +
					`Der letzte Wert ist ${ticks[ticks.length - 1]}.`
				);
			}
		}

		return `Dieser Chart has eine ${axis} mit Titel ${label}.`;
	},

	symbol: ({
		label,
		type,
		position,
		nSiblings,
	}: {
		label: string;
		type: SymbolType;
		position: number;
		nSiblings: number;
	}) =>
		label +
		'.' +
		` ${utils.capitalize(symbolName(type))} ${position} von ${nSiblings}.`,

	root: ({
		nMembers,
		memberType,
	}: {
		nMembers: number;
		memberType?: 'group' | SymbolType;
	}) => {
		if (nMembers === 0) return 'Leerer Chart.';
		memberType = memberType!;

		const groups = nMembers > 1 ? 'Gruppen' : 'Gruppe';
		if (memberType === 'group') {
			return `Dieser Chart enthält ${nMembers} ${groups}.`;
		}
		const symbols = symbolName(memberType, { plural: true });
		return `Dieser Chart enthält ${nMembers} interaktive ${symbols}.`;
	},

	group: ({
		label,
		position,
		nSiblings,
		nMembers,
		memberType,
		symbolType,
	}: {
		label: string;
		position: number;
		nSiblings: number;
		nMembers: number;
		memberType?: 'group' | SymbolType;
		symbolType?: SymbolType;
	}) => {
		let s = symbolType ? label + '.' : 'Gruppe ' + label + '.';
		if (symbolType)
			s += `${symbolName(symbolType)} ${position} von ${nSiblings}.`;

		if (nMembers === 0) return symbolType ? ' Leere Gruppe.' : ' Leer.';
		memberType = memberType!;

		if (symbolType) {
			s += ' Gruppe, die';
			if (memberType === 'group') {
				const groups = nMembers > 1 ? 'Gruppen' : 'Gruppe';
				s += ` ${nMembers} ${groups} enthält.`;
			} else {
				s += ` ${nMembers} ${symbolName(memberType, {
					plural: nMembers > 1,
				})} enthält.`;
			}
		} else {
			if (memberType === 'group') {
				const groups = nMembers > 1 ? 'Gruppen' : 'Gruppe';
				s += ` Enthält ${nMembers} ${groups}.`;
			} else {
				s += ` Enthält ${nMembers} ${symbolName(memberType, {
					plural: nMembers > 1,
				})}.`;
			}
		}

		return s;
	},
};
