import * as utils from './utils';
import FriendlyNode from './node';
import { getChartFeatures } from './node';
import * as CONST from './const';
import { ChartType } from './chart';

import type { FriendlyLocale } from './locale/types';

interface Options {
	title: string;
	subtitle?: string;
	anchor: HTMLElement;
	focusElement?: HTMLElement;
	chartId: string;
	chartType: ChartType;
	locale: FriendlyLocale['controller'];
	debug: boolean;
}

export default class Controller {
	chartElement;
	chartBoundingBox;
	element;
	focusElement;
	tree: FriendlyNode | null;
	chartFeatures: ReturnType<typeof getChartFeatures> | null;
	chartDescription;
	chartId;
	chartType;
	locale;
	debug;
	debugElement;

	constructor(
		chartElement: HTMLElement,
		{
			title,
			subtitle,
			anchor,
			focusElement,
			chartId,
			chartType,
			locale,
			debug,
		}: Options
	) {
		this.chartElement = chartElement;
		this.chartBoundingBox = this.chartElement.getBoundingClientRect();
		this.chartId = chartId;
		this.chartType = chartType;
		this.locale = locale;
		this.debug = debug;

		// necessary since the focus element is absolutely positioned
		if (
			this.chartElement.style.position &&
			this.chartElement.style.position !== 'relative'
		) {
			utils.warn(
				`The chart's position (\`${this.chartElement.style.position}\`) is overwritten with \`relative\`.`,
				'Try to position a wrapper element instead.'
			);
		}
		this.chartElement.style.position = 'relative';

		this.tree = null;
		this.chartFeatures = null;
		this.chartDescription = { title, subtitle };

		this.element = document.createElement('div');
		this.#initElement();
		utils.insertAfter(this.element, anchor);

		if (focusElement) {
			this.focusElement = focusElement;
			this.#initFocusElement({ defaultStyle: false });
		} else {
			this.focusElement = document.createElement('div');
			this.#initFocusElement();

			if (this.chartElement.lastChild) {
				utils.insertAfter(this.focusElement, this.chartElement.lastChild);
			} else {
				this.chartElement.appendChild(this.focusElement);
			}
		}

		if (debug) {
			this.debugElement = document.createElement('div');
			this.#initDebugElement();

			if (this.chartElement.lastChild) {
				utils.insertAfter(this.debugElement, this.chartElement.lastChild);
			} else {
				this.chartElement.appendChild(this.debugElement);
			}
		}
	}

	#initElement() {
		this.element.classList.add(CONST.APPLICATION);
		this.element.id = utils.concat(CONST.APPLICATION, this.chartId);
		this.element.setAttribute('role', 'application');
		this.element.tabIndex = 0;
		this.element.setAttribute('aria-label', this.#label);
		this.element.setAttribute(
			'aria-describedby',
			utils.concat(CONST.KEYBOARD_INSTRUCTIONS_PARAGRAPH, this.chartId)
		);
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

	#initFocusElement({ defaultStyle = true } = {}) {
		this.focusElement.removeAttribute('role');
		this.focusElement.setAttribute('aria-hidden', 'true');
		this.focusElement.style.position = 'absolute';
		this.focusElement.style.display = 'none';

		if (defaultStyle) {
			this.focusElement.style.outline = '2px solid black';
			this.focusElement.style.outlineOffset = '2px';
		}
	}

	#initDebugElement() {
		const element = this.debugElement as HTMLDivElement;

		element.style.cssText = `
			position: absolute;
			left: 0;
			bottom: 0;
			background-color: white;
			width: 100%;
			padding: 4px 8px;
			border: 2px solid black;
			transform: translateY(calc(100% + 4px));
		`;

