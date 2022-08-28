import { CLASSNAME } from './const';
import * as utils from './utils';
import FriendlyNode, { createTree, getChartFeatures } from './node';
import Controller from './controller';
import locale from './locale/en-US.json';

import type { FriendlyAxis } from './axis';
import type { FriendlySymbol } from './symbol';
import type { FriendlyGroup } from './group';

interface Chart {
	title: string;
	subtitle: string;
	summary?: string;
	purpose?: string;
	description?: string;
	context?: string;
}

function checkIfParentExists(parentId: string) {
	// check if an element with parent id exists
	if (!document.getElementById(parentId)) {
		utils.warn(
			`No element with the given parent id ("${parentId}") exists.`,
			`Please make sure that a group or symbol with id ${parentId} exists.`
		);
		return false;
	}
	return true;
}

export default function chart(node: HTMLElement | SVGElement, options: Chart) {
	if (node instanceof SVGElement) {
		throw new Error(
			'friendly.chart applied to an SVG element. ' +
				'Apply friendly.chart to a wrapper HTML instead.'
		);
	}

	// hide all content from screen readers
	utils.traverse(node, (child) => {
		child.setAttribute('role', 'presentation');
		child.setAttribute('aria-hidden', 'true');
	});

	const getDataFromDOM = (friendly: 'axis' | 'group' | 'symbol') => {
		let toFriendlyData = utils.friendlyData;
		if (friendly === 'group' || friendly === 'symbol') {
			toFriendlyData = (element: Element) => {
				const data = utils.friendlyData(element);
				if (!data.parentId || (data.parentId && !checkIfParentExists(data.parentId))) {
					const parent = element.parentElement?.closest('[friendly-element="group"]');
					data.parentId = parent?.id || '';
				}
				return data;
			};
		}

		const nodes = node.querySelectorAll(`[friendly-element="${friendly}"]`);
		return Array.from(nodes).map(toFriendlyData);
	};

	const axes = getDataFromDOM('axis') as FriendlyAxis[];
	const groups = getDataFromDOM('group') as FriendlyGroup[];
	const symbols = getDataFromDOM('symbol') as FriendlySymbol[];

	const { element: instructionsElement, title, subtitle } = initChartDescription(node, options);
	const controller = new Controller(node, {
		title,
		subtitle,
		anchor: instructionsElement,
		focusElement: node.querySelector(`[friendly-element="focus"]`) as HTMLElement | undefined,
		locale: locale.controller
	});

	let root = createTree([...groups, ...symbols], locale.elements);
	updateChartDescription({ axes, tree: root, title });
	controller.update(root);

	const observer = new MutationObserver((mutationList) => {
		const dirty = { axis: false, tree: false };

		for (const mutation of mutationList) {
			if (mutation.type === 'attributes' || mutation.attributeName === 'friendly-element') {
				const target = mutation.target as Element;
				const friendly = target.getAttribute('friendly-element');
				const data = utils.friendlyData(target);

				// find parent of friendly element
				if (
					(!data.parentId || (data.parentId && !checkIfParentExists(data.parentId))) &&
					(friendly === 'group' || friendly === 'symbol')
				) {
					const parent = target.parentElement?.closest('[friendly-element="group"]');
					data.parentId = parent?.id || '';
				}

				// TODO: type safety
				if (friendly === 'axis') {
					axes.push(data as FriendlyAxis);
					dirty.axis = true;
				} else if (friendly === 'group') {
					groups.push(data as FriendlyGroup);
					dirty.tree = true;
				} else if (friendly === 'symbol') {
					symbols.push(data as FriendlySymbol);
					dirty.tree = true;
				} else {
					console.warn('Unknown friendly-element value: ' + friendly);
				}
			}
		}

		if (dirty.axis) {
			updateChartDescription({ axes, title });
		}

		if (dirty.tree) {
			root = createTree([...groups, ...symbols], locale.elements);
			updateChartDescription({ tree: root, title });
			controller.update(root);
		}
	});

	observer.observe(node, {
		subtree: true,
		attributes: true,
		attributeFilter: ['friendly-element']
	});

	return {
		destroy: () => {
			observer.disconnect();
			controller.destroy();
		}
	};
}

function initChartDescription(node: HTMLElement | SVGElement, options: Chart) {
	// create container
	const a11yElem = document.createElement('div');
	a11yElem.classList.add(CLASSNAME.CHART_INSTRUCTIONS);

	//
	// title
	//

	let { title } = options;
	if (utils.isSelector(title)) {
		const element = utils.querySelector(node, title);
		title = element?.textContent || '';
		element?.setAttribute('aria-hidden', 'true');
	}

	title = title.trim();
	const titleElem = utils.createElement(
		'h2',
		utils.handlebars(locale.chartTitle, { CHART_TITLE: title })
	);
	titleElem.classList.add(CLASSNAME.CHART_TITLE);
	a11yElem.appendChild(titleElem);

	//
	// subtitle
	//

	let { subtitle } = options;
	if (utils.isSelector(subtitle)) {
		const element = utils.querySelector(node, subtitle);
		subtitle = element?.textContent || '';
		element?.setAttribute('aria-hidden', 'true');
	}

	subtitle = subtitle.trim();
	const subtitleElem = utils.createElement(
		'h3',
		utils.handlebars(locale.chartSubtitle, { CHART_SUBTITLE: subtitle })
	);
	subtitleElem.classList.add(CLASSNAME.CHART_SUBTITLE);
	a11yElem.appendChild(subtitleElem);

	//
	// general chart information
	//

	const srInfoElem = document.createElement('p');
	srInfoElem.classList.add(CLASSNAME.CHART_SR_INFORMATION);
	srInfoElem.textContent = utils.handlebars(locale.screenReaderInformation.withTitle, {
		CHART_TITLE: title
	});

	if (a11yElem.firstChild) {
		utils.insertBefore(srInfoElem, a11yElem.firstChild);
	} else {
		a11yElem.appendChild(srInfoElem);
	}

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
		const element = utils.createElement('h3', locale.headings.purpose);
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
		const element = utils.createElement('h3', locale.headings.description);
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

	return { element: a11yElem, title, subtitle };
}

