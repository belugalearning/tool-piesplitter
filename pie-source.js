define(['pie', 'piepiece'], function(Pie, PiePiece) {
	'use strict';

	var PieSource = Pie.extend({
		pieCoverFilename:'pie_cover',
		
		ctor:function() {
			this._super();

			this.pieCover.setPosition(0, -3);

			var fullPiePiece = new PiePiece();
			this.piePieceNode.addChild(fullPiePiece);
			fullPiePiece.setPiePiece(1,1);
		},

		split:function() {
			this.piePieceNode.removeAllChildren();
			for (var i = 1; i <= this.numberOfPieces; i++) {
				var piePiece = new PiePiece();
				piePiece.setPiePiece(i, this.numberOfPieces);
				this.piePieceNode.addChild(piePiece);
				this.piePieces.push(piePiece);

			};
		},

		addPiePiece:function() {
			if (this.roomForOneMore()) {
				this._super();
				return true;
			} else {
				return false;
			};
		},
	})

	return PieSource;
})