		this.#debug();
	}

	#reset() {
		this.#clearChildren();
		this.element.removeAttribute('aria-activedescendant');
		this.element.setAttribute('aria-label', this.#label);
		this.focusElement.style.display = 'none';
		if (this.debug) this.#debug();
	}

	#clearChildren() {
		while (this.element.lastElementChild) {
			this.element.removeChild(this.element.lastElementChild);
		}
	}

	get #label() {
		if (this.chartDescription.subtitle) {
			return utils.handlebars(this.locale.label.withTitleAndSubtitle, {
				CHART_TITLE: this.chartDescription.title,
				CHART_SUBTITLE: this.chartDescription.subtitle,
			});
		} else {
			return utils.handlebars(this.locale.label.withTitle, {
				CHART_TITLE: this.chartDescription.title,
			});
		}
	}

	get #shortLabel() {
		if (this.chartFeatures && this.chartFeatures.nElements > 0) {
			return this.locale.shortLabel.withChartType[this.chartType];
		}
		return this.locale.shortLabel.default;
	}

	#focus(bbox: { width: number; height: number; top: number; left: number }) {
		this.focusElement.style.width = utils.px(bbox.width);
		this.focusElement.style.height = utils.px(bbox.height);
		this.focusElement.style.top = utils.px(
			bbox.top - this.chartBoundingBox.top
		);
		this.focusElement.style.left = utils.px(
			bbox.left - this.chartBoundingBox.left
		);
		this.focusElement.style.display = 'block';
	}

	#debug(label?: string) {
		if (!this.debugElement) return;
		if (label) {
			this.debugElement.textContent = 'Announced by screen readers: ' + label;
			this.debugElement.style.fontStyle = 'normal';
		} else {
			this.debugElement.textContent = 'No element selected';
			this.debugElement.style.fontStyle = 'italic';
		}
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
			'ArrowUp',
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

		const activeOnArrow = (
			nodeId: string | null,
			arrow: 'right' | 'left' | 'down' | 'up'
		) => {
			if (!nodeId) return null;
			const node = tree.descendants.get(nodeId);
			if (node && node[arrow]) return (node[arrow] as FriendlyNode).data.id;
			return nodeId;
		};

		function activeOnKeyDown(
			nodeId: string | null,
			key: typeof VALID_KEYS[number]
		) {
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
		const activeNodeId = activeControlId
			? FriendlyNode.toId(activeControlId)
			: null;

		const nextActiveId = activeOnKeyDown(
			activeControlId ? FriendlyNode.toId(activeControlId) : null,
			key
		);

		// update aria label
		if (key === 'Enter' && activeNodeId === null) {
			this.element.setAttribute('aria-label', this.#shortLabel);
		}
		if (
			key === 'Escape' &&
			(nextActiveId === tree.data.id || nextActiveId === null)
		) {
			this.element.setAttribute('aria-label', this.#label);
		}

		if (!nextActiveId) {
			this.element.removeAttribute('aria-activedescendant');
			this.#clearChildren();
			this.#focus(this.chartElement.getBoundingClientRect());
			if (this.debug) this.#debug();
			return;
		}

		const nextActiveNode = this.tree.descendants.get(nextActiveId);
		if (!nextActiveNode) return;

		this.#clearChildren();

		// update control elements
		if (
			nextActiveNode.left &&
			(!nextActiveNode.right ||
				nextActiveNode.right.data.id !== nextActiveNode.left.data.id)
		) {
			this.element.appendChild(nextActiveNode.left.controlElement);
		}
		this.element.appendChild(nextActiveNode.controlElement);
		if (nextActiveNode.right) {
			this.element.appendChild(nextActiveNode.right.controlElement);
		}

		// update active element
		this.element.setAttribute(
			'aria-activedescendant',
			nextActiveNode.controlId
		);

		// update focus
		const bbox = nextActiveNode.boundingBox;
		if (bbox) this.#focus(bbox);

		// update debug element
		if (this.debug) this.#debug(nextActiveNode.label);
	};

	update(tree: FriendlyNode) {
		this.tree = tree;
		this.chartFeatures = getChartFeatures(this.tree);
		this.element.textContent = this.#shortLabel;
	}

	destroy() {
		this.element.removeEventListener('focus', this.handleFocus);
		this.element.removeEventListener('blur', this.handleBlur);
		this.element.removeEventListener('keydown', this.handleKeydown);
	}
}
