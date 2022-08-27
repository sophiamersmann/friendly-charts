import { insertAfter, handlebars, px } from './utils';
import FriendlyNode from './node';
import { getChartFeatures } from './node';

export default class Controller {
	chartElement;
	element;
	focusElement;
	tree: FriendlyNode | null;
	chartFeatures: ReturnType<typeof getChartFeatures> | null;
	chartDescription;

	constructor(
		chartElement: HTMLElement,
		anchor: HTMLElement,
		{ title, subtitle }: { title: string; subtitle: string }
	) {
		this.chartElement = chartElement;
		this.tree = null;
		this.chartFeatures = null;
		this.chartDescription = { title, subtitle };

		this.element = document.createElement('div');
		this.#initElement();

		this.focusElement = document.createElement('div');
		this.#initFocusElement();

		// add elements to dom
		insertAfter(this.element, anchor);
		document.body.appendChild(this.focusElement);
	}

	#initElement() {
		this.element.setAttribute('role', 'application');
		this.element.tabIndex = 0;
		this.element.setAttribute('aria-label', this.#label);
		this.element.style.outline = 'none';

		this.element.addEventListener('focus', this.handleFocus);
		this.element.addEventListener('blur', this.handleBlur);
		this.element.addEventListener('keydown', this.handleKeydown);

		this.element.style.cssText = `
		  outline: none;
		  border: 0;
		  clip: rect(0 0 0 0);
		  height: 1px;
		  width: 1px;
		  margin: -1px;
		  overflow: hidden;
		  padding: 0;
		  position: absolute;
		`;
	}

	#initFocusElement() {
		this.focusElement.setAttribute('aria-hidden', 'true');
		this.focusElement.style.cssText = `
		  position: absolute;
			outline: 2px solid black;
			outline-offset: 2px;
			display: none;
		`;
	}

	#reset() {
		this.#clearChildren();
		this.element.removeAttribute('aria-activedescendant');
		this.focusElement.style.display = 'none';
		this.element.setAttribute('aria-label', this.#label);
	}

	#clearChildren() {
		while (this.element.lastElementChild) {
			this.element.removeChild(this.element.lastElementChild);
		}
	}

	get #label() {
		return handlebars(
			'{{ TITLE }}. {{ SUBTITLE }}. Navigate into the chart area by pressing ENTER.',
			{ TITLE: this.chartDescription.title, SUBTITLE: this.chartDescription.subtitle }
		);
	}

	get #shortLabel() {
		return handlebars('Interactive {{ TYPE }} chart.', {
			TYPE: this.chartFeatures?.type
		});
	}

	#focus(bbox: { width: number; height: number; top: number; left: number }) {
		this.focusElement.style.width = px(bbox.width);
		this.focusElement.style.height = px(bbox.height);
		this.focusElement.style.top = px(bbox.top);
		this.focusElement.style.left = px(bbox.left);
		this.focusElement.style.display = 'block';
	}

	handleFocus = () => {
		this.#focus(this.chartElement.getBoundingClientRect());
	};

	handleBlur = () => {
		this.#reset();
	};

	handleKeydown = (e: KeyboardEvent) => {
		if (!this.tree) return;
		const tree = this.tree as FriendlyNode;

		const VALID_KEYS = [
			'Escape',
			'Enter',
			'ArrowLeft',
			'ArrowRight',
			'ArrowDown',
			'ArrowUp'
		] as const;
		if (!VALID_KEYS.includes(e.key as any)) return;
		const key = e.key as typeof VALID_KEYS[number];

		e.preventDefault();

		const activeOnEnter = (nodeId: string | null) => {
			if (!nodeId) return tree.data.id;
			const node = tree.descendants.get(nodeId);
			if (node && node.children.length > 0) return node.children[0].data.id;
			return nodeId;
		};

		const activeOnEscape = (nodeId: string | null) => {
			if (!nodeId) return null;
			const node = tree.descendants.get(nodeId);
			if (node && node.parent) return node.parent.data.id;
			return null;
		};

		const activeOnArrow = (nodeId: string | null, arrow: 'right' | 'left' | 'down' | 'up') => {
			if (!nodeId) return null;
			const node = tree.descendants.get(nodeId);
			if (node && node[arrow]) return (node[arrow] as FriendlyNode).data.id;
			return null;
		};

		function activeOnKeyDown(nodeId: string | null, key: typeof VALID_KEYS[number]) {
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

		const activeControlId = this.element.getAttribute('aria-activedescendant');
		const activeNodeId = activeControlId ? FriendlyNode.toId(activeControlId) : null;

		const nextActiveId = activeOnKeyDown(
			activeControlId ? FriendlyNode.toId(activeControlId) : null,
			key
		);

		// update aria label
		if (key === 'Enter' && activeNodeId === null) {
			this.element.setAttribute('aria-label', this.#shortLabel);
		}
		if (key === 'Escape' && (nextActiveId === tree.data.id || nextActiveId === null)) {
			this.element.setAttribute('aria-label', this.#label);
		}

		if (!nextActiveId) {
			this.element.removeAttribute('aria-activedescendant');
			this.#clearChildren();
			this.#focus(this.chartElement.getBoundingClientRect());
			return;
		}

		const nextActiveNode = this.tree.descendants.get(nextActiveId);
		if (!nextActiveNode) return;

		this.#clearChildren();

		// update control elements
		if (
			nextActiveNode.left &&
			(!nextActiveNode.right || nextActiveNode.right.data.id !== nextActiveNode.left.data.id)
		) {
			this.element.appendChild(nextActiveNode.left.controlElement);
		}
		this.element.appendChild(nextActiveNode.controlElement);
		if (nextActiveNode.right) {
			this.element.appendChild(nextActiveNode.right.controlElement);
		}

		// update active element
		this.element.setAttribute('aria-activedescendant', nextActiveNode.controlId);

		// update focus
		const bbox = nextActiveNode.boundingBox;
		if (bbox) this.#focus(bbox);
	};

	update(tree: FriendlyNode) {
		this.tree = tree;
		this.chartFeatures = getChartFeatures(this.tree);
		this.element.textContent = this.#shortLabel;
	}
}
