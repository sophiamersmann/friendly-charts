import { CLASSNAME } from './const';
import * as utils from './utils';

// TODO: add symbolId as option

export interface FriendlyGroup {
	element: 'group';
	id: string;
	label: string;
	parentId: string;
	position: number;
}

interface Options {
	id?: FriendlyGroup['id'];
	label: FriendlyGroup['label'];
	position: FriendlyGroup['position'];
}

export default function group(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_GROUP);

	node.setAttribute('role', 'region');
	node.setAttribute('aria-hidden', 'false');
	node.tabIndex = -1;

	let { id } = options;

	if (!id) {
		id = ['friendly-group', utils.uniqueId()].join('-');
	}

	if (node.id && node.id !== id) {
		utils.warn(
			`The id of a group ("${node.id}") is overwritten with a generated id ("${id}").`,
			`If you want to keep "${node.id}", pass it to the use directive as use:friendly.group={{ id: '${node.id}', ... }}.`
		);
	}

	node.id = id;

	const data = {
		...options,
		element: 'group',
		id: id as string
	};

	// set data on the dom element
	utils.setFriendlyData(node, data);

	const setParentId = () => {
		const parent = node.parentElement?.closest('[friendly-element="group"]');

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
