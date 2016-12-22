'use strict';
var CellFactory = (function () {
    function CellFactory(args) {
        this.args = args;
        this.context = args.context;
        this.cellWidth = args.cellWidth;
        this.cellHeight = args.cellHeight;
    }
    ;
    CellFactory.prototype.createCell = function (gridX, gridY) {
        return new Cell({
            x: gridX,
            y: gridY,
            width: this.cellWidth,
            height: this.cellHeight,
            context: this.context
        });
    };
    return CellFactory;
}());
exports.CellFactory = CellFactory;
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
    Cell.prototype.draw = function (color) {
        this.context.fillStyle = color || (this.status === CellStatus.DEAD
            ? '#000'
            : '#fff');
        this.context.fillRect(this.xPix, this.yPix, this.width, this.height);
    };
    return Cell;
}());
exports.Cell = Cell;
var CellStatus;
(function (CellStatus) {
    CellStatus[CellStatus["ALIVE"] = 0] = "ALIVE";
    CellStatus[CellStatus["DEAD"] = 1] = "DEAD";
})(CellStatus || (CellStatus = {}));
//# sourceMappingURL=cell.js.map