require.config({
	paths: {
		'toollayer': '../../tools/common/toollayer',
            'canvasclippingnode': '../../tools/common/canvas-clipping-node',
            'pie': '../../tools/piesplitter/pie',
            'piepiece': '../../tools/piesplitter/pie-piece',
            'movingpiepiece': '../../tools/piesplitter/moving-pie-piece',
            'piesource': '../../tools/piesplitter/pie-source',
            'piehole': '../../tools/piesplitter/pie-hole',
            'piesplittersettingslayer': '../../tools/piesplitter/pie-splitter-settings-layer',
            'buttonsprite': '../../tools/common/button-sprite'
	}
});

define(['pie', 'piepiece', 'movingpiepiece', 'piesource', 'piehole', 'piesplittersettingslayer', 'exports', 'cocos2d', 'toollayer', 'qlayer'], function(Pie, PiePiece, MovingPiePiece, PieSource, PieHole, PieSplitterSettingsLayer, exports, cocos2d, ToolLayer, QLayer) {
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
                  this.splitted;

                  this.movingPiePiece = null;
                  this.selectedPie = null;

                  var title = new cc.Sprite();
                  title.initWithFile(window.bl.getResource('title'));
                  title.setPosition(size.width/2, 710);
                  this.addChild(title);

                  this.mainNode = new cc.Node();
                  this.addChild(this.mainNode);
                  this.setupMainNode();

                  var questionBox = new cc.Sprite();
                  questionBox.initWithFile(window.bl.getResource('question_tray'));
                  questionBox.setPosition(size.width/2, 610);
                  this.addChild(questionBox);

                  this.questionLabel = new cc.LabelTTF.create(this.dividend + " divided by " + this.divisor, "mikadoBold", 40);
                  this.questionLabel.setPosition(cc.pAdd(questionBox.getAnchorPointInPoints(), cc.p(0, 4)));
                  questionBox.addChild(this.questionLabel);

                  var menuBackground = new cc.Sprite();
                  menuBackground.initWithFile(window.bl.getResource('button_tabs'));
                  menuBackground.setPosition(size.width - menuBackground.getContentSize().width/2, 450);
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

                  this.settingsLayer = new PieSplitterSettingsLayer();
                  this.addChild(this.settingsLayer);
                  this.settingsLayer.setNumbers(this.dividend, this.divisor);

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
                  var verticalSpacing = isSource ? 130 : 150;
                  var horizontalSpacing = 170;

                  var pieNode = new cc.Node();
                  var yPosition = isSource ? 440 : 180;
                  pieNode.setPosition(this.size.width/2, yPosition);
                  this.mainNode.addChild(pieNode);

                  for (var i = 0; i < numberOfPies; i++) {
                        var pie = new pieClass();
                        pie.numberOfPieces = this.divisor;
                        pieArray.push(pie);
                  };

                  if (pieArray.length <= 5) {
                        this.setupPieRow(pieArray, pieRowNodes, horizontalSpacing);
                  } else {
                        this.setupPieRow(pieArray.slice(0, 5), pieRowNodes, horizontalSpacing);
                        this.setupPieRow(pieArray.slice(5), pieRowNodes, horizontalSpacing);
                  };
                  pieRowNodes.spaceNodesLinear(0, -verticalSpacing);

                  for (var i = 0; i < pieRowNodes.length; i++) {
                        pieNode.addChild(pieRowNodes[i]);
                  };
            },

            setupPieRow:function(pies, pieRowNodes, spacing) {
                  var pieRow = new cc.Node();
                  for (var i = 0; i < pies.length; i++) {
                        pieRow.addChild(pies[i]);
                  };
                  pies.spaceNodesLinear(spacing, 0);
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

            update:function() {
                  this._super();
                  var settings = this.settingsLayer;
                  if (settings.needToChangePies) {
                        this.resetMainNodeWithNumbers(settings.dividend, settings.divisor);
                        this.questionLabel.setString(settings.dividend + " divided by " + settings.divisor);
                        settings.needToChangePies = false;
                  };
            },

      });

	exports.ToolLayer = Tool;

});