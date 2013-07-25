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
			this.positionMiniPies();
		},

		removeSelectedPiePiece:function() {
			this._super();
			if (this.piePieces.length === 0 && this.miniPies.length > 0) {
				this.removeMiniPie();
				this.fillPie();
			};
		},

		removeMiniPie:function() {
			this.miniPies[this.miniPies.length - 1].removeFromParent();
			this.miniPies.splice(this.miniPies.length - 1, 1);
			this.positionMiniPies();
		},

		positionMiniPies:function() {
			var spacingAngle = 2*Math.PI/9;
			var numberOfPies = this.miniPies.length;
			var baseAngle = Math.PI + (numberOfPies-1)/2 * -spacingAngle;
			var pieRadius = this.pieCover.getBoundingBox().size.width/2;
			var miniPieRadius = this.miniPies.length > 0 ? this.miniPies[0].getBoundingBox().size.width/2 : 0;
			var radius = pieRadius + miniPieRadius + 3;
			for (var i = 0; i < numberOfPies; i++) {
				var angle = baseAngle + i * spacingAngle;
				var xPosition = radius * Math.sin(angle);
				var yPosition = radius * Math.cos(angle);
				var miniPie = this.miniPies[i];
				miniPie.setPosition(xPosition, yPosition);
			};
		},

	})

	return PieHole;

})