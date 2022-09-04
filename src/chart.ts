import * as CONST from './const';
import * as utils from './utils';
import FriendlyNode, { createTree, getChartFeatures } from './node';
import Controller from './controller';

import type { FriendlyAxis } from './axis';
import type { FriendlySymbol } from './symbol';
import type { FriendlyGroup } from './group';
import type { FriendlyLocale } from './locale/types';

interface Chart {
	title: string;
	subtitle: string;
	summary?: string;
	purpose?: string;
	description?: string;
	context?: string;
	locale: FriendlyLocale;
}

interface Options extends Chart {
	axes?: (Omit<FriendlyAxis, 'element'> & { element?: 'axis' })[];
}

function checkIfParentExists(parentId: string) {
	// check if an element with parent id exists
	if (!document.getElementById(parentId)) {
		utils.warn(
			`No element with id #${parentId} exists.`,
			`Make sure to pass "${parentId}" as \`id\` to a group or symbol.`
		);
		return false;
	}
	return true;
}

export default function chart(
	node: HTMLElement | SVGElement,
	options: Options
) {
	const { locale } = options;

	const chartId = utils.uniqueId();

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
				if (
					!data.parentId ||
					(data.parentId && !checkIfParentExists(data.parentId))
				) {
					const parent = element.parentElement?.closest(
						'[friendly-element="group"]'
					);
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

	if (options.axes) {
		for (let i = 0; i < options.axes.length; i++) {
			const axis = options.axes[i];
			axis.element = 'axis';
			axes.push(axis as FriendlyAxis);
		}
	}

	const {
		element: instructionsElement,
		title,
		subtitle,
	} = initChartDescription(node, options, chartId);

	let controller: Controller | undefined;
	if (symbols.length > 0) {
		controller = new Controller(node, {
			title,
			subtitle,
			anchor: instructionsElement,
			focusElement: node.querySelector(`[friendly-element="focus"]`) as
				| HTMLElement
				| undefined,
			chartId,
			locale: locale.controller,
		});

		const root = createTree([...groups, ...symbols], locale.elements);
		updateChartDescription({ axes, tree: root, title, locale, chartId });
		controller.update(root);
	}

	if (axes.length > 0) {
		updateChartDescription({ axes, title, locale, chartId });
	}

	const observer = new MutationObserver((mutationList) => {
		const dirty = { axis: false, tree: false };

		for (const mutation of mutationList) {
			if (
				mutation.type === 'attributes' ||
				mutation.attributeName === 'friendly-element'
			) {
				const target = mutation.target as Element;
				const friendly = target.getAttribute('friendly-element');
				const data = utils.friendlyData(target);

				// find parent of friendly element
				if (
					(!data.parentId ||
						(data.parentId && !checkIfParentExists(data.parentId))) &&
					(friendly === 'group' || friendly === 'symbol')
				) {
					const parent = target.parentElement?.closest(
						'[friendly-element="group"]'
					);
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
				}
			}
		}

		if (dirty.axis) {
			updateChartDescription({ axes, title, locale, chartId });
		}

		if (dirty.tree) {
			const root = createTree([...groups, ...symbols], locale.elements);
			updateChartDescription({ tree: root, title, locale, chartId });
			if (!controller) {
				controller = new Controller(node, {
					title,
					subtitle,
					anchor: instructionsElement,
					focusElement: node.querySelector(`[friendly-element="focus"]`) as
						| HTMLElement
						| undefined,
					chartId,
					locale: locale.controller,
				});
			}
			controller.update(root);
		}
	});

	observer.observe(node, {
		subtree: true,
		attributes: true,
		attributeFilter: ['friendly-element'],
	});

	return {
		destroy: () => {
			observer.disconnect();
			if (controller) controller.destroy();
		},
	};
}

function initChartDescription(
	node: HTMLElement | SVGElement,
	options: Options,
	chartId: string
) {
	const { locale } = options;

	// create container
	const a11yElem = document.createElement('div');
	a11yElem.classList.add(CONST.INSTRUCTIONS);
	a11yElem.id = utils.concat(CONST.INSTRUCTIONS, chartId);

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
	titleElem.classList.add(CONST.TITLE);
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
	subtitleElem.classList.add(CONST.SUBTITLE);
	a11yElem.appendChild(subtitleElem);

	//
	// screen reader information
	//

	const srInfoElem = document.createElement('p');
	srInfoElem.classList.add(CONST.SCREEN_READER_INFO);
	srInfoElem.id = utils.concat(CONST.SCREEN_READER_INFO, chartId);
	srInfoElem.textContent = utils.handlebars(
		locale.screenReaderInformation.static,
		{
			CHART_TITLE: title,
		}
	);

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
		element.classList.add(CONST.SUMMARY);
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
		element.classList.add(CONST.PURPOSE);
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
		element.classList.add(CONST.DESCRIPTION);
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
		element.classList.add(CONST.CONTEXT);
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
	title,
	locale,
	chartId,
}: {
	tree?: FriendlyNode;
	axes?: FriendlyAxis[];
	title?: string;
	locale: FriendlyLocale;
	chartId: string;
}) {
	function createLayoutDescription(id: string) {
		const elem = document.createElement('h4');
		elem.classList.add(CONST.LAYOUT_DESCRIPTION);
		elem.id = id;
		elem.textContent = locale.headings.chartLayoutDescription;
		return elem;
	}

	function createGeneralLayoutDescription(id: string) {
		const elem = document.createElement('p');
		elem.classList.add(CONST.LAYOUT_DESCRIPTION_GENERAL);
		elem.id = id;
		return elem;
	}

	function handleTreeUpdate(tree: FriendlyNode) {
		const { nElements, type } = getChartFeatures(tree);

		// a non-interactive chart does not need a layout description
		if (nElements === 0) return;
		const chartType = type as FriendlySymbol['type'];

		//
		// screen reader information
		//

		const srInfoElem = document.getElementById(
			utils.concat(CONST.SCREEN_READER_INFO, chartId)
		);
		if (srInfoElem) {
			srInfoElem.textContent = utils.handlebars(
				locale.screenReaderInformation.interactive[chartType],
				{ CHART_TITLE: title }
			);
		}

		//
		// keyboard instructions
		//

		const a11yElem = document.getElementById(
			utils.concat(CONST.INSTRUCTIONS, chartId)
		) as Element;

		const keyboardInstructionsElem = document.getElementById(
			utils.concat(CONST.KEYBOARD_INSTRUCTIONS, chartId)
		);
		if (!keyboardInstructionsElem) {
			const heading = utils.createElement(
				'h4',
				locale.headings.keyboardInstructions
			);
			heading.classList.add(CONST.KEYBOARD_INSTRUCTIONS);
			heading.id = utils.concat(CONST.KEYBOARD_INSTRUCTIONS, chartId);
			a11yElem.appendChild(heading);

			const p = utils.createElement('p', locale.keyboardInstructions);
			p.classList.add(CONST.KEYBOARD_INSTRUCTIONS_PARAGRAPH);
			p.id = utils.concat(CONST.KEYBOARD_INSTRUCTIONS_PARAGRAPH, chartId);
			a11yElem.appendChild(p);
		}

		//
		// layout description
		//

		const layoutDescriptionId = utils.concat(CONST.LAYOUT_DESCRIPTION, chartId);
		let layoutDescriptionElem = document.getElementById(layoutDescriptionId);

		if (!layoutDescriptionElem) {
			layoutDescriptionElem = createLayoutDescription(layoutDescriptionId);
			a11yElem.appendChild(layoutDescriptionElem);
		}

		const generalLayoutDescriptionId = utils.concat(
			CONST.LAYOUT_DESCRIPTION_GENERAL,
			chartId
		);
		let generalLayoutDescriptionElem = document.getElementById(
			generalLayoutDescriptionId
		);

		if (!generalLayoutDescriptionElem) {
			generalLayoutDescriptionElem = createGeneralLayoutDescription(
				generalLayoutDescriptionId
			);
			utils.insertAfter(generalLayoutDescriptionElem, layoutDescriptionElem);
		}

		// general chart information
		if (nElements === 1) {
			locale.chartLayout[chartType].withSingleSymbol;
		} else {
			generalLayoutDescriptionElem.textContent = utils.handlebars(
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

		const a11yElem = document.getElementById(
			utils.concat(CONST.INSTRUCTIONS, chartId)
		) as Element;

		const layoutDescriptionId = utils.concat(CONST.LAYOUT_DESCRIPTION, chartId);
		let layoutDescriptionElem = document.getElementById(layoutDescriptionId);
		if (!layoutDescriptionElem) {
			layoutDescriptionElem = createLayoutDescription(layoutDescriptionId);
			a11yElem.appendChild(layoutDescriptionElem);
		}

		const generalLayoutId = utils.concat(
			CONST.LAYOUT_DESCRIPTION_GENERAL,
			chartId
		);
		let generalLayoutDescriptionElem = document.getElementById(generalLayoutId);
		if (!generalLayoutDescriptionElem) {
			generalLayoutDescriptionElem =
				createGeneralLayoutDescription(generalLayoutId);
			utils.insertAfter(generalLayoutDescriptionElem, layoutDescriptionElem);
		}

		// remove all axis related information
		const axisElements = document.getElementsByClassName(
			CONST.LAYOUT_DESCRIPTION_AXIS
		);
		while (axisElements[0]) {
			axisElements[0].parentNode?.removeChild(axisElements[0]);
		}

		let anchor = generalLayoutDescriptionElem;
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
				END_TICK: hasTicks ? ticks[ticks.length - 1] : '',
			});

			const element = utils.createElement('p', content);
			element.classList.add(CONST.LAYOUT_DESCRIPTION_AXIS);
			utils.insertAfter(element, anchor);
			anchor = element;
		}
	}

	if (tree) handleTreeUpdate(tree);
	if (axes) handleAxesUpdate(axes);
}
