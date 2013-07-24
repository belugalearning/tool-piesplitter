require.config({
	paths: {
		'toollayer': '../../tools/common/toollayer',
            'canvasclippingnode': '../../tools/common/canvas-clipping-node',
            'pie': '../../tools/piesplitter/pie',
            'piepiece': '../../tools/piesplitter/pie-piece',
            'movingpiepiece': '../../tools/piesplitter/moving-pie-piece',
            'piehole': '../../tools/piesplitter/pie-hole'
	}
});

define(['pie', 'piepiece', 'movingpiepiece', 'piehole', 'exports', 'cocos2d', 'toollayer', 'qlayer'], function(Pie, PiePiece, MovingPiePiece, PieHole, exports, cocos2d, ToolLayer, QLayer) {
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

                  this.movingPiePiece = null;
                  this.selectedPie = null;

                  this.pies = [];
                  for (var i = 0; i < this.dividend; i++) {
                        var pie = new Pie();
                        pie.setPosition(150 + size.width * i/this.dividend, size.height * 2/3);
                        pie.numberOfPieces = this.divisor;
                        this.pies.push(pie);
                        this.addChild(pie);
                  };

/*                  this.pie = new Pie();
                  this.pie.setPosition(size.width * 1/3, size.height/2);
                  this.pie.numberOfPieces = this.divisor;
                  this.addChild(this.pie);
*/
                  this.pieHole = new PieHole();
                  this.pieHole.setPosition(size.width * 1/2, size.height * 1/3);
                  this.pieHole.fraction = this.divisor;
                  this.addChild(this.pieHole);

                  var splitMenu = cc.Menu.create();
                  this.addChild(splitMenu);

                  var split = cc.MenuItemFont.create("Split!", this.split, this);
                  split.setPosition(400, 0);
                  splitMenu.addChild(split);

                  return this;

            },

            split:function() {
                  for (var i = 0; i < this.pies.length; i++) {
                        this.pies[i].split();
                  };
            },

            onTouchesBegan:function(touches, event) {
                  var touch = touches[0];
                  var touchLocation = this.convertTouchToNodeSpace(touch);
                  for (var i = 0; i < this.pies.length; i++) {
                        var pie = this.pies[i];
                        var selectedPiece = pie.processTouch(touchLocation);
                        if (selectedPiece !== null) {
                              this.movingPiePiece = new MovingPiePiece();
                              this.movingPiePiece.setPiePiece(selectedPiece.section, selectedPiece.fraction);
                              this.movingPiePiece.setPosition(cc.pSub(touchLocation, this.movingPiePiece.dragPoint));
                              this.addChild(this.movingPiePiece);
                              this.selectedPie = pie;
                              break;
                        };
                  };
            },

            onTouchesMoved:function(touches, event) {
                  var touch = touches[0];
                  var touchLocation = this.convertTouchToNodeSpace(touch);
                  if (this.movingPiePiece !== null) {
                        this.movingPiePiece.setPosition(cc.pSub(touchLocation, this.movingPiePiece.dragPoint));
                  };
            },

            onTouchesEnded:function(touches, event) {
                  if (touches.length > 0) {
                        var touch = touches[0];
                        var touchLocation = this.convertTouchToNodeSpace(touch);
                        if (this.movingPiePiece !== null) {
                              this.movingPiePiece.removeFromParent();
                              if (this.pieHole.cover.touched(touchLocation)) {
                                    this.pieHole.addPiePiece(this.movingPiePiece.fraction);
                                    this.selectedPie.removeSelectedPiePiece();
                              } else {
                                    this.selectedPie.selectedPiece.setVisible(true);
                              };
                              this.movingPiePiece = null;
                        };
                  }
            },

      });

	exports.ToolLayer = Tool;

});