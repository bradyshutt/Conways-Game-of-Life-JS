'use strict';
var board_1 = require("./board");
var Conway = (function () {
    function Conway(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.delay = 70;
        this.isRunning = false;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.getElementById('head').clientHeight;
        this.board = new board_1.Board({
            canvas: this.canvas,
            context: this.context,
            cellSize: 20
        });
    }
    Conway.prototype.start = function () {
        this.isRunning = true;
        this.run(this.delay);
    };
    Conway.prototype.run = function (delay, iterations) {
        var _this = this;
        iterations = iterations || 9999;
        var loop = setInterval(function () {
            if (!_this.isRunning || !--iterations) {
                clearInterval(loop);
                _this.isRunning = false;
            }
            else {
                _this.board.update().draw();
            }
        }, delay);
    };
    Conway.prototype.stop = function () {
        this.isRunning = false;
        this.reset();
    };
    Conway.prototype.reset = function () {
        this.board.clear();
        this.board.randomize(70).draw();
    };
    return Conway;
}());
exports.Conway = Conway;
//# sourceMappingURL=conway.js.map