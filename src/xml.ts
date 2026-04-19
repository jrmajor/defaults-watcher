import { XMLParser } from 'fast-xml-parser';

const xmlParser = new XMLParser({
	preserveOrder: true,
	ignoreAttributes: true,
	parseTagValue: false,
});

type RawXmlNode = { '#text': string } | Record<string, RawXmlNode[]>;

export class XmlElement {
	name: string;
	children: XmlElement[];
	text: string;

	constructor({ name, children, text }: {
		name: string;
		children: XmlElement[];
		text: string;
	}) {
		this.name = name;
		this.children = children;
		this.text = text;
	}

	getSoleChild(name: string) {
		const children = this.children.filter((child) => child.name === name);
		if (children.length !== 1) {
			throw new Error(`Expected 1 child with name ${name}, got ${children.length}.`);
		}
		return children[0];
	}
}

export function parseXml(xml: string): XmlElement {
	const documentNodes = xmlParser.parse(xml) as RawXmlNode[];
	return toElement('document', documentNodes);
}

function toElement(name: string, children: RawXmlNode[]): XmlElement {
	let text = '';
	const elementChildren: XmlElement[] = [];

	for (const child of children) {
		if ('#text' in child) {
			text += child['#text'];
			continue;
		}

		const [[childName, childChildren]] = Object.entries(child);
		elementChildren.push(toElement(childName, childChildren));
	}

	return new XmlElement({ name, children: elementChildren, text });
}
