require.config({
	paths: {
		'toollayer': '../../tools/common/toollayer',
            'canvasclippingnode': '../../tools/common/canvas-clipping-node',
            'pie': '../../tools/piesplitter/pie',
            'piepiece': '../../tools/piesplitter/pie-piece',
            'movingpiepiece': '../../tools/piesplitter/moving-pie-piece',
            'piesource': '../../tools/piesplitter/pie-source',
            'piehole': '../../tools/piesplitter/pie-hole'
	}
});

define(['pie', 'piepiece', 'movingpiepiece', 'piesource', 'piehole', 'exports', 'cocos2d', 'toollayer', 'qlayer'], function(Pie, PiePiece, MovingPiePiece, PieSource, PieHole, exports, cocos2d, ToolLayer, QLayer) {
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

                  this.dividend = 5;
                  this.divisor = 4;

                  this.movingPiePiece = null;
                  this.selectedPie = null;
                  this.splitted = false;

                  this.pieSources = [];
                  for (var i = 0; i < this.dividend; i++) {
                        var pieSource = new PieSource();
                        pieSource.setPosition(50 + size.width * i/this.dividend, size.height * 2/3);
                        pieSource.numberOfPieces = this.divisor;
                        this.pieSources.push(pieSource);
                        this.addChild(pieSource);
                  };

                  this.pieHoles = [];
                  for (var i = 0; i < this.divisor; i++) {
                        var pieHole = new PieHole();
                        pieHole.setPosition(50 + size.width * i/this.divisor, size.height * 1/3);
                        pieHole.numberOfPieces = this.divisor;
                        this.pieHoles.push(pieHole);
                        this.addChild(pieHole);
                  };

/*                  this.pieHole = new PieHole();
                  this.pieHole.setPosition(size.width * 1/2, size.height * 1/3);
                  this.pieHole.fraction = this.divisor;
                  this.addChild(this.pieHole);
*/
                  var splitMenu = cc.Menu.create();
                  this.addChild(splitMenu);

                  var split = cc.MenuItemFont.create("Split!", this.split, this);
                  split.setPosition(400, 0);
                  splitMenu.addChild(split);

                  return this;

            },

            pies:function() {
                  return this.pieSources.concat(this.pieHoles);
            },

            split:function() {
                  if (!this.splitted) {
                        for (var i = 0; i < this.pieSources.length; i++) {
                              this.pieSources[i].fillPie();
                        };
                        this.splitted = true;
                  };
            },

            onTouchesBegan:function(touches, event) {
                  var touch = touches[0];
                  var touchLocation = this.convertTouchToNodeSpace(touch);
                  var pies = this.pies();
                  for (var i = 0; i < pies.length; i++) {
                        var pie = pies[i];
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
                              var droppedInPieHole = false;
                              var pies = this.pies();
                              for (var i = 0; i < pies.length; i++) {
                                    var pie = pies[i];
                                    if (pie.pieCover.touched(touchLocation)) {
                                          if (pie.addPiePiece(this.movingPiePiece.fraction)) {
                                                this.selectedPie.removeSelectedPiePiece();
                                                droppedInPieHole = true;
                                          };
                                          break;
                                    }
                              };
                              if (!droppedInPieHole) {
                                    this.selectedPie.selectedPiece.setVisible(true);
                              };
                              this.movingPiePiece = null;
                        };
                  }
            },

      });

	exports.ToolLayer = Tool;

});