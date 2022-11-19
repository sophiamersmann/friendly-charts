import locale from './locale/en-US';

export type FriendlyLocale = typeof locale;

export function listToText(ls: any[], { useAnd = true, and = 'and' } = {}) {
	if (ls.length === 0) return '';
	if (ls.length === 1) return ls[0].toString();

	if (!useAnd) return ls.join(', ');

	return ls.slice(0, -1).join(', ') + ` ${and} ` + ls[ls.length - 1];
}

export function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
