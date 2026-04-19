import type { PlistDict, PlistValue } from './plist-values.ts';
import { XmlElement, parseXml } from './xml.ts';

export function parsePlistXml(xml: string) {
	const documentNode = parseXml(xml);
	const plistNode = documentNode.getSoleChild('plist');
	const dictNode = plistNode.getSoleChild('dict');

	return parseElementValue(dictNode) as PlistDict;
}

function parseElementValue(node: XmlElement): PlistValue {
	switch (node.name) {
		case 'string':
			return { type: 'string', value: node.text };
		case 'integer':
			return { type: 'int', value: node.text.trim() };
		case 'real':
			return { type: 'float', value: node.text.trim() };
		case 'true':
			return { type: 'bool', value: true };
		case 'false':
			return { type: 'bool', value: false };
		case 'date':
			return { type: 'date', value: node.text.trim() };
		case 'data':
			const value = Buffer.from(node.text.replace(/\s+/g, ''), 'base64').toString('hex');
			return { type: 'data', value };
		case 'array':
			return parseArray(node);
		case 'dict':
			return parseDict(node);
		default:
			throw new Error(`Unknown plist element: <${node.name}>.`);
	}
}

function parseDict(node: XmlElement): PlistDict {
	const result: Record<string, PlistValue> = { };

	for (let index = 0; index < node.children.length; index += 2) {
		const keyNode = node.children[index];
		if (keyNode.name !== 'key') throw new Error('Expected <key>.');

		result[keyNode.text] = parseElementValue(node.children[index + 1]);
	}

	return { type: 'dict', value: result };
}

function parseArray(node: XmlElement): Extract<PlistValue, { type: 'array' }> {
	const elements = node.children.map(parseElementValue);
	return { type: 'array', value: elements };
}
