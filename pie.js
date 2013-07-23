define(['piepiece'], function(PiePiece) {
	'use strict';

	var Pie = cc.Node.extend({

		ctor:function() {
			this._super();

			var piePiece = new PiePiece();
			this.addChild(piePiece);
		},

	})

	return Pie

})