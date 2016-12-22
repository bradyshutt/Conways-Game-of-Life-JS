"use strict";
var cell_1 = require("./cell");
var Board = (function () {
    function Board(args) {
        this.args = args;
        args.cellSize = args.cellSize || 10;
        this.width = args.canvas.width;
        this.height = args.canvas.height;
        this.context = args.context;
        this.tiles = [];
        this.numXCells = this.width / args.cellSize;
        this.numYCells = this.height / (args.cellHeight || args.cellSize);
        this.cellFactory = new cell_1.CellFactory({
            context: args.context,
            cellWidth: args.cellSize,
            cellHeight: args.cellHeight || args.cellSize
        });
        this.constructBoard();
    }
    Board.prototype.constructBoard = function () {
        for (var x = 0; x < this.numXCells; x++) {
            var col = [];
            for (var y = 0; y < this.numYCells; y++) {
                var cell = this.cellFactory.createCell(x, y);
                col.push(cell);
            }
            this.tiles.push(col);
        }
    };
    Board.prototype.draw = function () {
        this.eachCell(function (cell) { return cell.draw(); });
    };
    Board.prototype.eachCell = function (func) {
        this.tiles.forEach(function (col) { return col.forEach(func); });
    };
    Board.prototype.clear = function () {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.width, this.height);
    };
    Board.prototype.update = function () {
        var _this = this;
        this.eachCell(function (cell) {
            var numLiveCells = _this.getNumLiveNeighbors(cell);
            if (cell.isAlive) {
                if (numLiveCells > 3) {
                    cell.die();
                }
                else if (numLiveCells === 3) {
                }
                else if (numLiveCells < 2) {
                    cell.die();
                }
            }
            else if (!cell.isAlive && numLiveCells > 2) {
                cell.spawn();
            }
        });
        return this;
    };
    Board.prototype.getCell = function (coordinates, x, y) {
        return this.tiles[coordinates.x || x][coordinates.y || y];
    };
    Board.prototype.getNeighbor = function (cell, direction) {
        var coordinates = {
            x: cell.coordinates.x,
            y: cell.coordinates.y
        };
        switch (direction) {
            case Directions.Up:
                coordinates.y -= 1;
                break;
            case Directions.Right:
                coordinates.x += 1;
                break;
            case Directions.Down:
                coordinates.y += 1;
                break;
            case Directions.Left:
                coordinates.y -= 1;
                break;
        }
        return (this.validateCoordinates(coordinates)
            ? this.getCell(coordinates)
            : null);
    };
    Board.prototype.validateCoordinates = function (coordinates) {
        return (coordinates.x > -1 &&
            coordinates.y > -1 &&
            coordinates.x < this.numXCells &&
            coordinates.y < this.numYCells);
    };
    Board.prototype.getNumLiveNeighbors = function (cell) {
        var numLive = 0;
        if (this.getNeighbor(cell, Directions.Up).isAlive)
            numLive++;
        if (this.getNeighbor(cell, Directions.Right).isAlive)
            numLive++;
        if (this.getNeighbor(cell, Directions.Down).isAlive)
            numLive++;
        if (this.getNeighbor(cell, Directions.Left).isAlive)
            numLive++;
        return numLive;
    };
    ;
    Board.prototype.randomize = function (likelyhood) {
        if (likelyhood === void 0) { likelyhood = 5; }
        this.eachCell(function (cell) {
            var random = ~~(Math.random() * 100);
            if (random < likelyhood)
                cell.spawn();
            else
                cell.die();
        });
        return this;
    };
    return Board;
}());
exports.Board = Board;
var Directions;
(function (Directions) {
    Directions[Directions["Up"] = 0] = "Up";
    Directions[Directions["Right"] = 1] = "Right";
    Directions[Directions["Down"] = 2] = "Down";
    Directions[Directions["Left"] = 3] = "Left";
})(Directions || (Directions = {}));
//# sourceMappingURL=board.js.map