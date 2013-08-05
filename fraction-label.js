define([], function() {

	var FractionLabel = cc.Node.extend({
		ctor:function() {
			this._super();

			this.wholeLableNormalPosition = cc.p(-13, 0);
				
			this.wholeLabel = new cc.LabelTTF.create("", "mikadoBold", 20);
			this.wholeLabel.setPosition(this.wholeLableNormalPosition);
			this.addChild(this.wholeLabel);

			this.fractionNode = new cc.Node();
			this.addChild(this.fractionNode);

			this.numeratorLabel = new cc.LabelTTF.create("", "mikadoBold", 15);
			this.numeratorLabel.setPosition(0, 9);
			this.fractionNode.addChild(this.numeratorLabel);

			var bar = new cc.Sprite();
			bar.initWithFile(window.bl.getResource('single_white_pixel'));
			bar.setScaleX(10);
			bar.setScaleY(3);
			this.fractionNode.addChild(bar);

			this.denominatorLabel = new cc.LabelTTF.create("", "mikadoBold", 15);
			this.denominatorLabel.setPosition(0, -9);
			this.fractionNode.addChild(this.denominatorLabel);
		},

		setFraction:function(whole, numerator, denominator) {
			var wholeString = whole === 0 && numerator !== 0 ? "" : whole;
			if (numerator === 0) {
				this.fractionNode.setVisible(false);
				this.wholeLabel.setPosition(0,0);
			} else {
				this.fractionNode.setVisible(true);
				this.wholeLabel.setPosition(this.wholeLableNormalPosition);
			};
			this.wholeLabel.setString(wholeString + "");
			this.numeratorLabel.setString(numerator + "");
			this.denominatorLabel.setString(denominator + "");
		},

	})

	return FractionLabel;

})