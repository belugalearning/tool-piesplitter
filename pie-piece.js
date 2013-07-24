define(['canvasclippingnode'], function(CanvasClippingNode) {
	'use strict';

	var PiePiece = cc.Node.extend({

		ctor:function() {
			this._super();
			// this.startAngle = null;
			// this.endAngle = null;

			var piePieceBackground = new cc.Sprite();
			piePieceBackground.initWithFile(window.bl.getResource('slice1'));
			this.piePieceBox = piePieceBackground.getBoundingBox();



			this.clippingNode = new CanvasClippingNode();
			this.addChild(this.clippingNode);
			var piePieceBox = this.piePieceBox;
			this.clippingNode.drawPathToClip = function() {
				this.ctx.rect(piePieceBox.origin.x, piePieceBox.origin.y, piePieceBox.size.width, piePieceBox.size.height);
			}
			this.clippingNode.addChild(piePieceBackground);
			// this.setPiePiece(1,3);
		},

		setPiePiece:function(section, fraction) {
			var angleCorrection = Math.PI/2;
			var radius = this.piePieceBox.size.width/2 + 10;
			this.startAngle = (section - 1)/fraction * Math.PI * 2;
			this.endAngle = section/fraction * Math.PI * 2;
			var midAngle = (this.startAngle + this.endAngle)/2 - angleCorrection;
			var innerPointX = this.piePieceBox.origin.x + this.piePieceBox.size.width/2 + fraction/3 * Math.cos(midAngle);
			var innerPointY = this.piePieceBox.origin.y + this.piePieceBox.size.height/2 + fraction/3 * Math.sin(midAngle);
			var self = this;
			this.clippingNode.drawPathToClip = function() {
				this.ctx.beginPath();
				this.ctx.moveTo(innerPointX, innerPointY);
				this.ctx.arc(innerPointX, innerPointY, radius, self.startAngle - angleCorrection, self.endAngle - angleCorrection);
				this.ctx.lineTo(innerPointX, innerPointY);
				this.ctx.closePath();
			}
		},

	})

	return PiePiece;
})