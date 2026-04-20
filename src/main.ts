import { styleText } from 'node:util';
import { createWatcher } from './watcher.ts';

export async function main() {
	const watcher = createWatcher();

	watcher.on('ready', () => {
		console.log(styleText('green', 'Initial scan completed, watching…'));
	});

	watcher.on('error', (error) => {
		const e = error as NodeJS.ErrnoException;
		console.error(`${styleText('red', 'watch error:')} ${e.code} ${e.path}`);
	});

	process.once('SIGINT', () => watcher.close().finally(() => process.exit(0)));
	process.once('SIGTERM', () => watcher.close().finally(() => process.exit(0)));
}