function updateChartDescription({
	tree,
	axes,
	title
}: {
	tree?: FriendlyNode;
	axes?: FriendlyAxis[];
	title?: string;
}) {
	function handleTreeUpdate(tree: FriendlyNode) {
		const { nElements, type } = getChartFeatures(tree);

		// a non-interactive chart does not need a layout description
		if (nElements === 0) return;
		const chartType = type as FriendlySymbol['type'];

		//
		// screen reader information
		//

		const srInfoElem = document.querySelector('.' + CLASSNAME.CHART_SR_INFORMATION);
		if (srInfoElem) {
			srInfoElem.textContent = utils.handlebars(locale.screenReaderInformation.withTitleAndType, {
				CHART_TITLE: title,
				CHART_TYPE: chartType
			});
		}

		//
		// layout description
		//

		const a11yElem = document.querySelector('.' + CLASSNAME.CHART_INSTRUCTIONS) as Element;
		let layoutDescription = document.querySelector('.' + CLASSNAME.CHART_LAYOUT_DESCRIPTION);

		if (!layoutDescription) {
			layoutDescription = document.createElement('h4');
			layoutDescription.classList.add(CLASSNAME.CHART_LAYOUT_DESCRIPTION);
			layoutDescription.textContent = locale.headings.chartLayoutDescription;
			a11yElem.appendChild(layoutDescription);
		}

		let generalLayout = document.querySelector('.' + CLASSNAME.CHART_GENERAL_LAYOUT_DESCRIPTION);

		if (!generalLayout) {
			generalLayout = document.createElement('p');
			generalLayout.classList.add(CLASSNAME.CHART_GENERAL_LAYOUT_DESCRIPTION);
			utils.insertAfter(generalLayout, layoutDescription);
		}

		// general chart information
		if (nElements === 1) {
			locale.chartLayout[chartType].withSingleSymbol;
		} else {
			generalLayout.textContent = utils.handlebars(
				locale.chartLayout[chartType].withMultipleSymbols,
				{ N_CHART_ELEMENTS: nElements }
			);
		}
	}

	function handleAxesUpdate(axes: FriendlyAxis[]) {
		// sort: first x axis, then y axis, then other axes
		axes.sort((a, b) => {
			if (!a.direction) return 1;
			if (!b.direction) return -1;
			return a.direction > b.direction ? 1 : -1;
		});

		//
		// layout description
		//

		const a11yElem = document.querySelector('.' + CLASSNAME.CHART_INSTRUCTIONS) as Element;
		let layoutDescription = document.querySelector('.' + CLASSNAME.CHART_LAYOUT_DESCRIPTION);
		let generalLayout = document.querySelector('.' + CLASSNAME.CHART_GENERAL_LAYOUT_DESCRIPTION);

		if (!layoutDescription) {
			layoutDescription = document.createElement('h4');
			layoutDescription.classList.add(CLASSNAME.CHART_LAYOUT_DESCRIPTION);
			layoutDescription.textContent = locale.headings.chartLayoutDescription;
			a11yElem.appendChild(layoutDescription);
		}

		if (!generalLayout) {
			generalLayout = document.createElement('p');
			utils.insertAfter(generalLayout, layoutDescription);
		}

		// remove all axis related information
		const axisElements = document.getElementsByClassName(CLASSNAME.CHART_AXIS_DESCRIPTION);
		while (axisElements[0]) {
			axisElements[0].parentNode?.removeChild(axisElements[0]);
		}

		let anchor = generalLayout;
		for (let i = 0; i < axes.length; i++) {
			const { label, direction, ticks } = axes[i];

			let template;
			if (direction && ticks && ticks.length > 0) {
				template = locale.axis.withLabelAndDirectionAndTicks;
			} else if (ticks && ticks.length > 0) {
				template = locale.axis.withLabelAndTicks;
			} else if (direction) {
				template = locale.axis.withLabelAndDirection;
			} else {
				template = locale.axis.withLabel;
			}

			const hasTicks = ticks && ticks.length > 0;
			const content = utils.handlebars(template, {
				AXIS_LABEL: label,
				AXIS_DIRECTION: direction,
				START_TICK: hasTicks ? ticks[0] : '',
				END_TICK: hasTicks ? ticks[ticks.length - 1] : ''
			});

			const element = utils.createElement('p', content);
			element.classList.add(CLASSNAME.CHART_AXIS_DESCRIPTION);
			utils.insertAfter(element, anchor);
			anchor = element;
		}
	}

	if (tree) handleTreeUpdate(tree);
	if (axes) handleAxesUpdate(axes);
}
