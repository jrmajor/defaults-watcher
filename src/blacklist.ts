import path from 'node:path';

export const BLACKLIST: Record<string, string[]> = {
	// can't be read using defaults
	'com.apple.biometrickitd': ['*'],
	'com.apple.powerlogd': ['*'],

	// noisy / not useful
	'com.apple.Accessibility.Assets': ['*'],
	'com.apple.CallHistorySyncHelper': ['*'],
	'com.apple.DataDeliveryServices': ['*'],
	'com.apple.DuetExpertCenter.AppPredictionExpert': ['*'],
	'com.apple.GenerativeFunctions.GenerativeFunctionsInstrumentation': ['*'],
	'com.apple.accessibility.heard': ['*'],
	'com.apple.accessory.Hearing': ['*'],
	'com.apple.amsengagementd': ['*'],
	'com.apple.appleintelligencereporting': ['*'],
	'com.apple.cseventlistener': ['*'],
	'com.apple.dataaccess.babysitter': ['*'],
	'com.apple.dock': ['recent-apps'],
	'com.apple.facetime.bag': ['*'],
	'com.apple.imessage.bag': ['*'],
	'com.apple.inputAnalytics.serverStats': ['*'],
	'com.apple.liveactivitiesd': ['*'],
	'com.apple.mmcs': ['*'],
	'com.apple.remindd': ['*'],
	'com.apple.security.cloudkeychainproxy3.keysToRegister': ['*'],
	'com.apple.spotlightknowledge': ['*'],
	'com.apple.xpc.activity2': ['*'],
};

export function isBlacklisted(domain: string, key: string) {
	const matchers = regexByDomain.get(domain) ?? [];
	return matchers.some((regex) => regex.test(key));
}

const regexByDomain = new Map(
	Object.entries(BLACKLIST).map(([domain, patterns]) => [
		domain,
		patterns.map((pattern: string) => {
			const source = RegExp.escape(pattern).replaceAll('\\*', '.*');
			return new RegExp(`^${source}$`);
		}),
	]),
);
