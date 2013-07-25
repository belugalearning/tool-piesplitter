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

                  this.dividend = 6;
                  this.divisor = 6;
                  this.splitted;

                  this.movingPiePiece = null;
                  this.selectedPie = null;

                  this.mainNode = new cc.Node();
                  this.addChild(this.mainNode);
                  this.setupMainNode();

                  var menuBackground = new cc.Sprite();
                  menuBackground.initWithFile(window.bl.getResource('button_tabs'));
                  menuBackground.setPosition(size.width - menuBackground.getContentSize().width/2, 600);
                  this.addChild(menuBackground);

                  var resetUnpressedTexture = window.bl.getResource('reset_button');
                  var resetPressedTexture = window.bl.getResource('reset_button_pressed');
                  var resetButton = cc.MenuItemImage.create(resetUnpressedTexture, resetPressedTexture, this.reset, this);
                  resetButton.setPosition(0, 45);

                  var splitUnpressedTexture = window.bl.getResource('split_button');
                  var splitPressedTextrue = window.bl.getResource('split_button_pressed');
                  var splitButton = cc.MenuItemImage.create(splitUnpressedTexture, splitPressedTextrue, this.split, this);
                  splitButton.setPosition(0, -48);

                  var splitResetMenu = cc.Menu.create(resetButton, splitButton);
                  splitResetMenu.setPosition(menuBackground.getAnchorPointInPoints());
                  menuBackground.addChild(splitResetMenu);

                  return this;
            },

            setupMainNode:function() {
                  this.pieSourceRowNodes = [];
                  this.pieHoleRowNodes = [];
                  this.pieSources = [];
                  this.pieHoles = [];
                  this.setupPieNode(true);
                  this.setupPieNode(false);
                  this.splitted = false;
            },


            setupPieNode:function(isSource) {

                  var pieClass = isSource ? PieSource : PieHole
                  var pieArray = isSource ? this.pieSources : this.pieHoles;
                  var pieRowNodes = isSource ? this.pieSourceRowNodes : this.pieHoleRowNodes;
                  var numberOfPies = isSource ? this.dividend : this.divisor;

                  var pieNode = new cc.Node();
                  var yPositionFraction = isSource ? 3/4 : 1/4;
                  pieNode.setPosition(this.size.width/2, this.size.height * yPositionFraction);
                  this.mainNode.addChild(pieNode);

                  for (var i = 0; i < numberOfPies; i++) {
                        var pie = new pieClass();
                        pie.numberOfPieces = this.divisor;
                        pieArray.push(pie);
                  };

                  if (pieArray.length <= 5) {
                        this.setupPieRow(pieArray, pieRowNodes);
                  } else {
                        this.setupPieRow(pieArray.slice(0, 5), pieRowNodes);
                        this.setupPieRow(pieArray.slice(5), pieRowNodes);
                  };
                  pieRowNodes.spaceNodesLinear(0, -160);

                  for (var i = 0; i < pieRowNodes.length; i++) {
                        pieNode.addChild(pieRowNodes[i]);
                  };
            },

            setupPieRow:function(pies, pieRowNodes) {
                  var pieRow = new cc.Node();
                  for (var i = 0; i < pies.length; i++) {
                        pieRow.addChild(pies[i]);
                  };
                  pies.spaceNodesLinear(160, 0);
                  pieRowNodes.push(pieRow);
            },

            reset:function() {
                  this.clearMainNode();
                  this.setupMainNode();
            },

            clearMainNode:function() {
                  this.mainNode.removeAllChildren();
            },

            resetMainNodeWithNumbers:function(dividend, divisor) {
                  this.dividend = dividend;
                  this.divisor = divisor;
                  this.reset();
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