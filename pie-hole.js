define(['pie', 'piepiece'], function(Pie, PiePiece) {
	'use strict';

	var PieHole = Pie.extend({
		pieCoverFilename:'big_bubble',

		ctor:function() {
			this._super();

			this.miniPies = [];
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

		addMiniPie:function() {
			var miniPie = new cc.Sprite();
			miniPie.initWithFile(window.bl.getResource('small_bubble'));
			miniPie.setPosition(0, -(this.miniPies.length * 40 + 75));
			this.miniPies.push(miniPie);
			this.addChild(miniPie);
		},

		removeSelectedPiePiece:function() {
			this._super();
			if (this.piePieces.length === 0 && this.miniPies.length > 0) {
				this.miniPies[this.miniPies.length - 1].removeFromParent();
				this.miniPies.splice(this.miniPies.length - 1, 1);
				this.fillPie();
			};
		},

	})

	return PieHole;

})