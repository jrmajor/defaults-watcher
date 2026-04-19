import { expect, it } from 'vitest';
import { deepEqual } from '../src/plist-values.ts';

it('compares string values', () => {
	expect(deepEqual(
		{ type: 'string', value: 'finder' },
		{ type: 'string', value: 'finder' },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'string', value: 'finder' },
		{ type: 'string', value: 'dock' },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'string', value: 'finder' },
		{ type: 'int', value: '1' },
	)).toBe(false);
});

it('compares int values', () => {
	expect(deepEqual(
		{ type: 'int', value: '16' },
		{ type: 'int', value: '16' },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'int', value: '16' },
		{ type: 'int', value: '17' },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'int', value: '1' },
		{ type: 'float', value: '1' },
	)).toBe(false);
});

it('compares float values', () => {
	expect(deepEqual(
		{ type: 'float', value: '1.5' },
		{ type: 'float', value: '1.5' },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'float', value: '1.5' },
		{ type: 'float', value: '1.6' },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'float', value: '1.5' },
		{ type: 'date', value: '2026-04-19T09:18:17Z' },
	)).toBe(false);
});

it('compares bool values', () => {
	expect(deepEqual(
		{ type: 'bool', value: true },
		{ type: 'bool', value: true },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'bool', value: true },
		{ type: 'bool', value: false },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'bool', value: true },
		{ type: 'string', value: 'true' },
	)).toBe(false);
});

it('compares date values', () => {
	expect(deepEqual(
		{ type: 'date', value: '2026-04-19T09:18:17Z' },
		{ type: 'date', value: '2026-04-19T09:18:17Z' },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'date', value: '2026-04-19T09:18:17Z' },
		{ type: 'date', value: '2026-04-20T09:18:17Z' },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'date', value: '2026-04-19T09:18:17Z' },
		{ type: 'data', value: 'MjAyNi0wNC0xOVQwOToxODoxN1o=' },
	)).toBe(false);
});

it('compares data values', () => {
	expect(deepEqual(
		{ type: 'data', value: 'YXNkZg==' },
		{ type: 'data', value: 'YXNkZg==' },
	)).toBe(true);
	expect(deepEqual(
		{ type: 'data', value: 'YXNkZg==' },
		{ type: 'data', value: 'Zm9v' },
	)).toBe(false);
	expect(deepEqual(
		{ type: 'data', value: 'YXNkZg==' },
		{ type: 'string', value: 'YXNkZg==' },
	)).toBe(false);
});

it('compares arrays deeply and in order', () => {
	const left = {
		type: 'array' as const,
		value: [
			{ type: 'string' as const, value: 'Red' },
			{
				type: 'dict' as const,
				value: {
					enabled: { type: 'bool' as const, value: true },
					size: { type: 'int' as const, value: '16' },
				},
			},
		],
	};
	const equal = {
		type: 'array' as const,
		value: [
			{ type: 'string' as const, value: 'Red' },
			{
				type: 'dict' as const,
				value: {
					enabled: { type: 'bool' as const, value: true },
					size: { type: 'int' as const, value: '16' },
				},
			},
		],
	};
	const reordered = {
		type: 'array' as const,
		value: [
			{
				type: 'dict' as const,
				value: {
					enabled: { type: 'bool' as const, value: true },
					size: { type: 'int' as const, value: '16' },
				},
			},
			{ type: 'string' as const, value: 'Red' },
		],
	};
	const shorter = {
		type: 'array' as const,
		value: [{ type: 'string' as const, value: 'Red' }],
	};

	expect(deepEqual(left, equal)).toBe(true);
	expect(deepEqual(left, reordered)).toBe(false);
	expect(deepEqual(left, shorter)).toBe(false);
	expect(deepEqual(left, { type: 'dict', value: { } })).toBe(false);
});

it('compares dicts deeply regardless of key order', () => {
	const left = {
		type: 'dict' as const,
		value: {
			ShowPathbar: { type: 'bool' as const, value: true },
			ComputerViewSettings: {
				type: 'dict' as const,
				value: {
					IconSize: { type: 'float' as const, value: '16' },
					Columns: {
						type: 'array' as const,
						value: [
							{ type: 'string' as const, value: 'name' },
							{ type: 'string' as const, value: 'dateModified' },
						],
					},
				},
			},
		},
	};
	const equalDifferentOrder = {
		type: 'dict' as const,
		value: {
			ComputerViewSettings: {
				type: 'dict' as const,
				value: {
					Columns: {
						type: 'array' as const,
						value: [
							{ type: 'string' as const, value: 'name' },
							{ type: 'string' as const, value: 'dateModified' },
						],
					},
					IconSize: { type: 'float' as const, value: '16' },
				},
			},
			ShowPathbar: { type: 'bool' as const, value: true },
		},
	};
	const missingKey = {
		type: 'dict' as const,
		value: {
			ShowPathbar: { type: 'bool' as const, value: true },
		},
	};
	const changedNestedValue = {
		type: 'dict' as const,
		value: {
			ShowPathbar: { type: 'bool' as const, value: true },
			ComputerViewSettings: {
				type: 'dict' as const,
				value: {
					IconSize: { type: 'float' as const, value: '32' },
					Columns: {
						type: 'array' as const,
						value: [
							{ type: 'string' as const, value: 'name' },
							{ type: 'string' as const, value: 'dateModified' },
						],
					},
				},
			},
		},
	};

	expect(deepEqual(left, equalDifferentOrder)).toBe(true);
	expect(deepEqual(left, missingKey)).toBe(false);
	expect(deepEqual(left, changedNestedValue)).toBe(false);
	expect(deepEqual(left, { type: 'array', value: [] })).toBe(false);
});
