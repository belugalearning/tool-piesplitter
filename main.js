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

define(['pie', 'piepiece', 'movingpiepiece', 'piesource', 'piehole', 'piesplittersettingslayer', 'blbutton', 'draggable', 'exports', 'cocos2d', 'toollayer', 'qlayer'], function(Pie, PiePiece, MovingPiePiece, PieSource, PieHole, PieSplitterSettingsLayer, BLButton, Draggable, exports, cocos2d, ToolLayer, QLayer) {
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

                  this.prefill = true;

                  this.questionDividend = 3;
                  this.questionDivisor = 4;

                  this.dividend = this.prefill ? this.questionDividend : 0;
                  this.divisor = this.prefill ? this.questionDivisor : 0;
                  this.splitted;
                  this.pieSourceNodePosition = cc.p(130, 320);
                  this.pieHoleNodePosition = cc.p(130, 60);

                  this.movingPiePiece = null;
                  this.selectedPie = null;

                  var title = new cc.Sprite();
                  title.initWithFile(window.bl.getResource('title'));
                  title.setPosition(size.width/2, 710);
                  this.addChild(title);

                  var dragOnTabs = new cc.Sprite();
                  this.dragOnTabs = dragOnTabs;
                  dragOnTabs.initWithFile(window.bl.getResource('drag_tabs'));
                  dragOnTabs.setPosition(dragOnTabs.getContentSize().width/2, 450);
                  this.addChild(dragOnTabs);

                  var questionBox = new cc.Sprite();
                  questionBox.initWithFile(window.bl.getResource('question_tray'));
                  questionBox.setPosition(size.width/2, 610);
                  this.addChild(questionBox);

                  this.questionLabel = new cc.LabelTTF.create(this.questionDividend + " divided by " + this.questionDivisor, "mikadoBold", 40);
                  this.questionLabel.setPosition(cc.pAdd(questionBox.getAnchorPointInPoints(), cc.p(0, 4)));
                  questionBox.addChild(this.questionLabel);

                  var menuBackground = new cc.Sprite();
                  menuBackground.initWithFile(window.bl.getResource('button_tabs'));
                  menuBackground.setPosition(size.width - menuBackground.getContentSize().width/2, 450);
                  this.addChild(menuBackground);

                  var resetUnpressedTexture = window.bl.getResource('reset_button');
                  var resetPressedTexture = window.bl.getResource('reset_button_pressed');
                  var resetButton = cc.MenuItemImage.create(resetUnpressedTexture, resetPressedTexture, this.resetFromButton, this);
                  resetButton.setPosition(0, 45);

                  var splitUnpressedTexture = window.bl.getResource('split_button');
                  var splitPressedTextrue = window.bl.getResource('split_button_pressed');
                  this.splitButton = cc.MenuItemImage.create(splitUnpressedTexture, splitPressedTextrue, this.split, this);
                  this.splitButton.setPosition(0, -48);

                  var splitResetMenu = cc.Menu.create(resetButton, this.splitButton);
                  splitResetMenu.setPosition(menuBackground.getAnchorPointInPoints());
                  menuBackground.addChild(splitResetMenu);

                  this.mainNode = new cc.Node();
                  this.addChild(this.mainNode);
                  this.setupMainNode();

                  this.settingsLayer = new PieSplitterSettingsLayer();
                  this.addChild(this.settingsLayer);
                  this.settingsLayer.setNumbers(this.questionDividend, this.questionDivisor);
                  this.settingsLayer.setPrefill(this.prefill);

                  return this;
            },

            setupMainNode:function() {
                  this.currentPiesNode = new cc.Node();
                  this.mainNode.addChild(this.currentPiesNode);

                  var pieSourceReturnArray = this.setupPieNode(true, this.dividend, this.divisor);
                  this.pieSourceNode = pieSourceReturnArray[0];
                  this.pieSources = pieSourceReturnArray[1];
                  this.pieSourceNode.setPosition(this.pieSourceNodePosition);
                  this.currentPiesNode.addChild(this.pieSourceNode);

                  var pieHoleNodeReturnArray = this.setupPieNode(false, this.dividend, this.divisor);
                  this.pieHoleNode = pieHoleNodeReturnArray[0];
                  this.pieHoles = pieHoleNodeReturnArray[1];
                  this.pieHoleNode.setPosition(this.pieHoleNodePosition);
                  this.currentPiesNode.addChild(this.pieHoleNode);
                  this.splitted = false;

                  this.extraSourceNode = new cc.Node();
                  this.mainNode.addChild(this.extraSourceNode);
                  this.extraSourceNode.setVisible(false);

                  var extraSourceSourcesArray = this.setupPieNode(true, Math.min(10, this.dividend + 1), this.divisor);
                  var extraSourceSources = extraSourceSourcesArray[0];
                  extraSourceSources.setPosition(this.pieSourceNodePosition);
                  this.extraSourceNode.addChild(extraSourceSources);
                  var extraPies = extraSourceSourcesArray[1];
                  extraPies[extraPies.length - 1].setOpacity(128);

                  var extraSourceHolesArray = this.setupPieNode(false, Math.min(10, this.dividend + 1), this.divisor);
                  var extraSourceHoles = extraSourceHolesArray[0];
                  extraSourceHoles.setPosition(this.pieHoleNodePosition);
                  this.extraSourceNode.addChild(extraSourceHoles);

                  this.extraHoleNode = new cc.Node();
                  this.mainNode.addChild(this.extraHoleNode);
                  this.extraHoleNode.setVisible(false);

                  var extraHoleSourcesArray = this.setupPieNode(true, this.dividend, Math.min(10, this.divisor + 1));
                  var extraHoleSources = extraHoleSourcesArray[0];
                  extraHoleSources.setPosition(this.pieSourceNodePosition);
                  this.extraHoleNode.addChild(extraHoleSources);

                  var extraHoleHolesArray = this.setupPieNode(false, this.dividend, Math.min(10, this.divisor + 1));
                  var extraHoleHoles = extraHoleHolesArray[0];
                  this.extraHoleNode.addChild(extraHoleHoles);
                  extraHoleHoles.setPosition(this.pieHoleNodePosition);
                  var extraHoles = extraHoleHolesArray[1];
                  extraHoles[extraHoles.length - 1].setOpacity(128);

                  this.dragSourceButton = this.setupDragPieButton(true);
                  this.dragHoleButton = this.setupDragPieButton(false);
                  if (this.prefill) {
                        this.dragSourceButton.setUseable(false);
                        this.dragHoleButton.setUseable(false);
                  };


                  if (this.divisor === 0) {
                        this.splitButton.setOpacity(128);
                        this.splitButton.setEnabled(false);
                  } else {
                        this.splitButton.setOpacity(255);
                        this.splitButton.setEnabled(true);
                  };
            },


            setupPieNode:function(isSource, dividend, divisor) {
                  var pieClass = isSource ? PieSource : PieHole
                  var pieArray = [];
                  var pieRowNodes = [];
                  var numberOfPies = isSource ? dividend : divisor;
                  var verticalSpacing = isSource ? 130 : 150;
                  var horizontalSpacing = 170;

                  var pieNode = new cc.Node();
                  var rowsNode = new cc.Node();
                  rowsNode.setPosition(330, 65);
                  pieNode.addChild(rowsNode);

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
                        rowsNode.addChild(pieRowNodes[i]);
                  };

                  pieNode.setContentSize(cc.SizeMake(800, 230));

                  return [pieNode, pieArray];
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
                  this.splitButton.setOpacity(255);
                  this.splitButton.setEnabled(true);
                  this.clearMainNode();
                  this.setupMainNode();
            },

            resetFromButton:function() {
                  if (this.prefill) {
                        this.reset();
                  } else {
                        this.resetMainNodeWithNumbers(0, 0);
                  };
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
                        this.splitButton.setOpacity(128);
                        this.splitButton.setEnabled(false);
                  };
            },

            onTouchesBegan:function(touches, event) {
                  var touch = touches[0];
                  var touchLocation = this.convertTouchToNodeSpace(touch);
                  if (this.splitted) {
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

            setupDragPieButton:function(isSource) {
                  var filename = isSource ? 'drag_pie' : 'drag_bubble';
                  var position = isSource ? cc.p(52, 143) : cc.p(62, 55);
                  var extraNode = isSource ? this.extraSourceNode : this.extraHoleNode;
                  var classToCreate = isSource ? PieSource : PieHole;
                  var boundaryNode = isSource ? this.pieSourceNode : this.pieHoleNode;

                  var self = this;

                  var correctedPosition = this.dragOnTabs.convertToWorldSpace(position);

                  var dragDummyButton = new cc.Sprite();
                  dragDummyButton.initWithFile(window.bl.getResource(filename));
                  dragDummyButton.setPosition(correctedPosition);
                  this.mainNode.addChild(dragDummyButton);

                  var dragButton = new Draggable();
                  this.dragButton = dragButton;
                  var movingPieSource = new classToCreate();
                  dragButton.initWithSprite(movingPieSource);
                  var position = this.dragOnTabs.convertToWorldSpace(position);
                  dragButton.setPosition(correctedPosition);
                  dragButton.setScale(0.5);
                  this.mainNode.addChild(dragButton);
                  dragButton.setZoomOnTouchDown(false);
                  dragButton.setVisible(false);
                  dragButton.alreadyTouched = false;
                  dragButton.dummyButton = dragDummyButton;

                  var extraVisible = false;

                  var startDraggablePie = function() {
                        var scaleUp = cc.ScaleTo.create(0.3, 1);
                        this.runAction(scaleUp);
                        this.setVisible(true);
                  };
                  dragButton.onTouchDown(startDraggablePie);

                  var moveDraggablePie = function() {
                        if (cc.rectContainsPoint(boundaryNode.getBoundingBox(), dragButton.getPosition())) {
                              if (!extraVisible) {
                                    self.currentPiesNode.setVisible(false);
                                    extraNode.setVisible(true);
                                    extraVisible = true;
                              };
                        } else {
                              if (extraVisible) {
                                    self.currentPiesNode.setVisible(true);
                                    extraNode.setVisible(false);
                                    extraVisible = false;
                              };
                        };
                  };
                  dragButton.onMoved(moveDraggablePie);

                  var stopDraggablePie = function() {
                        if (extraVisible) {
                              if (isSource) {
                                    self.resetMainNodeWithNumbers(self.dividend + 1, self.divisor);
                              } else {
                                    self.resetMainNodeWithNumbers(self.dividend, self.divisor + 1);
                              };
                              extraVisible = false;
                              if (self.dividend === 10) {
                                    self.dragSourceButton.setUseable(false);
                              };
                              if (self.divisor === 10) {
                                    self.dragHoleButton.setUseable(false);
                              };
                        };

                        this.returnToHomePosition();
                        this.setScale(0.5);
                        this.setVisible(false);

                  };
                  dragButton.onMoveEnded(stopDraggablePie);

                  dragButton.setUseable = function(useable) {
                        dragButton.setEnabled(useable);
                        var opacity = useable ? 255 : 128;
                        dragDummyButton.setOpacity(opacity);
                  }

                  return dragButton;
            },

            update:function() {
                  this._super();
                  var settings = this.settingsLayer;
                  if (settings.needToChange) {
                        this.questionDividend = settings.dividend;
                        this.questionDivisor = settings.divisor;
                        this.prefill = settings.prefill;
                        this.questionLabel.setString(this.questionDividend + " divided by " + this.questionDivisor);
                        if (this.prefill) {
                              this.resetMainNodeWithNumbers(settings.dividend, settings.divisor);
                        } else {
                              this.resetMainNodeWithNumbers(0,0);
                        };
                        settings.needToChange = false;
                  };
            },

      });

	exports.ToolLayer = Tool;

});