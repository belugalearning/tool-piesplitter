define(['settingslayer'], function(SettingsLayer) {

	var PieSplitterSettingsLayer = SettingsLayer.extend({
		backgroundFilename:'settings_BG',
		settingsButtonPosition:cc.p(56, 600),

	})

	return PieSplitterSettingsLayer;

})