(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./conway":4}],2:[function(require,module,exports){
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
        this.tiles.forEach(function (col) { return col.forEach(function (c) {
            func(c);
        }); });
    };
    Board.prototype.clear = function () {
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this.width, this.height);
    };
    Board.prototype.reset = function () {
        this.eachCell(function (cell) { return cell.die(); });
    };
    Board.prototype.update = function () {
        var _this = this;
        // let dupTiles = this.duplicateGrid();
        // let fakeBoard = {
        //   tiles: dupTiles
        // };
        //
        // this.eachCell.call(fakeBoard, (fakeCell) => {
        //
        // });
        //
        this.eachCell(function (cell) {
            var numLiveCells = _this.getNumLiveNeighbors(cell);
            if (cell.isAlive) {
                if (numLiveCells > 3) {
                    cell.willDie();
                }
                else if (numLiveCells < 2) {
                    cell.willDie();
                }
            }
            else if (numLiveCells === 3) {
                cell.willSpawn();
            }
        });
        this.eachCell(function (cell) { return cell.update(); });
        return this;
    };
    Board.prototype.getCell = function (coordinates) {
        var col = this.tiles[coordinates.x];
        if (!col)
            return null;
        return col[coordinates.y];
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
    Board.prototype.getNeighbors = function (c) {
        var ns = [];
        ns.push(this.getCell({ x: c.coordinates.x - 1, y: c.coordinates.y + 1 }));
        ns.push(this.getCell({ x: c.coordinates.x - 1, y: c.coordinates.y }));
        ns.push(this.getCell({ x: c.coordinates.x - 1, y: c.coordinates.y - 1 }));
        ns.push(this.getCell({ x: c.coordinates.x, y: c.coordinates.y + 1 }));
        ns.push(this.getCell({ x: c.coordinates.x, y: c.coordinates.y - 1 }));
        ns.push(this.getCell({ x: c.coordinates.x + 1, y: c.coordinates.y + 1 }));
        ns.push(this.getCell({ x: c.coordinates.x + 1, y: c.coordinates.y }));
        ns.push(this.getCell({ x: c.coordinates.x + 1, y: c.coordinates.y - 1 }));
        return ns.filter(function (cell) { return cell; });
    };
    Board.prototype.getNumLiveNeighbors = function (cell) {
        var neighbors = this.getNeighbors(cell);
        return neighbors.filter(function (n) { return n.isAlive; }).length;
        // console.log('.');
        // let numLive = 0;
        // let checkCell;
        // checkCell = this.getNeighbor(cell, Directions.Up);
        // if (checkCell && checkCell.isAlive)
        //   numLive++;
        // checkCell = this.getNeighbor(cell, Directions.Right);
        // if (checkCell && checkCell.isAlive)
        //   numLive++;
        // checkCell = this.getNeighbor(cell, Directions.Down);
        // if (checkCell && checkCell.isAlive)
        //   numLive++;
        // checkCell = this.getNeighbor(cell, Directions.Left);
        // if (checkCell && checkCell.isAlive)
        //   numLive++;
        // return numLive;
    };
    ;
    Board.prototype.randomize = function (likelyhood) {
        if (likelyhood === void 0) { likelyhood = 5; }
        var numCells = 0;
        var numSpawn = 0;
        var numDie = 0;
        this.eachCell(function (cell) {
            numCells++;
            var random = Math.random() * 10;
            if (random < likelyhood) {
                cell.spawn();
                numSpawn++;
            }
            else {
                cell.die();
                numDie++;
            }
        });
        console.log("Out of " + numCells + " cells, " + numSpawn + " spawned, and " + numDie + " died.");
        console.log("==> " + Math.ceil((numSpawn / numCells) * 10000) / 100 + "% of cells spawned");
        return this;
    };
    Board.prototype.duplicateGrid = function () {
        var fakeTiles = [];
        var fakeBoard = {
            numXCells: this.numXCells,
            numYCells: this.numYCells,
            cellFactory: this.cellFactory,
            tiles: fakeTiles
        };
        this.constructBoard.call(fakeBoard);
        return fakeTiles;
        // this.tiles.forEach( col => {
        //   let statusCol = [];
        //   col.forEach( cell => {
        //     statusCol.push(this.cellFactory.createCell())
        //   });
        //   cellStatus.push(statusCol);
        // });
        // return cellStatus;
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

},{"./cell":3}],3:[function(require,module,exports){
'use strict';
var Cell = (function () {
    function Cell(args) {
        this.args = args;
        this.status = CellStatus.DEAD;
        this.context = args.context;
        this.xLoc = args.x;
        this.yLoc = args.y;
        this.width = args.width;
        this.height = args.height;
        this.xPix = this.xLoc * this.width;
        this.yPix = this.yLoc * this.height;
    }
    ;
    Object.defineProperty(Cell.prototype, "isAlive", {
        get: function () {
            return this.status === CellStatus.ALIVE;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cell.prototype, "coordinates", {
        get: function () {
            return {
                x: this.xLoc,
                y: this.yLoc
            };
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.spawn = function () {
        this.status = CellStatus.ALIVE;
    };
    Cell.prototype.die = function () {
        this.status = CellStatus.DEAD;
    };
    Cell.prototype.willDie = function () {
        this.futureStatus = CellStatus.DEAD;
    };
    Cell.prototype.willSpawn = function () {
        this.futureStatus = CellStatus.ALIVE;
    };
    Cell.prototype.update = function () {
        if (this.futureStatus && this.status !== this.futureStatus)
            this.status = this.futureStatus;
    };
    Cell.prototype.draw = function () {
        var color;
        if (this.status === CellStatus.ALIVE)
            color = '#F00';
        else if (this.status === CellStatus.DEAD)
            color = '#111';
        else {
            color = '#000000';
            console.log(this.status);
        }
        this.context.fillStyle = color;
        // this.context.fillStyle = color || (this.status === CellStatus.DEAD
        //     ? '#000'
        //     : '#fff');
        this.context.fillRect(this.xPix, this.yPix, this.width, this.height);
    };
    return Cell;
}());
exports.Cell = Cell;
var CellFactory = (function () {
    function CellFactory(args) {
        this.args = args;
        this.context = args.context;
        this.cellWidth = args.cellWidth;
        this.cellHeight = args.cellHeight;
    }
    ;
    CellFactory.prototype.createCell = function (gridX, gridY) {
        var cell = new Cell({
            x: gridX,
            y: gridY,
            width: this.cellWidth,
            height: this.cellHeight,
            context: this.context
        });
        cell.die();
        return cell;
    };
    return CellFactory;
}());
exports.CellFactory = CellFactory;
var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["ALIVE"] = 1] = "ALIVE";
    CellStatus[CellStatus["DEAD"] = 2] = "DEAD";
    CellStatus[CellStatus["INACTIVE"] = 3] = "INACTIVE";
})(CellStatus = exports.CellStatus || (exports.CellStatus = {}));

},{}],4:[function(require,module,exports){
'use strict';
var board_1 = require("./board");
var CELL_SIZE = 10;
var GAME_DELAY = 90;
var CHANCE_OF_SPAWN = 5;
var Conway = (function () {
    function Conway(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.delay = GAME_DELAY;
        this.isRunning = false;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - document.getElementById('head').clientHeight;
        this.board = new board_1.Board({
            canvas: this.canvas,
            context: this.context,
            cellSize: CELL_SIZE
        });
    }
    Conway.prototype.start = function () {
        this.isRunning = true;
        this.board.randomize(CHANCE_OF_SPAWN).draw();
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
        this.board.reset();
    };
    return Conway;
}());
exports.Conway = Conway;

},{"./board":2}]},{},[1]);
