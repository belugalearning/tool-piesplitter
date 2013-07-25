define(['settingslayer', 'buttonsprite'], function(SettingsLayer, ButtonSprite) {

	var PieSplitterSettingsLayer = SettingsLayer.extend({
		backgroundFilename:'settings_BG',
		settingsButtonPosition:cc.p(56, 600),

		ctor:function() {
			this._super();

			var dividendLabel = new cc.LabelTTF.create("Dividend:", "mikadoBold", 36);
			dividendLabel.setPosition(300, 600);
			this.background.addChild(dividendLabel);

			this.dividendPickerBoxNode = this.createPickerBoxNode();
			this.dividendPickerBoxNode.setPosition(600, 600);
			this.background.addChild(this.dividendPickerBoxNode);

			var divisorLabel = new cc.LabelTTF.create("Divisor:", "mikadoBold", 34);
			divisorLabel.setPosition(300, 400);
			this.background.addChild(divisorLabel);

			this.divisorPickerBoxNode = this.createPickerBoxNode();
			this.divisorPickerBoxNode.setPosition(600, 400);
			this.background.addChild(this.divisorPickerBoxNode);
		},

		createPickerBoxNode:function() {
			var pickerBoxNode = new cc.Node();

            var upButton = new ButtonSprite();
            upButton.initWithFile(window.bl.getResource('up_arrow'));
            upButton.setPosition(0, 50);
            // upButton.pressFunction = 
            upButton.target = this;
            pickerBoxNode.addChild(upButton);

            var downButton = new cc.Sprite();
            downButton.initWithFile(window.bl.getResource('down_arrow'));
            downButton.setPosition(0, -58);
            // downButton.pressFunction = 
            downButton.target = this;
            pickerBoxNode.addChild(downButton);

            var pickerBox = new cc.Sprite();
            pickerBox.initWithFile(window.bl.getResource('numberbox'));
            pickerBoxNode.addChild(pickerBox);

            this.digitLabel = new cc.LabelTTF.create("", "mikadoBold", 70);
            this.digitLabel.setPosition(cc.pAdd(this.getAnchorPointInPoints(), cc.p(-3,1)));
            this.addChild(this.digitLabel);



            return pickerBoxNode;
		},

	})

	return PieSplitterSettingsLayer;

})