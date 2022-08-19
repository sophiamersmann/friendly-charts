import { CLASSNAME } from './const';
import * as utils from './utils';

// TODO: position should be optional

// TODO: if these is a symbol, there must be a visual

type SymbolType = 'line' | 'point' | 'bar';

export interface FriendlySymbol {
	element: 'symbol';
	id: string;
	type: SymbolType;
	label: string;
	parentId: string;
	position: number;
}

type Options = {
	id?: string;
	type: FriendlySymbol['type'];
	label: FriendlySymbol['label'];
	position: FriendlySymbol['position'];
};

export default function symbol(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_SYMBOL);

	node.setAttribute('role', 'img');
	node.setAttribute('aria-hidden', 'false');
	node.tabIndex = -1;

	let { id } = options;

	if (!id) {
		id = ['friendly-symbol', utils.uniqueId()].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of a symbol ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:friendly.symbol={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;

	const data = {
		...options,
		element: 'symbol',
		id: id as string
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);

	const setParentId = () => {
		const parent = node.closest('[friendly-element="group"]');

		utils.setFriendlyData(node, {
			parentId: parent?.id || ''
		});
	};

	queueMicrotask(() => {
		setParentId();

		const observer = new MutationObserver((mutationList) => {
			for (const mutation of mutationList) {
				if (
					mutation.type === 'attributes' &&
					(mutation.target as Element).getAttribute('friendly-element') === 'group'
				) {
					setParentId();
				}
			}
		});

		const visual = node.closest('.' + CLASSNAME.CHART_VISUAL);
		if (visual) {
			observer.observe(visual, {
				attributes: true,
				subtree: true,
				attributeFilter: ['friendly-element']
			});
		}

		// TODO: call disconnect
	});
}
