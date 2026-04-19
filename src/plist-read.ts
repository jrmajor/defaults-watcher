import { execFileSync } from 'node:child_process';
import { parsePlistXml } from './plist-parse.ts';
import type { PlistDict } from './plist-values.ts';

export function readPlistFile(plistPath: string) {
	let xml: string;
	try {
		xml = execFileSync('plutil', ['-convert', 'xml1', '-o', '-', plistPath], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		});
	} catch (cause) {
		throw new Error('Failed to run plutil.', { cause });
	}

	let parsed: PlistDict;
	try {
		parsed = parsePlistXml(xml);
	} catch (cause) {
		throw new Error('Failed to parse plist XML.', { cause });
	}

	return parsed;
}
