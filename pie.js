define(['piepiece'], function(PiePiece) {
	'use strict';

	var Pie = cc.Sprite.extend({

		ctor:function() {
			this._super();
			this.piePieces = [];
			this.numberOfPieces;
			this.selectedPiece = null;

			this.initWithFile(window.bl.getResource(this.pieCoverFilename));
			this.setZOrder(1);

			this.piePieceNode = new cc.Node();
			this.piePieceNode.setZOrder(-1);
			this.addChild(this.piePieceNode);

			this.setContentSize(this.getContentSize());
			// this.setAnchorPoint(cc.pNeg(this.getAnchorPoint()));

		},

		processTouch:function(touchLocation) {
			var pieceSelected = null;
			var touchRelative = this.convertToNodeSpace(touchLocation);
			var radius = this.getBoundingBox().size.width/2;
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

		fillPie:function() {
			this.piePieceNode.removeAllChildren();
			this.piePieces = [];
			for (var i = 1; i <= this.numberOfPieces; i++) {
				var piePiece = new PiePiece();
				piePiece.setPiePiece(i, this.numberOfPieces);
				this.piePieceNode.addChild(piePiece);
				this.piePieces.push(piePiece);

			};
		},

		setOpacity:function(opacity) {
			this._super(opacity);
			for (var i = 0; i < this.piePieces.length; i++) {
				this.piePieces[i].setOpacity(opacity);
			};
		},

		setNumberOfPieces:function(numberOfPieces) {
			this.numberOfPieces = numberOfPieces;
		},
	})

	return Pie

})