define(['piepiece'], function(PiePiece) {
	'use strict';

	var PieHole = cc.Node.extend({
		ctor:function() {
			this._super();

			this.fraction;

			this.piePieces = [];

			this.cover = new cc.Sprite();
			this.cover.initWithFile(window.bl.getResource('big_bubble'));
			this.cover.setZOrder(1);
			this.addChild(this.cover);
		},

		addPiePiece:function() {
			var piePiece = new PiePiece();
			piePiece.setPiePiece(this.piePieces.length + 1, this.fraction);
			this.addChild(piePiece);
			this.piePieces.push(piePiece);
		},
	})

	return PieHole;

})