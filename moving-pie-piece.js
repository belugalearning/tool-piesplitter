define(['piepiece'], function(PiePiece) {
	'use strict';

	var MovingPiePiece = PiePiece.extend({
		ctor:function() {
			this._super();

			this.dragPoint = null;

			var movingCover = new cc.Sprite();
			movingCover.initWithFile(window.bl.getResource('big_bubble'));
			movingCover.setZOrder(1);
			movingCover.setPosition(this.piePieceBackground.getAnchorPointInPoints());
			this.piePieceBackground.addChild(movingCover);
		},

		setPiePiece:function(section, fraction) {
			this._super(section, fraction);
			if (fraction > 1) {
				this.dragPoint = this.pointAwayFromCentre(this.radius * 7/12, 0);
			} else {
				this.dragPoint = this.getAnchorPointInPoints();
			};
		},
	})

	return MovingPiePiece;
})