import { buildApplication } from '@stricli/core';
import { watch } from './watch.ts';

export const app = buildApplication(
	watch,
	{ name: 'defaults-watcher' },
);
