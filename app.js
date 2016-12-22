'use strict';
var conway_1 = require("./conway");
var canvas = document.getElementById('board');
var context = canvas.getContext('2d');
var game = new conway_1.Conway(canvas, context);
document.documentElement.addEventListener('keydown', function (event) {
    if (event.keyCode == 13) {
        if (!game.isRunning) {
            game.start();
        }
        else {
            game.stop();
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight - document.getElementById('head').clientHeight;
        }
    }
});
//# sourceMappingURL=app.js.map