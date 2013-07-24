define(['piepiece'], function(PiePiece) {
	'use strict';

	var Pie = cc.Node.extend({

		ctor:function() {
			this._super();
			this.piePieces = [];
			this.numberOfPieces;

			this.piePieceCover = new cc.Sprite();
			this.piePieceCover.initWithFile(window.bl.getResource('pie_cover'));
			this.piePieceCover.setPosition(0, -5);
			this.piePieceCover.setZOrder(1);
			this.addChild(this.piePieceCover);

			this.piePieceNode = new cc.Node();
			this.addChild(this.piePieceNode);

			var fullPiePiece = new PiePiece();
			this.piePieceNode.addChild(fullPiePiece);
			fullPiePiece.setPiePiece(1,1);
		},

		split:function() {
			this.piePieceNode.removeAllChildren();
			this.numberOfPieces = 10;
			for (var i = 1; i <= this.numberOfPieces; i++) {
				var piePiece = new PiePiece();
				piePiece.setPiePiece(i, this.numberOfPieces);
				this.piePieceNode.addChild(piePiece);
				this.piePieces.push(piePiece);
				// var fraction = i * 2 * Math.PI/this.numberOfPieces - Math.PI/(this.numberOfPieces);
/*				var position = cc.p(100 * Math.sin(fraction), 100 * Math.cos(fraction));
				var action = cc.MoveBy.create(0.8, position);
				var actionReverse = action.reverse();
				var seq = cc.Sequence.create(action, actionReverse);
				var repeatForever = cc.RepeatForever.create(seq);
				piePiece.runAction(repeatForever);
*/			};
		},

		processTouch:function(touchLocation) {
			var touchRelative = this.convertToNodeSpace(touchLocation);
			var radius = this.piePieceCover.getBoundingBox().size.width/2;
			var centre = this.getAnchorPointInPoints();
			if (cc.pDistance(touchRelative, centre) < radius) {
				var xDifference = touchRelative.x - centre.x;
				var yDifference = touchRelative.y - centre.y;
				var angle = Math.atan2(xDifference, yDifference);
				angle = angle.numberInCorrectRange(0, Math.PI * 2);
				for (var i = 0; i < this.piePieces.length; i++) {
					var piece = this.piePieces[i];
					if (angle > piece.startAngle && angle < piece.endAngle) {
						
					};
				};
			};
		},

	})

	return Pie

})