import { expect, it } from 'vitest';
import { parsePlistXml } from '../src/plist-parse.ts';

it('can parse simple literals', () => {
	expect(parsePlistXml(`
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
		<plist version="1.0">
		<dict>
			<key>BulkRenameAddTextText</key>
			<string>-dark</string>
			<key>BulkRenameReplaceText</key>
			<string></string>
			<key>BulkRenameAddNumberTo</key>
			<integer>0</integer>
			<key>iconSize</key>
			<real>16</real>
			<key>ShowSidebar</key>
			<true/>
			<key>ShowStatusBar</key>
			<false/>
			<key>SULastCheckTime</key>
			<date>2026-04-19T09:18:17Z</date>
		</dict>
		</plist>
	`)).toEqual({
		type: 'dict',
		value: {
			BulkRenameAddTextText: { type: 'string', value: '-dark' },
			BulkRenameReplaceText: { type: 'string', value: '' },
			BulkRenameAddNumberTo: { type: 'int', value: '0' },
			iconSize: { type: 'float', value: '16' },
			ShowSidebar: { type: 'bool', value: true },
			ShowStatusBar: { type: 'bool', value: false },
			SULastCheckTime: { type: 'date', value: '2026-04-19T09:18:17Z' },
		},
	});
});

it('can parse nested dicts', () => {
	expect(parsePlistXml(`
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
		<plist version="1.0">
		<dict>
			<key>ComputerViewSettings</key>
			<dict>
				<key>CustomViewStyleVersion</key>
				<integer>1</integer>
				<key>ExtendedListViewSettingsV2</key>
				<dict>
					<key>calculateAllSizes</key>
					<true/>
					<key>viewOptionsVersion</key>
					<integer>1</integer>
				</dict>
			</dict>
		</dict>
		</plist>
	`)).toEqual({
		type: 'dict',
		value: {
			ComputerViewSettings: {
				type: 'dict',
				value: {
					CustomViewStyleVersion: { type: 'int', value: '1' },
					ExtendedListViewSettingsV2: {
						type: 'dict',
						value: {
							calculateAllSizes: { type: 'bool', value: true },
							viewOptionsVersion: { type: 'int', value: '1' },
						},
					},
				},
			},
		},
	});
});

it('can parse arrays', () => {
	expect(parsePlistXml(`
		<?xml version="1.0" encoding="UTF-8"?>
		<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
		<plist version="1.0">
		<dict>
			<key>FavoriteTagNames</key>
			<array>
				<string>Red</string>
				<string>Orange</string>
				<string>Yellow</string>
			</array>
			<key>columns</key>
			<array>
				<dict>
					<key>identifier</key>
					<string>name</string>
				</dict>
				<dict>
					<key>identifier</key>
					<string>ubiquity</string>
				</dict>
			</array>
		</plist>
	`)).toEqual({
		type: 'dict',
		value: {
			FavoriteTagNames: {
				type: 'array',
				value: [
					{ type: 'string', value: 'Red' },
					{ type: 'string', value: 'Orange' },
					{ type: 'string', value: 'Yellow' },
				],
			},
			columns: {
				type: 'array',
				value: [
					{ type: 'dict', value: { identifier: { type: 'string', value: 'name' } } },
					{ type: 'dict', value: { identifier: { type: 'string', value: 'ubiquity' } } },
				],
			},
		},
	});
});
