define(['pie', 'piepiece'], function(Pie, PiePiece) {
	'use strict';

	var PieSource = Pie.extend({
		pieCoverFilename:'pie_cover',
		
		ctor:function() {
			this._super();

			var fullPiePiece = new PiePiece();
			this.piePieceNode.addChild(fullPiePiece);
			fullPiePiece.setPiePiece(1,1);
			this.piePieces.push(fullPiePiece);

			this.piePieceNode.setPosition(cc.pAdd(this.getAnchorPointInPoints(), cc.p(0, 3)));
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