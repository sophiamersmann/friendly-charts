export type Coordinates = [number, number];

export interface TableColumn<T> {
	name: string;
	getValue: (d: T) => unknown;
	class?: string;
}
