import { tick } from 'svelte';

import * as utils from './utils';
import { CLASSNAME } from './const';
import FriendlyNode, { map } from './friendly-node';

import type { FriendlySymbol } from './symbol';
import type { FriendlyGroup } from './group';

function createTree(friendlyElements: (FriendlyGroup | FriendlySymbol)[]) {
	// create root element with a unique id
	const rootId = ['root', utils.uniqueId()].join('-');
	const root = new FriendlyNode({
		id: rootId,
		type: 'root',
		label: '',
		parentId: '',
		position: 0
	});
	root.descendants.set(root.data.id, root);

	const unprocessedNodesInTree = [root];
	const remainingNodes = friendlyElements.map((e) => new FriendlyNode(e));

	while (unprocessedNodesInTree.length > 0 && remainingNodes.length > 0) {
		const currFriendlyNode = unprocessedNodesInTree[0];

		// collect children of the current node
		const children = remainingNodes.filter(
			(node) =>
				node.data.parentId === currFriendlyNode.data.id ||
				(!node.data.parentId && currFriendlyNode.data.id === rootId)
		);
		children.sort((a, b) => a.data.position - b.data.position);

		for (let i = 0; i < children.length; i++) {
			const leftIndex = i - 1 >= 0 ? i - 1 : children.length - 1;
			const rightIndex = i + 1 < children.length ? i + 1 : 0;

			const node = children[i];
			node.parent = currFriendlyNode;
			node.left = children[leftIndex];
			node.right = children[rightIndex];

			root.descendants.set(node.data.id, node);

			currFriendlyNode.children.push(node);
			unprocessedNodesInTree.push(node);

			const index = remainingNodes.indexOf(node);
			if (index > -1) {
				remainingNodes.splice(index, 1);
			}
		}

		const index = unprocessedNodesInTree.indexOf(currFriendlyNode);
		if (index > -1) {
			unprocessedNodesInTree.splice(index, 1);
		}
	}

	map(root, (node) => {
		if (!node.parent) return;

		const position = node.data.position;
		if (node.parent.right) {
			node.up = node.parent.right.findChild(position);
		}
		if (node.parent.left) {
			node.down = node.parent.left.findChild(position);
		}
	});

	return root;
}

