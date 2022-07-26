import { customAlphabet } from 'nanoid/non-secure';

const alphanumeric =
	'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphanumeric, 6);

export function warn(message: string, advice?: string) {
	const styles = ['color: maroon; font-weight: bold', 'color: maroon'];
	if (advice) styles.push('color: maroon; font-style: italic');

	console.warn(
		`%cunfriendly chart: %c${message}` + (advice ? `\n%c${advice}` : ''),
		...styles
	);
}

export function createElement(tagName: string, content: string) {
	const e = document.createElement(tagName);
	e.textContent = content;
	return e;
}

/** A string is interpreted as selector if it starts with one of: # . [ : */
export function isSelector(s: string) {
	return /^[#.\[:].+$/.test(s.trim());
}

export function querySelector(node: Element, selector: string) {
	let result;
	try {
		result = node.querySelector(selector);

		if (!result) {
			warn(
				`No element found by selecting \`${selector}\`.`,
				`Check if an element with \`${selector}\` exists.`
			);
			return;
		}
	} catch (error) {
		warn(`The selector \`${selector}\` is not valid.`);
	}

	return result;
}

export function querySelectorAll(node: Element, selector: string) {
	const elements = node.querySelectorAll(selector);

	if (!elements) {
		warn(
			`No elements found by selecting \`${selector}\`.`,
			`Check if an element with \`${selector}\` exists.`
		);
		return;
	}

	return elements;
}

export function friendlyData(element: Element) {
	const { attributes: attrs } = element;
	const data: Record<string, any> = {};
	for (let i = 0; i < attrs.length; i++) {
		const attrName = attrs[i].nodeName;
		if (attrName.startsWith('friendly') && attrs[i].nodeValue) {
			try {
				data[attrName.replace('friendly-', '')] = JSON.parse(
					attrs[i].nodeValue as string
				);
			} catch {
				data[attrName.replace('friendly-', '')] = attrs[i].nodeValue;
			}
		}
	}
	return data;
}

export function setFriendlyData(element: Element, data: Record<string, any>) {
	for (const [key, value] of Object.entries(data)) {
		element.setAttribute(
			'friendly-' + key,
			typeof value === 'string' ? value : JSON.stringify(value)
		);
	}
}

export function traverse(node: Element, cb: (node: Element) => void) {
	if (!node.children) return;
	for (const child of node.children) {
		cb(child);
		traverse(child, cb);
	}
}

export function insertBefore(node: Node, refNode: Node) {
	refNode.parentNode?.insertBefore(node, refNode);
}

export function insertAfter(node: Node, refNode: Node) {
	refNode.parentNode?.insertBefore(node, refNode.nextSibling);
}

export function concat(...s: string[]) {
	return s.join('-');
}

export function uniqueId() {
	return nanoid();
}

export function px(n: number) {
	return `${n}px`;
}

export function getBoundingClientRect(element: HTMLElement) {
	let bbox = element.getBoundingClientRect();
	return {
		top: bbox.top + window.scrollY,
		right: bbox.right,
		bottom: bbox.bottom,
		left: bbox.left + window.scrollX,
		width: bbox.width,
		height: bbox.height,
		x: bbox.x,
		y: bbox.y,
	};
}
