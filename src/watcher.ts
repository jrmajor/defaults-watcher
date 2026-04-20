import { statSync } from 'node:fs';
import path from 'node:path';
import chokidar from 'chokidar';
import { isFileBlacklisted } from './blacklist.ts';

export function createWatcher(paths?: string[]) {
	paths ??= [
		'/Library/Preferences',
		path.join(getHomeDir(), 'Library/Preferences'),
	];

	return chokidar.watch(paths, {
		depth: 0,
		ignored: (candidatePath, stat) => {
			if (isFileBlacklisted(candidatePath)) return true;
			if (candidatePath.endsWith('.plist')) return false;

			stat ??= statSync(candidatePath);
			return !stat.isDirectory();
		},
	});
}

function getHomeDir(): string {
	const home = process.env.HOME;
	if (!home) throw new Error('HOME environment variable not set.');
	return home;
}
