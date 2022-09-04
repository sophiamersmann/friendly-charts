import type { SymbolType } from '../symbol';

type DescriptionForEachSymbol = Record<SymbolType, string>;

type DescriptionForSingleAndMultipleSymbols = {
	withSingleSymbol: string;
	// use: N_CHART_ELEMENTS
	withMultipleSymbols: string;
};

type DescriptionForElement = {
	empty: string;
	withMembers: {
		containsGroups: string;
		containsSymbols: DescriptionForEachSymbol;
	};
};

export interface FriendlyLocale {
	// use: CHART_TITLE
	screenReaderInformation: {
		static: string;
		interactive: DescriptionForEachSymbol;
	};

	keyboardInstructions: string;

	// use: CHART_TITLE
	chartTitle: string;
	// use: CHART_SUBTITLE
	chartSubtitle: string;

	headings: {
		purpose: string;
		description: string;
		chartLayoutDescription: string;
		keyboardInstructions: string;
	};

	chartLayout: {
		line: DescriptionForSingleAndMultipleSymbols;
		point: DescriptionForSingleAndMultipleSymbols;
		bar: DescriptionForSingleAndMultipleSymbols;
	};

	axis: {
		// use: AXIS_LABEL, AXIS_DIRECTION, START_TICK, END_TICK
		withLabelAndDirectionAndTicks: string;
		// use: AXIS_LABEL, AXIS_DIRECTION
		withLabelAndDirection: string;
		// use: AXIS_LABEL, START_TICK, END_TICK
		withLabelAndTicks: string;
		// use: AXIS_LABEL
		withLabel: string;
	};

	controller: {
		// use: CHART_TITLE, CHART_SUBTITLE
		label: string;
		shortLabel: {
			default: string;
			withChartType: DescriptionForEachSymbol;
		};
	};

	elements: {
		symbolTypeMap: DescriptionForEachSymbol;
		symbol: {
			// use: SYMBOL_LABEL, SYMBOL_TYPE, SYMBOL_POSITION, N_SIBLINGS, SYMBOL_HIGHLIGHT
			withHighlight: string;
			// use: SYMBOL_LABEL, SYMBOL_TYPE, SYMBOL_POSITION, N_SIBLINGS
			withoutHighlight: string;
		};
		group: {
			withHighlight: {
				// use: GROUP_LABEL, GROUP_HIGHLIGHT, SYMBOL_TYPE, GROUP_POSITION, N_SIBLINGS, [N_MEMBERS]
				withSymbolType: DescriptionForElement;
				// use: GROUP_LABEL, GROUP_HIGHLIGHT, [N_MEMBERS]
				default: DescriptionForElement;
			};
			withoutHighlight: {
				// use: GROUP_LABEL, SYMBOL_TYPE, GROUP_POSITION, N_SIBLINGS, [N_MEMBERS]
				withSymbolType: DescriptionForElement;
				// use: GROUP_LABEL, [N_MEMBERS]
				default: DescriptionForElement;
			};
		};
		// use: [N_MEMBERS]
		root: DescriptionForElement;
	};
}
