require.config({
	paths: {
		'toollayer': '../../tools/common/toollayer',
            'canvasclippingnode': '../../tools/common/canvas-clipping-node',
            'pie': '../../tools/piesplitter/pie',
            'piepiece': '../../tools/piesplitter/pie-piece'
	}
});

define(['pie', 'exports', 'cocos2d', 'toollayer', 'qlayer'], function(Pie, exports, cocos2d, ToolLayer, QLayer) {
	'use strict';

	window.bl.toolTag = 'piesplitter';

	var Tool = ToolLayer.extend({

		init:function() {
			this._super();

			this.setTouchEnabled(true);

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(window.bl.getResource('images_deep_water_background'));
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            this.dividend = 3;
            this.divisor = 4;

/*            this.fullBubbles = [];

            for (var i = 0; i < this.dividend; i++) {
            	var bubble = new cc.Sprite();
            	bubble.initWithFile(window.bl.getResource('expanded_slice1'));
            	bubble.setPosition(300 + 200 * i, 500);
            	this.addChild(bubble);
            };*/

            var pie = new Pie();
            pie.setPosition(size.width/2, size.height/2);
            this.addChild(pie);

            return this;

		},

	});

	exports.ToolLayer = Tool;

});