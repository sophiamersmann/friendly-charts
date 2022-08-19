import { CLASSNAME } from './const';
import * as utils from './utils';
import FriendlyNode, { createTree, findAll, findDepth } from './node';

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

export default function chart(node: HTMLElement | SVGElement, options: Chart) {
	const getDataFromDOM = (friendly: 'axis' | 'group' | 'symbol') =>
		Array.from(node.querySelectorAll(`[friendly-element="${friendly}"]`)).map(utils.friendlyData);

	const axes = getDataFromDOM('axis') as FriendlyAxis[];
	const groups = getDataFromDOM('group') as FriendlyGroup[];
	const symbols = getDataFromDOM('symbol') as FriendlySymbol[];

	initChartDescription(node, options);

	let root = createTree([...groups, ...symbols]);
	updateChartDescription(axes, root);

	const observer = new MutationObserver((mutationList) => {
		const dirty = { axis: false, tree: false };

		for (const mutation of mutationList) {
			if (mutation.type === 'attributes' || mutation.attributeName === 'friendly-element') {
				const target = mutation.target as Element;
				const friendly = target.getAttribute('friendly-element');
				const data = utils.friendlyData(target);

				// find parent of friendly element
				if (friendly === 'group' || friendly === 'symbol') {
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
			updateChartDescription(axes, root);
		}

		if (dirty.tree) {
			root = createTree([...groups, ...symbols]);
			updateChartDescription(axes, root);
		}
	});

	observer.observe(node, {
		subtree: true,
		attributes: true,
		attributeFilter: ['friendly-element']
	});
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
		if (title) element?.setAttribute('aria-hidden', 'true');
	}

	let titleElem;
	if (title) {
		title = title.trim();
		titleElem = utils.createElement('h2', 'Chart title: ' + title);
		titleElem.classList.add(CLASSNAME.CHART_TITLE);
	}

	if (titleElem) a11yElem.appendChild(titleElem);

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
		subtitleElem = utils.createElement('h3', 'Chart subtitle: ' + subtitle);
		subtitleElem.classList.add(CLASSNAME.CHART_SUBTITLE);
	}

	if (subtitleElem) a11yElem.appendChild(subtitleElem);

	//
	// general chart information
	//

	let srInfo = 'Keyboard interactive chart';

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
	srInfoElem.classList.add(CLASSNAME.CHART_SR_INFORMATION);
	srInfoElem.textContent = srInfo;

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
	// TODO: what if node is a SVG?
	if (!node.firstChild) {
		node.appendChild(a11yElem);
	} else {
		node.insertBefore(a11yElem, node.firstChild);
	}
}

function updateChartDescription(axes: FriendlyAxis[], tree: FriendlyNode) {
	const symbols = findAll(tree, (node) => node.data.element === 'symbol');

	// check if chart has interactive elements
	const isInteractive = symbols.length > 0;

	// a non-interactive chart does not need a layout description
	if (!isInteractive) return;

	// warn if axis descriptions are missing
	if (isInteractive && axes.length === 0) {
		utils.warn(
			'Axis description missing for an interactive chart.',
			'Please consider providing axis descriptions via use:friendly.axis.'
		);
	}

	// find top level symbols
	const depths = symbols.map((symbol) => findDepth(symbol));
	const minDepth = Math.min(...depths);
	const topLevelSymbols = symbols.filter((_, i) => depths[i] === minDepth);
	const chartType = topLevelSymbols[0].data.type;

	// sort: first x axis, then y axis, then other axes
	axes.sort((a, b) => {
		if (!a.direction) return 1;
		if (!b.direction) return -1;
		return a.direction > b.direction ? 1 : -1;
	});

	//
	// screen reader information
	//

	const srInfoElem = document.querySelector('.' + CLASSNAME.CHART_SR_INFORMATION);
	// TODO: breaks easily
	if (srInfoElem) {
		const srInfo = srInfoElem.textContent;
		srInfoElem.textContent = srInfo?.replace(
			/^Keyboard interactive/,
			utils.handlebars('Keyboard interactive {{ TYPE }}', {
				TYPE: chartType
			})
		) as string;
	}

	//
	// layout description
	//

	const a11yElem = document.querySelector('.' + CLASSNAME.CHART_INSTRUCTIONS) as Element;

	const layoutDescription = document.createElement('h4');
	layoutDescription.classList.add(CLASSNAME.CHART_LAYOUT_DESCRIPTION);
	layoutDescription.textContent = 'Chart Layout Description';
	a11yElem.appendChild(layoutDescription);

	// general chart information
	const pGeneral = utils.handlebars(
		'This is a {{ TYPE }} chart with {{ N_ELEMENTS }} {{ TYPE }}{{ TYPE_PLURAL }}.',
		{
			TYPE: chartType,
			N_ELEMENTS: topLevelSymbols.length,
			TYPE_PLURAL: topLevelSymbols.length > 1 ? 's' : ''
		}
	);
	const layoutDescriptionParagraph = utils.createElement('p', pGeneral);
	utils.insertAfter(layoutDescriptionParagraph, layoutDescription);

	let anchor = layoutDescriptionParagraph;
	for (let i = 0; i < axes.length; i++) {
		const d = axes[i];

		// information about an axis
		let content = utils.handlebars(
			d.direction
				? 'This chart has a {{ DIRECTION }} axis, titled {{ LABEL }}'
				: 'This chart has an axis, titled {{ LABEL }}',
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

		const element = utils.createElement('p', content);
		utils.insertAfter(element, anchor);
		anchor = element;
	}
}
