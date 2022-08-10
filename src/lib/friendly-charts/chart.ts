import { tick } from 'svelte';

import { CLASSNAME } from './const';
import * as utils from './utils';

import type { FriendlyAxis } from './axis';
import type { FriendlySymbol } from './symbol';

interface Chart {
	title: string;
	subtitle: string;
	summary?: string;
	purpose?: string;
	description?: string;
	context?: string;
	structureNotes?: string;
}

export default function chart(node: HTMLElement | SVGElement, options: Chart) {
	node.classList.add(CLASSNAME.CHART);

	tick().then(() => {
		// create container
		const a11yElem = document.createElement('div');
		a11yElem.classList.add(CLASSNAME.CHART_INSTRUCTIONS);

		// get chart elements from dom
		const topLevelChartElements = node.querySelectorAll(
			`.${CLASSNAME.CHART_ELEMENT}:not([friendly-parentId])`
		);
		const chartSymbols = Array.from(topLevelChartElements).map(
			utils.friendlyData
		) as FriendlySymbol[];

		// get axis elements from dom
		const axisElements = node.querySelectorAll('.' + CLASSNAME.CHART_AXIS);
		const axisList = Array.from(axisElements).map(utils.friendlyData) as FriendlyAxis[];

		// check if chart has interactive elements
		const isInteractive = chartSymbols.length > 0;
		if (isInteractive && axisList.length === 0) {
			utils.warn(
				'Axis description missing for an interactive chart.',
				'Please provide axis descriptions via use:friendly.axis.'
			);
		}

		//
		// title
		//

		let { title } = options;
		if (utils.isSelector(title)) {
			const element = utils.querySelector(node, title);
			title = element?.textContent || '';
			if (title) element?.setAttribute('aria-hidden', 'true');
		}

		let titleElem;
		if (title) {
			title = title.trim();
			titleElem = utils.createElement('h2', 'Chart title: ' + title);
			titleElem.classList.add(CLASSNAME.CHART_TITLE);
		}

		//
		// subtitle
		//

		let { subtitle } = options;
		if (utils.isSelector(subtitle)) {
			const element = utils.querySelector(node, subtitle);
			subtitle = element?.textContent || '';
			if (subtitle) element?.setAttribute('aria-hidden', 'true');
		}

		let subtitleElem;
		if (subtitle) {
			subtitle = subtitle.trim();
			subtitleElem = utils.createElement('h2', 'Chart subtitle: ' + subtitle);
			subtitleElem.classList.add(CLASSNAME.CHART_SUBTITLE);
		}

		//
		// screen reader information
		//

		if (isInteractive) {
			// general chart information
			let srInfo = utils.handlebars('Keyboard interactive {{ TYPE }} chart', {
				TYPE: chartSymbols[0].type
			});

			// add title if given
			if (title) {
				srInfo += utils.handlebars(', titled {{ TITLE }}.', { TITLE: title });
			} else {
				srInfo += '.';
			}

			srInfo += [
				' This section contains additional information about this chart.',
				'Pressing TAB takes you to the chart area.'
			].join(' ');

			const srInfoElem = document.createElement('p');
			srInfoElem.textContent = srInfo;
			a11yElem.appendChild(srInfoElem);
		}

		// add title and subtitle
		if (titleElem) a11yElem.appendChild(titleElem);
		if (subtitleElem) a11yElem.appendChild(subtitleElem);

		//
		// summary
		//

		let { summary } = options;
		if (summary && utils.isSelector(summary)) {
			const element = utils.querySelector(node, summary);
			summary = element?.textContent || '';
		}

		if (summary) {
			const element = utils.createElement('p', summary);
			element.classList.add(CLASSNAME.CHART_SUMMARY);
			a11yElem.appendChild(element);
		}

		//
		// purpose
		//

		let { purpose } = options;
		if (purpose && utils.isSelector(purpose)) {
			const element = utils.querySelector(node, purpose);
			purpose = element?.textContent || '';
		}

		if (purpose) {
			const element = utils.createElement('h3', 'Purpose');
			element.classList.add(CLASSNAME.CHART_PURPOSE);
			a11yElem.appendChild(element);
			a11yElem.appendChild(utils.createElement('p', purpose));
		}

		//
		// description
		//

		let { description } = options;
		if (description && utils.isSelector(description)) {
			const element = utils.querySelector(node, description);
			description = element?.textContent || '';
		}

		if (description) {
			const element = utils.createElement('h3', 'Description');
			element.classList.add(CLASSNAME.CHART_DESCRIPTION);
			a11yElem.appendChild(element);
			a11yElem.appendChild(utils.createElement('p', description));
		}

		//
		// context
		//

		let { context } = options;
		if (context && utils.isSelector(context)) {
			const element = utils.querySelector(node, context);
			context = element?.textContent || '';
		}

		if (context) {
			const element = utils.createElement('p', context);
			element.classList.add(CLASSNAME.CHART_CONTEXT);
			a11yElem.appendChild(element);
		}

		//
		// layout description
		//

		if (isInteractive) {
			const layoutDescription = document.createElement('h4');
			layoutDescription.classList.add(CLASSNAME.CHART_LAYOUT_DESCRIPTION);
			layoutDescription.textContent = 'Chart Layout Description';
			a11yElem.appendChild(layoutDescription);

			// general chart information
			const pGeneral = utils.handlebars(
				'This is a {{ TYPE }} chart with {{ N_ELEMENTS }} {{ TYPE }}{{ TYPE_PLURAL }}.',
				{
					TYPE: chartSymbols[0].type,
					N_ELEMENTS: chartSymbols.length,
					TYPE_PLURAL: chartSymbols.length > 1 ? 's' : ''
				}
			);
			const layoutDescriptionParagraph = utils.createElement('p', pGeneral);
			utils.insertAfter(layoutDescriptionParagraph, layoutDescription);

			for (let i = 0; i < axisList.length; i++) {
				const d = axisList[i];

				// information about an axis
				let content = utils.handlebars(
					'This chart has a {{ DIRECTION }} axis, titled {{ LABEL }}',
					{ DIRECTION: d.direction, LABEL: d.label }
				);

				// information about the axis range
				if (d.ticks && d.ticks.length > 0) {
					content += utils.handlebars(
						' with a range that starts with {{ START_TICK }} and ends with {{ END_TICK }}.',
						{ START_TICK: d.ticks[0], END_TICK: d.ticks[d.ticks.length - 1] }
					);
				} else {
					content += '.';
				}

				utils.insertAfter(utils.createElement('p', content), layoutDescriptionParagraph);
			}
		}

		//
		// structure
		//

		let { structureNotes: structure } = options;
		if (structure && utils.isSelector(structure)) {
			const element = utils.querySelector(node, structure);
			structure = element?.textContent || '';
		}

		if (structure) {
			const element = utils.createElement('h4', 'Notes about the chart structure');
			element.classList.add(CLASSNAME.CHART_STRUCTURE_NOTES);
			a11yElem.appendChild(element);
			a11yElem.appendChild(utils.createElement('p', structure));
		}

		// hide the a11y instructions visually
		a11yElem.style.cssText = `
		  border: 0;
		  clip: rect(0 0 0 0);
		  height: 1px;
		  width: 1px;
		  margin: -1px;
		  overflow: hidden;
		  padding: 0;
		  position: absolute;
		`;

		// insert a11y instructions at the beginning of the chart
		if (!node.firstChild) {
			node.appendChild(a11yElem);
		} else {
			node.insertBefore(a11yElem, node.firstChild);
		}
	});
}
