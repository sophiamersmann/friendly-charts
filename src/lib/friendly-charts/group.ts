import { CLASSNAME } from './const';

export interface FriendlyGroup {
	id: string;
	label: string;
}

type Options = Omit<FriendlyGroup, 'id'> & { id?: string };

export default function group(node: HTMLElement | SVGElement, options: Options) {
	node.classList.add(CLASSNAME.CHART_GROUP);
}
