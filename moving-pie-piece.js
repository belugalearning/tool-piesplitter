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

			this.dragPoint = this.pointAwayFromCentre(this.radius * 7/12, 0);
		},
	})

	return MovingPiePiece;


/*				var dragPointX = this.piePieceBox.origin.x + this.piePieceBox.size.width/2 + radius/2 * Math.cos(midAngle);
			var dragPointY = this.piePieceBox.origin.y + this.piePieceBox.size.height/2 + radius/2 * Math.sin(midAngle);
			this.dragPoint = cc.p(dragPointX, dragPointY);
*/
})