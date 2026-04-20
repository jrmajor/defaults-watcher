import type { PlistDict } from './plist-values.ts';

const snapshots = new Map<string, PlistDict>();

export function getSnapshot(path: string) {
	return snapshots.get(path) ?? null;
}

export function setSnapshot(path: string, value: PlistDict | null) {
	if (value === null) {
		snapshots.delete(path);
	} else {
		snapshots.set(path, value);
	}
}
