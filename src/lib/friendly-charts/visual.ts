import * as utils from './utils';
import { CLASSNAME } from './const';
import FriendlyNode, { map } from './friendly-node';

import type { FriendlyElement } from './element';

function createTree(friendlyElements: FriendlyElement[]) {
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
	node.setAttribute('role', 'presentation');

	// TODO: does this make sense?
	utils.traverse(node, (child) => {
		child.setAttribute('role', 'presentation');
		child.setAttribute('aria-hidden', 'true');
	});

	// get chart elements from DOM
	const elements = node.querySelectorAll('.' + CLASSNAME.CHART_ELEMENT);
	const friendlyElements = Array.from(elements).map(utils.friendlyData) as FriendlyElement[];

	if (friendlyElements.length === 0) return;

	// define relationship between chart elements
	const root = createTree(friendlyElements);

	// assign meaningful labels
	map(root, (node) => {
		if (node.children.length > 0) {
			const { type } = node.children[0].data;
			node.label = utils.handlebars(
				'Group{{ SPACE }}{{ LABEL }}. Contains {{ N_ELEMENTS }} interactive {{ TYPE }}s.',
				{
					SPACE: node.data.label ? ' ' : '',
					LABEL: node.data.label,
					TYPE: type,
					N_ELEMENTS: root.children.length
				}
			);
		} else {
			const parent = node.parent as FriendlyNode;
			node.label = utils.handlebars('{{ LABEL }}. {{ TYPE }} {{ POS }} of {{ SIZE }}.', {
				LABEL: node.data.label,
				TYPE: node.data.type,
				POS: parent.children.indexOf(node) + 1,
				SIZE: parent.children.length
			});
		}
	});

	// controller of the keyboard-accessible application
	const controller = document.createElement('div');
	const controllerLabel = utils.handlebars('Interactive {{ TYPE }} chart.', {
		TYPE: root.children[0].data.type
	});
	controller.textContent = controllerLabel;
	controller.setAttribute('aria-label', controllerLabel);
	controller.setAttribute('role', 'application');
	controller.tabIndex = 0;
	controller.style.outline = 'none';
	utils.insertBefore(controller, node);

	// focus element for the controller
	const focusElement = document.createElement('div');
	focusElement.setAttribute('aria-hidden', 'true');
	focusElement.style.cssText = `
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: 0;
		border: 2px solid black;
		display: none;
	`;
	document.body.appendChild(focusElement);

	function showFocus(bbox: { top: number; left: number; width: number; height: number }) {
		focusElement.style.width = utils.px(bbox.width);
		focusElement.style.height = utils.px(bbox.height);
		focusElement.style.top = utils.px(bbox.top);
		focusElement.style.left = utils.px(bbox.left);
		focusElement.style.display = 'block';
	}

	function hideFocus() {
		focusElement.style.display = 'none';
	}

	function handleFocus() {
		showFocus(node.getBoundingClientRect());

		// initially, only the root element is accessible
		const rootElement = root.createControlElement();
		controller.appendChild(rootElement);
	}

	function handleBlur() {
		controller.removeAttribute('aria-activedescendant');
		hideFocus();

		// clear controller
		while (controller.lastChild) {
			controller.removeChild(controller.lastChild);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const activeId = controller.getAttribute('aria-activedescendant');

		const KEYS = ['Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'];
		if (!KEYS.includes(e.key)) return;

		e.preventDefault();

		const activeOnEnter = (nodeId: string | null) => {
			if (!nodeId) return root.data.id;
			const node = root.descendants.get(nodeId);
			if (node && node.children.length > 0) return node.children[0].data.id;
		};

		const activeOnEscape = (nodeId: string | null) => {
			if (!nodeId) return;
			const node = root.descendants.get(nodeId);
			if (node && node.parent) return node.parent.data.id;
			if (node) return null;
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

		const nextActiveId = activeOnKeyDown(FriendlyNode.toId(activeId), e.key);
		if (nextActiveId) {
			const nextActiveNode = root.descendants.get(nextActiveId);
			if (!nextActiveNode) return;

			// clear controller
			while (controller.lastChild) {
				controller.removeChild(controller.lastChild);
			}

			// update control elements
			if (
				nextActiveNode.left &&
				(!nextActiveNode.right || nextActiveNode.right.data.id !== nextActiveNode.left.data.id)
			) {
				controller.appendChild(nextActiveNode.left.createControlElement());
			}
			controller.appendChild(nextActiveNode.createControlElement());
			if (nextActiveNode.right) {
				controller.appendChild(nextActiveNode.right.createControlElement());
			}

			// update active element
			controller.setAttribute('aria-activedescendant', nextActiveNode.controlId);

			// update focus
			const bbox = nextActiveNode.boundingBox;
			if (bbox) showFocus(bbox);
		} else if (nextActiveId === null) {
			controller.removeAttribute('aria-activedescendant');

			// clear controller
			while (controller.lastChild) {
				controller.removeChild(controller.lastChild);
			}

			const rootElement = root.createControlElement();
			controller.appendChild(rootElement);

			showFocus(node.getBoundingClientRect());
		}
	}

	controller.addEventListener('focus', handleFocus);
	controller.addEventListener('blur', handleBlur);
	controller.addEventListener('keydown', handleKeyDown);

	return {
		destroy: () => {
			controller.removeEventListener('focus', handleFocus);
			controller.removeEventListener('blur', handleBlur);
			controller.removeEventListener('keydown', handleKeyDown);
		}
	};
}
