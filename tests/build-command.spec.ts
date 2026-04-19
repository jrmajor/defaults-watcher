import { styleText } from 'node:util';
import { describe, expect, it } from 'vitest';
import { buildDeleteCommand, buildWriteCommand } from '../src/build-command.ts';

describe('write command', () => {
	it('builds write command for string/date values', () => {
		expect(buildWriteCommand('com.apple.finder', 'Apple Languages', { type: 'string', value: "en'US" })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', "'Apple Languages'")} ${styleText('cyan', '-string')} ${styleText('cyan', '\'en\'"\'"\'US\'')}`,
		);
		expect(buildWriteCommand('com.apple.finder', 'SULastCheckTime', { type: 'date', value: '2026-04-19T09:18:17Z' })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'SULastCheckTime')} ${styleText('cyan', '-date')} ${styleText('cyan', "'2026-04-19T09:18:17Z'")}`,
		);
	});

	it('builds write command for numeric values', () => {
		expect(buildWriteCommand('com.apple.finder', 'iconSize', { type: 'int', value: '16' })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'iconSize')} ${styleText('cyan', '-int')} ${styleText('cyan', '16')}`,
		);
		expect(buildWriteCommand('com.apple.finder', 'ratio', { type: 'float', value: '1.5' })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'ratio')} ${styleText('cyan', '-float')} ${styleText('cyan', '1.5')}`,
		);
	});

	it('builds write command for bool values', () => {
		expect(buildWriteCommand('com.apple.finder', 'ShowPathbar', { type: 'bool', value: true })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'ShowPathbar')} ${styleText('cyan', '-bool')} ${styleText('cyan', 'true')}`,
		);
		expect(buildWriteCommand('com.apple.finder', 'ShowPathbar', { type: 'bool', value: false })).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'write')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'ShowPathbar')} ${styleText('cyan', '-bool')} ${styleText('cyan', 'false')}`,
		);
	});

	it('returns null for unsupported value types', () => {
		expect(buildWriteCommand('com.apple.finder', 'FavoriteTagNames', {
			type: 'array',
			value: [{ type: 'string', value: 'Red' }],
		})).toBeNull();

		expect(buildWriteCommand('com.apple.finder', 'ComputerViewSettings', {
			type: 'dict',
			value: { ShowPathbar: { type: 'bool', value: true } },
		})).toBeNull();
	});
});

describe('delete command', () => {
	it('builds delete command for regular domain', () => {
		expect(buildDeleteCommand('com.apple.finder', 'ShowPathbar')).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'delete')} ${styleText('magenta', 'com.apple.finder')} ${styleText('magenta', 'ShowPathbar')}`,
		);
	});

	it('builds delete command for global domain and quotes key', () => {
		expect(buildDeleteCommand('.GlobalPreferences', 'Apple Languages')).toBe(
			`${styleText('blue', 'defaults')} ${styleText('cyan', 'delete')} ${styleText('yellow', '-g')} ${styleText('magenta', "'Apple Languages'")}`,
		);
	});
});
