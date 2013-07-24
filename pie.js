define(['piepiece'], function(PiePiece) {
	'use strict';

	var Pie = cc.Node.extend({

		ctor:function() {
			this._super();
			this.piePieces = [];
			this.numberOfPieces;
			this.selectedPiece = null;

			this.pieCover = new cc.Sprite();
			this.pieCover.initWithFile(window.bl.getResource(this.pieCoverFilename));
			this.pieCover.setZOrder(1);
			this.addChild(this.pieCover);

			this.piePieceNode = new cc.Node();
			this.addChild(this.piePieceNode);


		},



		processTouch:function(touchLocation) {
			var pieceSelected = null;
			var touchRelative = this.convertToNodeSpace(touchLocation);
			var radius = this.pieCover.getBoundingBox().size.width/2;
			var centre = this.getAnchorPointInPoints();
			if (cc.pDistance(touchRelative, centre) < radius) {
				var xDifference = touchRelative.x - centre.x;
				var yDifference = touchRelative.y - centre.y;
				var angle = Math.atan2(xDifference, yDifference);
				angle = angle.numberInCorrectRange(0, Math.PI * 2);
				for (var i = 0; i < this.piePieces.length; i++) {
					var piece = this.piePieces[i];
					if (angle > piece.startAngle && angle < piece.endAngle) {
						this.selectedPiece = piece;
						piece.setVisible(false);
						pieceSelected = piece;
					};
				};
			};
			return pieceSelected;
		},

		removeSelectedPiePiece:function() {
			this.selectedPiece.removeFromParent();
			var selectedPieceIndex = this.piePieces.indexOf(this.selectedPiece);
			this.piePieces.splice(selectedPieceIndex, 1);
			for (var i = 0; i < this.piePieces.length; i++) {
				this.piePieces[i].setPiePiece(i+1, this.numberOfPieces);
			};
		},

		addPiePiece:function() {
			var piePiece = new PiePiece();
			piePiece.setPiePiece(this.piePieces.length + 1, this.numberOfPieces);
			this.piePieceNode.addChild(piePiece);
			this.piePieces.push(piePiece);
		},

		roomForOneMore:function() {
			return this.piePieces.length < this.numberOfPieces;
		},

	})

	return Pie

})