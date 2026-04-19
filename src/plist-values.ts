export type PlistValue
	= | { type: 'string', value: string }
		| { type: 'int', value: string }
		| { type: 'float', value: string }
		| { type: 'bool', value: boolean }
		| { type: 'date', value: string }
		| { type: 'data', value: string }
		| { type: 'array', value: PlistValue[] }
		| { type: 'dict', value: Record<string, PlistValue> };

export type PlistDict = Extract<PlistValue, { type: 'dict' }>;

export function deepEqual(left: PlistValue, right: PlistValue): boolean {
	switch (left.type) {
		case 'array':
			if (right.type !== 'array') return false;
			if (left.value.length !== right.value.length) return false;
			return left.value.every((value, index) => deepEqual(value, right.value[index]));
		case 'dict':
			if (right.type !== 'dict') return false;

			const leftKeys = Object.keys(left.value);
			const rightKeys = Object.keys(right.value);
			if (leftKeys.length !== rightKeys.length) return false;

			for (const key of leftKeys) {
				if (!(key in right.value) || !deepEqual(left.value[key], right.value[key])) {
					return false;
				}
			}

			return true;
		default:
			return right.type === left.type && left.value === right.value;
	}
}
