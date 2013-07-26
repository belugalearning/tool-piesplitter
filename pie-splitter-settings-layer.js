define(['settingslayer', 'buttonsprite'], function(SettingsLayer, ButtonSprite) {

	var PieSplitterSettingsLayer = SettingsLayer.extend({
		backgroundFilename:'settings_BG',
		settingsButtonPosition:cc.p(56, 710),

		ctor:function() {
			this._super();

			var size = this.size;

			this.startDividend;
			this.startDivisor;
			this.needToChangePies = false;

			var dividendNode = new cc.Node();
			dividendNode.setPosition(size.width/2, size.height * 2/3);
			this.background.addChild(dividendNode);

			var dividendLabel = new cc.LabelTTF.create("Dividend:", "mikadoBold", 36);
			dividendLabel.setPosition(-100, 0);
			dividendNode.addChild(dividendLabel);

			this.dividendPickerBoxNode = this.createPickerBoxNode(true);
			this.dividendPickerBoxNode.setPosition(100, 0);
			dividendNode.addChild(this.dividendPickerBoxNode);

			var divisorNode = new cc.Node();
			divisorNode.setPosition(size.width/2, size.height * 1/3);
			this.background.addChild(divisorNode);

			var divisorLabel = new cc.LabelTTF.create("Divisor:", "mikadoBold", 34);
			divisorLabel.setPosition(-100, 0);
			divisorNode.addChild(divisorLabel);

			this.divisorPickerBoxNode = this.createPickerBoxNode(false);
			this.divisorPickerBoxNode.setPosition(100, 0);
			divisorNode.addChild(this.divisorPickerBoxNode);
		},

		createPickerBoxNode:function(isDividend) {
			var pickerBoxNode = new cc.Node();

			pickerBoxNode.upButton = new ButtonSprite();
            var upButton = pickerBoxNode.upButton;
            upButton.initWithFile(window.bl.getResource('up_arrow'));
            upButton.setPosition(0, 50);
            upButton.pressFunction = this.changeNumber; 
            upButton.target = this;
            upButton.argumentsToPass = [true, isDividend];
            pickerBoxNode.addChild(upButton);

            pickerBoxNode.downButton = new ButtonSprite();
            var downButton = pickerBoxNode.downButton;
            downButton.initWithFile(window.bl.getResource('down_arrow'));
            downButton.setPosition(0, -58);
            downButton.pressFunction = this.changeNumber;
            downButton.target = this;
            downButton.argumentsToPass = [false, isDividend];
            pickerBoxNode.addChild(downButton);

            var pickerBox = new cc.Sprite();
            pickerBox.initWithFile(window.bl.getResource('numberbox'));
            pickerBoxNode.addChild(pickerBox);

            pickerBoxNode.digitLabel = new cc.LabelTTF.create("", "mikadoBold", 45);
            pickerBoxNode.digitLabel.setPosition(pickerBox.getAnchorPointInPoints());
            pickerBox.addChild(pickerBoxNode.digitLabel);

            this.touchProcessors.push(upButton, downButton);



            return pickerBoxNode;
		},

		setNumbers:function(dividend, divisor) {
			this.dividend = dividend;
			this.divisor = divisor;
			this.dividendPickerBoxNode.digitLabel.setString(dividend);
			this.divisorPickerBoxNode.digitLabel.setString(divisor);
			this.startDividend = this.startDividend || dividend;
			this.startDivisor = this.startDivisor || divisor; 
		},

		changeNumber:function() {
			var isIncrease = arguments[0][0];
			var isDividend = arguments[0][1];
			if (isDividend) {
				if (isIncrease && this.dividend < 10) {
					this.dividend++;
				} else if (!isIncrease && this.dividend > 0) {
					this.dividend--;
				};
			} else {
				if (isIncrease && this.divisor < 10) {
					this.divisor++;
				} else if (!isIncrease && this.divisor > 1) {
					this.divisor--;
				};
			};
			this.setNumbers(this.dividend, this.divisor);
		},

		processOpenSettings:function() {
			this.startDividend = this.dividend;
			this.startDivisor = this.divisor;
			this._super();
		},

		processCloseSettings:function() {
			this.needToChangePies = this.startDividend !== this.dividend || this.startDivisor !== this.divisor;
			this._super();
		},
	})

	return PieSplitterSettingsLayer;

})