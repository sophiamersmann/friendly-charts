// TODO: Documentation

export interface FriendlyLocale {
	screenReaderInformation: {
		// use: CHART_TITLE
		static: string;
		// use: CHART_TITLE
		interactive: {
			line: string;
			point: string;
			bar: string;
		};
	};

	// use: CHART_TITLE
	chartTitle: string;
	// use: CHART_SUBTITLE
	chartSubtitle: string;

	headings: {
		purpose: string;
		description: string;
		chartLayoutDescription: string;
	};

	chartLayout: {
		line: {
			withSingleSymbol: string;
			// use: N_CHART_ELEMENTS
			withMultipleSymbols: string;
		};
		point: {
			withSingleSymbol: string;
			// use: N_CHART_ELEMENTS
			withMultipleSymbols: string;
		};
		bar: {
			withSingleSymbol: string;
			// use: N_CHART_ELEMENTS
			withMultipleSymbols: string;
		};
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
			withChartType: {
				line: string;
				point: string;
				bar: string;
			};
		};
	};

	elements: {
		symbolTypeMap: {
			line: string;
			point: string;
			bar: string;
		};
		// use: SYMBOL_LABEL, SYMBOL_TYPE, SYMBOL_POSITION, N_SIBLINGS
		symbol: string;
		group: {
			withSymbolType: {
				// use: GROUP_LABEL, SYMBOL_TYPE, GROUP_POSITION, N_SIBLINGS
				empty: string;
				withMembers: {
					// use: GROUP_LABEL, SYMBOL_TYPE, GROUP_POSITION, N_SIBLINGS, N_MEMBERS
					containsGroups: string;
					containsSymbols: {
						line: string;
						point: string;
						bar: string;
					};
				};
			};
			default: {
				empty: string;
				withMembers: {
					containsGroups: string;
					containsSymbols: {
						line: string;
						point: string;
						bar: string;
					};
				};
			};
		};
		root: {
			empty: string;
			withMembers: {
				containsGroups: string;
				containsSymbols: {
					line: string;
					point: string;
					bar: string;
				};
			};
		};
	};
}
