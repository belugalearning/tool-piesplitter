define(['pie', 'piepiece'], function(Pie, PiePiece) {
	'use strict';

	var PieHole = Pie.extend({
		pieCoverFilename:'big_bubble',

		ctor:function() {
			this._super();

			this.miniPies = [];
		},

		addMiniPie:function() {
			var miniPie = new cc.Sprite();
			miniPie.initWithFile(window.bl.getResource('small_bubble'));
			miniPie.setPosition(0, -(this.miniPies.length + 1) * 30);
			this.miniPies.push(miniPie);
			this.addChild(miniPie);
		},

		addPiePiece:function() {
			if (!this.roomForOneMore()) {
				this.piePieceNode.removeAllChildren();
				this.piePieces = [];
				this.addMiniPie();
			};
			this._super();
			return true;
		},
	})

	return PieHole;

})