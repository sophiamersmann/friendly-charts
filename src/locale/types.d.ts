import type { ChartType } from '../chart';
import type { SymbolType } from '../symbol';
import type { AxisType } from '../axis';

type DescriptionForEachSymbol = Record<SymbolType, string>;
type DescriptionForEachChartType = Record<ChartType, string>;
type DescriptionForEachAxisType = Record<AxisType, string>;

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
		interactive: DescriptionForEachChartType;
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

	chartLayout: Record<ChartType, DescriptionForSingleAndMultipleSymbols>;

	axis: {
		// use: AXIS_LABEL, AXIS_DIRECTION, TICKS, START_TICK, END_TICK
		withLabelAndDirectionAndTicks: DescriptionForEachAxisType;
		// use: AXIS_LABEL, TICKS, START_TICK, END_TICK
		withLabelAndTicks: DescriptionForEachAxisType;
		// use: AXIS_LABEL, AXIS_DIRECTION
		withLabelAndDirection: string;
		// use: AXIS_LABEL
		withLabel: string;
	};

	controller: {
		label: {
			// use: CHART_TITLE
			withTitle: string;
			// use: CHART_TITLE, CHART_SUBTITLE
			withTitleAndSubtitle: string;
		};
		shortLabel: {
			default: string;
			withChartType: DescriptionForEachChartType;
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