export default function visual(node: HTMLElement | SVGElement) {
	node.setAttribute('role', 'application');
	node.setAttribute('aria-hidden', 'false');
	node.tabIndex = 0;

	let handleKeyDown: (e: KeyboardEvent) => void;

	tick().then(() => {
		// TODO
		// utils.traverse(node, (child) => {
		// 	const isGroup = child.classList.contains(CLASSNAME.CHART_GROUP);
		// 	const isSymbol = child.classList.contains(CLASSNAME.CHART_SYMBOL);

		// 	// hide all elements other than chart groups and symbols from screen readers
		// 	if (!isGroup && !isSymbol) {
		// 		child.setAttribute('role', 'presentation');
		// 		child.setAttribute('aria-hidden', 'true');
		// 	}
		// });

		// get chart elements from DOM
		const friendlyGroups = Array.from(node.querySelectorAll('.' + CLASSNAME.CHART_GROUP)).map(
			utils.friendlyData
		) as FriendlyGroup[];
		const friendlySymbols = Array.from(node.querySelectorAll('.' + CLASSNAME.CHART_SYMBOL)).map(
			utils.friendlyData
		) as FriendlySymbol[];

		if (friendlySymbols.length === 0) return;

		// define relationship between chart elements
		const root = createTree([...friendlyGroups, ...friendlySymbols]);

		// assign meaningful labels
		map(root, (friendlyNode) => {
			if (friendlyNode.data.type === 'root') {
				friendlyNode.label =
					'Interactive chart. TODO: Title. TODO: Subtitle. Navigate into the chart area by pressing ENTER.';
			} else if (friendlyNode.children.length > 0) {
				const { type: childType } = friendlyNode.children[0].data;

				let grandchildType;
				if (!childType && friendlyNode.children[0].children.length > 0) {
					grandchildType = friendlyNode.children[0].children[0].data.type;
				}

				if (grandchildType) {
					friendlyNode.label = utils.handlebars(
						'{{ LABEL }}. Group that contains {{ N_ELEMENTS }} interactive {{ TYPE }} groups.',
						{
							LABEL: friendlyNode.data.label,
							TYPE: grandchildType,
							N_ELEMENTS: friendlyNode.children.length
						}
					);
				} else {
					friendlyNode.label = utils.handlebars(
						'{{ LABEL }}. Group that contains {{ N_ELEMENTS }} interactive {{ TYPE }}s.',
						{
							LABEL: friendlyNode.data.label,
							TYPE: childType || 'group',
							N_ELEMENTS: friendlyNode.children.length
						}
					);
				}
			} else {
				const parent = friendlyNode.parent as FriendlyNode;
				friendlyNode.label = utils.handlebars('{{ LABEL }}. {{ TYPE }} {{ POS }} of {{ SIZE }}.', {
					LABEL: friendlyNode.data.label,
					TYPE: friendlyNode.data.type,
					POS: parent.children.indexOf(friendlyNode) + 1,
					SIZE: parent.children.length
				});
			}

			// assign label to the node
			document.getElementById(friendlyNode.data.id)?.setAttribute('aria-label', friendlyNode.label);
		});

		node.setAttribute('aria-activedescendant', root.data.id);
		node.setAttribute('aria-label', root.label);
		// TODO explanation
		node.setAttribute('aria-describedby', 'TODO');

		interface BoundingBox {
			top: number;
			left: number;
			width: number;
			height: number;
		}

		// focus element for the controller
		const focusElement = document.createElement('div');
		focusElement.setAttribute('aria-hidden', 'true');
		focusElement.style.cssText = `
			width: 0;
			height: 0;
			position: absolute;
			top: 0;
			left: 0;
			display: none;
		`;
		document.body.appendChild(focusElement);

		function hideFocus() {
			focusElement.style.display = 'none';
		}

		function focus(focusElement: HTMLElement, bbox: BoundingBox) {
			const padding = 4;
			focusElement.style.width = utils.px(bbox.width + 2 * padding);
			focusElement.style.height = utils.px(bbox.height + 2 * padding);
			focusElement.style.top = utils.px(bbox.top - padding);
			focusElement.style.left = utils.px(bbox.left - padding);
			focusElement.style.border = '2px solid black';
		}

		handleKeyDown = (e: KeyboardEvent) => {
			const activeId = node.getAttribute('aria-activedescendant');

			console.log('keydown', e.key);

			const KEYS = ['Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];
			if (!KEYS.includes(e.key)) return;

			e.preventDefault();

			const activeOnEnter = (nodeId: string | null) => {
				console.log('activeOnEnter', nodeId);
				if (!nodeId) return root.data.id;
				const node = root.descendants.get(nodeId);
				console.log('node', node);
				if (node && node.children.length > 0) return node.children[0].data.id;
			};

			const activeOnEscape = (nodeId: string | null) => {
				if (!nodeId) return;
				const node = root.descendants.get(nodeId);
				if (node && node.parent) return node.parent.data.id;
				if (node) return root.data.id;
			};

			const activeOnArrow = (nodeId: string | null, arrow: 'right' | 'left' | 'down' | 'up') => {
				if (!nodeId) return;
				const node = root.descendants.get(nodeId);
				if (node && node[arrow]) return (node[arrow] as FriendlyNode).data.id;
			};

			function activeOnKeyDown(nodeId: string | null, key: string) {
				switch (key) {
					case 'Enter':
						return activeOnEnter(nodeId);
					case 'Escape':
						return activeOnEscape(nodeId);
					case 'ArrowRight':
						return activeOnArrow(nodeId, 'right');
					case 'ArrowLeft':
						return activeOnArrow(nodeId, 'left');
					case 'ArrowDown':
						return activeOnArrow(nodeId, 'down');
					case 'ArrowUp':
						return activeOnArrow(nodeId, 'up');
				}
			}

			const nextActiveId = activeOnKeyDown(activeId, e.key);
			if (nextActiveId) {
				const nextActiveNode = root.descendants.get(nextActiveId);
				if (!nextActiveNode) return;

				console.log('new active node', nextActiveNode.data.id);

				// update active element
				node.setAttribute('aria-activedescendant', nextActiveNode.data.id);

				// update focus
				const bbox = nextActiveNode.boundingBox;
				if (bbox) {
					focus(focusElement, bbox);
					focusElement.style.display = 'block';
				}
			}
			// else if (nextActiveId === null) {
			// 	node.removeAttribute('aria-activedescendant');

			// 	focus(focusElement, node.getBoundingClientRect());
			// 	focusElement.style.display = 'block';
			// }
		};

		node.addEventListener('keydown', handleKeyDown);
	});

	return {
		destroy: () => {
			node.removeEventListener('keydown', handleKeyDown);
		}
	};
}
