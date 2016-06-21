/* Board.js Class */

function Cell(xGrid, yGrid) {
   this.x = xGrid * this.width; /* Pixel location */
   this.y = yGrid * this.height; /* Pixel location */
   this.status = 'dead'; 
};

Cell.prototype.draw = function() {

   context.fillStyle = this.status == 'dead' ? '#000' : '#fff';

   context.fillRect(this.x, this.y, this.width, this.height);
};

Cell.prototype.birth = function() { this.status = 'alive'; };
Cell.prototype.die = function() { this.status = 'dead'; };

function Board(canvas, /*opt*/ xNumCells, /*opt*/ yNumCells) {

   this.width = canvas.width;
   this.height = canvas.height;

   this.tiles = [];

   this.xNumCells = xNumCells || 100;
   this.yNumCells = yNumCells || 100;

   var _cellWidth = Math.floor(this.width / this.xNumCells);
   var _cellHeight = Math.floor(this.height / this.yNumCells);
   Cell.prototype.width = _cellWidth
   Cell.prototype.height = _cellHeight;

   for (var i = 0; i < xNumCells; i++) {
      for (var j = 0; j < yNumCells; j++) {
         this.tiles[i][i] = new Cell(i, j);
      }
   }
};

Board.prototype.drawCells = function() {
   var c = 0;

   for (c = 0; c < this.tiles.length; c++) {
         alert(cell.x);
      this.tiles[c].forEach(function(cell, i) {
         alert(cell.x);
         if (i % 2) {
            cell.birth();
            cell.draw();
         }
         else {
            cell.draw();
         }
      });
   }
};


