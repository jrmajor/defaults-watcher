import path from 'node:path';

export const BLACKLIST: Record<string, string[]> = {
	// no permissions
	'com.apple.AddressBook': ['*'],
	'com.apple.MobileSMS': ['*'],
	'com.apple.MobileSMS.CKDNDList': ['*'],
	'com.apple.TimeMachine': ['*'],
	'com.apple.apsd': ['*'],
	'com.apple.homed': ['*'],
	'com.apple.homed.notbackedup': ['*'],
	'com.apple.mail-shared': ['*'],
	'com.apple.messages.pinning': ['*'],
	'com.apple.networkextension.uuidcache': ['*'],
	'com.apple.wifi.known-networks': ['*'],
	'com.openai.sky.CUAService': ['*'],
	'org.cups.printers': ['*'],

	// can't be read using defaults
	'com.apple.biometrickitd': ['*'],
	'com.apple.powerlogd': ['*'],

	// noisy / not useful
	TokenBucketRateLimiter: ['SKDUserDefaultsRoot'],
	'app.kaleidoscope.v4': ['RecentDocuments'],
	'com.apple.Accessibility.Assets': ['*'],
	'com.apple.AudioAccessory': ['*'],
	'com.apple.CallHistorySyncHelper': ['*'],
	'com.apple.DataDeliveryServices': ['*'],
	'com.apple.DuetExpertCenter.AppPredictionExpert': ['*'],
	'com.apple.GenerativeFunctions.GenerativeFunctionsInstrumentation': ['*'],
	'com.apple.MenuBarAgent': ['MenuBarAnalytics.lastReportedTrailingItemCount'],
	'com.apple.accessibility.heard': ['*'],
	'com.apple.accessory.Hearing': ['*'],
	'com.apple.amsengagementd': ['*'],
	'com.apple.appleintelligencereporting': ['*'],
	'com.apple.cseventlistener': ['*'],
	'com.apple.dataaccess.babysitter': ['*'],
	'com.apple.dock': ['mod-count', 'recent-apps'],
	'com.apple.facetime.bag': ['*'],
	'com.apple.imessage.bag': ['*'],
	'com.apple.inputAnalytics.serverStats': ['*'],
	'com.apple.liveactivitiesd': ['*'],
	'com.apple.mmcs': ['*'],
	'com.apple.remindd': ['*'],
	'com.apple.security.cloudkeychainproxy3.keysToRegister': ['*'],
	'com.apple.spotlightknowledge': ['*'],
	'com.apple.spotlightknowledged.pipeline': ['SKDUserDefaultsRoot'],
	'com.apple.xpc.activity2': ['*'],
	'com.contextsformac.Contexts': ['CTUsageCount*'],
	'com.openai.codex': ['DockIconCacheRefreshToken'],
	'com.raycast.macos': ['commandScheduler_commandRuns'],
	'com.segment.storage.ewjp2RGpYO4hHSErQ3lBOOjnR0YqolJo': ['segment.events'],
	'company.thebrowser.Browser': ['mostRecentUpdateDownloadTime'],
};

export function isFileBlacklisted(filePath: string) {
	return fullyBlacklistedDomains.has(path.basename(filePath, '.plist'));
}

export function isBlacklisted(domain: string, key: string) {
	const matchers = regexByDomain.get(domain) ?? [];
	return matchers.some((regex) => regex.test(key));
}

const fullyBlacklistedDomains = new Set(
	Object.entries(BLACKLIST)
		.filter(([, patterns]) => patterns.includes('*'))
		.map(([domain]) => domain),
);

const regexByDomain = new Map(
	Object.entries(BLACKLIST).map(([domain, patterns]) => [
		domain,
		patterns.map((pattern: string) => {
			const source = RegExp.escape(pattern).replaceAll('\\*', '.*');
			return new RegExp(`^${source}$`);
		}),
	]),
);
