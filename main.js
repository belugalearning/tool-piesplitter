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

                  this.pie = new Pie();
                  this.pie.setPosition(size.width/2, size.height/2);
                  this.addChild(this.pie);

                  var splitMenu = cc.Menu.create();
                  this.addChild(splitMenu);

                  var split = cc.MenuItemFont.create("Split!", this.split, this);
                  split.setPosition(400, 0);
                  splitMenu.addChild(split);

                  return this;

            },

            split:function() {
                  this.pie.split();
            },

            onTouchesBegan:function(touches, event) {
                  var touch = touches[0];
                  var touchLocation = this.convertTouchToNodeSpace(touch);
                  this.pie.processTouch(touchLocation);
            },

      });

	exports.ToolLayer = Tool;

});