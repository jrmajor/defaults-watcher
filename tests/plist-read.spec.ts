import path from 'node:path';
import { expect, it } from 'vitest';
import { readPlistFile } from '../src/plist-read.ts';

it('can read a plist file', () => {
	const plistPath = path.join(
		import.meta.dirname,
		'plist-read.fixture.plist',
	);

	expect(readPlistFile(plistPath)).toEqual({
		type: 'dict',
		value: { TestPasses: { type: 'bool', value: true } },
	});
});
