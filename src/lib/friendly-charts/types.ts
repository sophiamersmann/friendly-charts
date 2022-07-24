export interface Chart {
	title: string;
	subtitle: string;
	summary?: string;
	purpose?: string;
	description?: string;
	context?: string;
	structureNotes?: string;
}

export interface Axis {
	label: string;
	direction?: 'x' | 'y';
	orientation?: 'horizontal' | 'vertical';
	ticks?: any[];
}

export type AxisOptions = Omit<Axis, 'ticks'> & { ticks?: string | any[] };

export interface Element {
	id?: string;
	type: string;
	label: string;
	level: number;
	position: number;
}

export type ElementOptions = Element;
