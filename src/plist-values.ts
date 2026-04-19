export type PlistValue
	= | { type: 'string', value: string }
		| { type: 'int', value: string }
		| { type: 'float', value: string }
		| { type: 'bool', value: boolean }
		| { type: 'date', value: string }
		| { type: 'data', value: string }
		| { type: 'array', value: PlistValue[] }
		| { type: 'dict', value: Record<string, PlistValue> };

export type ScalarNode = Extract<PlistValue, { type: 'bool' | 'int' | 'float' | 'string' | 'date' | 'data' }>;
export type PlistDict = Extract<PlistValue, { type: 'dict' }>;
