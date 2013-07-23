define(['canvasclippingnode'], function(CanvasClippingNode) {
	'use strict';

	var PiePiece = cc.Node.extend({

		ctor:function() {
			this._super();

			var piePieceBackground = new cc.Sprite();
			piePieceBackground.initWithFile(window.bl.getResource('slice1'));
			this.piePieceBox = piePieceBackground.getBoundingBox();
			var piePieceCover = new cc.Sprite();
			piePieceCover.initWithFile(window.bl.getResource('pie_cover'));
			piePieceCover.setPosition(piePieceBackground.getAnchorPointInPoints());
			piePieceCover.setZOrder(1);
			piePieceBackground.addChild(piePieceCover);

			this.clippingNode = new CanvasClippingNode();
			this.addChild(this.clippingNode);
			this.clippingNode.drawPathToClip = function() {
				this.ctx.rect(this.piePieceBox.origin.x, this.piePieceBox.origin.y, this.piePieceBox.size.width, this.piePieceBox.size.height);
			}
			this.clippingNode.addChild(piePieceBackground);
			this.setPiePiece(1,1);
		},

		setPiePiece:function(section, fraction) {
			var midpointX = this.piePieceBox.origin.x + this.piePieceBox.size.width/2;
			var midpointY = this.piePieceBox.origin.y + this.piePieceBox.size.height/2;
			var radius = this.piePieceBox.size.width/2 + 1;
			var startAngle = (section - 1)/fraction * Math.PI * 2 - Math.PI/2;
			var endAngle = section/fraction * Math.PI * 2 - Math.PI/2;
			this.clippingNode.drawPathToClip = function() {
				this.ctx.beginPath();
				this.ctx.moveTo(midpointX, midpointY);
				this.ctx.arc(midpointX, midpointY, radius, startAngle, endAngle);
				this.ctx.lineTo(midpointX, midpointY);
				this.ctx.closePath();
			}
		},

	})

	return PiePiece;
})