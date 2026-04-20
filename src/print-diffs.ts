import { isBlacklisted } from './blacklist.ts';
import { buildDeleteCommand, buildWriteCommand } from './build-command.ts';
import { deepEqual, type PlistDict } from './plist-values.ts';

export function printDiffs(domain: string, previous: PlistDict, current: PlistDict) {
	const previousKeys = new Set(Object.keys(previous.value));
	const currentKeys = new Set(Object.keys(current.value));

	for (const key of [...previousKeys]) {
		if (!currentKeys.has(key) && !isBlacklisted(domain, key)) {
			console.log(buildDeleteCommand(domain, key));
		}
	}

	for (const key of [...currentKeys]) {
		if (isBlacklisted(domain, key)) continue;

		const currentValue = current.value[key];
		if (previousKeys.has(key) && deepEqual(previous.value[key], currentValue)) continue;

		if (currentValue.type === 'date' || currentValue.type === 'data') continue;

		const command = buildWriteCommand(domain, key, currentValue);
		if (command === null) return;

		console.log(command);
	}
}
