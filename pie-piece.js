define(['canvasclippingnode'], function(CanvasClippingNode) {
	'use strict';

	var PiePiece = cc.Node.extend({

		ctor:function() {
			this._super();
			this.startAngle = null;
			this.endAngle = null;
			this.dragPoint = null;
			this.section = null;
			this.fraction = null;

			this.piePieceBackground = new cc.Sprite();
			this.piePieceBackground.initWithFile(window.bl.getResource('slice1'));
			this.piePieceBox = this.piePieceBackground.getBoundingBox();

			this.radius = this.piePieceBox.size.width/2 + 10;

			this.clippingNode = new CanvasClippingNode();
			this.addChild(this.clippingNode);
			var piePieceBox = this.piePieceBox;
			this.clippingNode.drawPathToClip = function() {
				this.ctx.rect(piePieceBox.origin.x, piePieceBox.origin.y, piePieceBox.size.width, piePieceBox.size.height);
			}
			this.clippingNode.addChild(this.piePieceBackground);
			// this.setPiePiece(1,3);
		},

		setPiePiece:function(section, fraction) {
			this.section = section;
			this.fraction = fraction;
			this.startAngle = (section - 1)/fraction * Math.PI * 2;
			this.endAngle = section/fraction * Math.PI * 2;
			var angle
			var innerPoint = this.pointAwayFromCentre(fraction/3, -Math.PI/2);

			var self = this;
			this.clippingNode.drawPathToClip = function() {
				this.ctx.beginPath();
				this.ctx.moveTo(innerPoint.y, innerPoint.x);
				this.ctx.arc(innerPoint.y, innerPoint.x, self.radius, self.startAngle - Math.PI/2, self.endAngle - Math.PI/2);
				this.ctx.lineTo(innerPoint.y, innerPoint.x);
				this.ctx.closePath();
			}
		},

		pointAwayFromCentre:function(distance, angleCorrection) {
			var midAngle = (this.startAngle + this.endAngle)/2 + angleCorrection;
			var inPointX = this.piePieceBox.origin.x + this.piePieceBox.size.width/2 + distance * Math.sin(midAngle);
			var inPointY = this.piePieceBox.origin.y + this.piePieceBox.size.height/2 + distance * Math.cos(midAngle);
			var inPoint = cc.p(inPointX, inPointY);
			return inPoint;
		},

	})

	return PiePiece;
})