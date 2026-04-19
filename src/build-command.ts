import { styleText } from 'node:util';
import type { PlistValue } from './plist-values.ts';

const GLOBAL_DOMAIN = '.GlobalPreferences';

export function buildWriteCommand(domain: string, key: string, value: PlistValue) {
	const commandValue = buildValue(value);
	if (!commandValue) return null;

	return formatCommand([
		{ type: 'command', value: 'defaults' },
		{ type: 'operation', value: 'write' },
		buildDomain(domain),
		{ type: 'key', value: formatShellWord(key) },
		...commandValue,
	]);
}

export function buildDeleteCommand(domain: string, key: string) {
	return formatCommand([
		{ type: 'command', value: 'defaults' },
		{ type: 'operation', value: 'delete' },
		buildDomain(domain),
		{ type: 'key', value: formatShellWord(key) },
	]);
}

function buildDomain(domain: string): Command[number] {
	if (domain === GLOBAL_DOMAIN) {
		return { type: 'globalDomain', value: '-g' };
	}
	return { type: 'domain', value: domain };
}

function buildValue(value: PlistValue): Command | null {
	let commandValue: string;

	if (value.type === 'bool') {
		commandValue = value.value ? 'true' : 'false';
	} else if (value.type === 'int' || value.type === 'float') {
		commandValue = value.value;
	} else if (value.type === 'string' || value.type === 'date') {
		commandValue = formatShellWord(value.value);
	} else if (value.type === 'data') {
		commandValue = value.value;
	} else {
		return null;
	}

	return [
		{ type: 'type', value: `-${value.type}` },
		{ type: 'value', value: commandValue },
	];
}

function formatShellWord(value: string) {
	if (/^[A-Za-z0-9._/-]+$/.test(value)) {
		return value;
	}

	return `'${value.split("'").join('\'"\'"\'')}'`;
}

type Command = Array<
	| { type: 'command', value: string }
	| { type: 'operation', value: string }
	| { type: 'globalDomain', value: string }
	| { type: 'domain', value: string }
	| { type: 'key', value: string }
	| { type: 'type', value: string }
	| { type: 'value', value: string }
>;

function formatCommand(command: Command) {
	return command.map(({ type, value }) => {
		switch (type) {
			case 'command':
				return styleText('blue', value);
			case 'operation':
				return styleText('cyan', value);
			case 'globalDomain':
				return styleText('yellow', value);
			case 'domain':
				return styleText('magenta', value);
			case 'key':
				return styleText('magenta', value);
			case 'type':
				return styleText('cyan', value);
			case 'value':
				return styleText('cyan', value);
			default:
				return value;
		}
	}).join(' ');
}
