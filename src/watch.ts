import path from 'node:path';
import { styleText } from 'node:util';
import { buildCommand } from '@stricli/core';
import { readPlistFile } from './plist-read.ts';
import { printDiffs } from './print-diffs.ts';
import { getSnapshot, setSnapshot } from './snapshots-store.ts';
import { createWatcher } from './watcher.ts';

export const watch = buildCommand({
	parameters: { },
	docs: {
		brief: 'Watch macOS defaults and print commands for preference changes.',
	},
	func() {
		const watcher = createWatcher();

		watcher.on('all', (event, plistPath) => {
			if (event !== 'add' && event !== 'change') return;

			const previous = getSnapshot(plistPath);
			const current = safeReadPlistFile(plistPath);

			if (previous && !current) return;
			setSnapshot(plistPath, current);

			if (!previous || !current) return;
			printDiffs(path.basename(plistPath, '.plist'), previous, current);
		});

		watcher.on('unlink', (plistPath) => {
			setSnapshot(plistPath, null);
		});

		watcher.on('ready', () => {
			console.log(styleText('green', 'Initial scan completed, watching…'));
		});

		watcher.on('error', (error) => {
			const e = error as NodeJS.ErrnoException;
			console.error(`${styleText('red', 'watch error:')} ${e.code} ${e.path}`);
		});

		process.once('SIGINT', () => watcher.close().finally(() => process.exit(0)));
		process.once('SIGTERM', () => watcher.close().finally(() => process.exit(0)));
	},
});

function safeReadPlistFile(plistPath: string) {
	try {
		return readPlistFile(plistPath);
	} catch (error) {
		console.log(`${styleText('red', 'read error:')} ${plistPath}\n  ${error}`);
		return null;
	}
}
