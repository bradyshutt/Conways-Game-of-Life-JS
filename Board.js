/* Board.js Class */

function Cell(xGrid, yGrid) {
   this.xPix = xGrid * this.width; /* Pixel location */
   this.yPix = yGrid * this.height; /* Pixel location */
   this.x = xGrid;
   this.y = yGrid;
   this.status = 'dead'; 

   Object.defineProperty(this, "isAlive", {
      get: function() { return (this.status === 'dead') ? false : true },
   });

};


Cell.prototype.draw = function(/*opt*/ color) {

   if (color)
      context.fillStyle = color;
   else
      context.fillStyle = (this.status == 'dead') ? '#000' : '#fff';

   context.fillRect(this.xPix, this.yPix, this.width, this.height);
};

Cell.prototype.birth = function() { this.status = 'alive'; };
Cell.prototype.die = function() { this.status = 'dead'; };

function Board(canvas, /*opt*/ xNumCells, /*opt*/ yNumCells) {

   this.width = canvas.width;
   this.height = canvas.height;

   this.tiles = [];

   this.xNumCells = xNumCells || 100;
   this.yNumCells = yNumCells || 100;
   this.self = this;

   var _cellWidth = Math.ceil(this.width / this.xNumCells);
   var _cellHeight = Math.ceil(this.height / this.yNumCells);
   Cell.prototype.width = _cellWidth
   Cell.prototype.height = _cellHeight;

   for (var i = 0; i < this.xNumCells; i++) {
      this.tiles.push([]);
      for (var j = 0; j < this.yNumCells; j++) {
         this.tiles[i].push(new Cell(i, j));
      }
   }

};

Board.prototype.getNumLiveNeighbors = function(cell) {
   if (!cell) {throw new Error("Missing cell argument.")};

   var live = [];

   if (cell.x != 0 && this.tiles[cell.x - 1][cell.y].isAlive)
      live.push(this.tiles[cell.x - 1][cell.y]);

   if (cell.y != 0 && this.tiles[cell.x][cell.y - 1].isAlive)
      live.push(this.tiles[cell.x][cell.y - 1]);

   if (cell.x != this.xNumCells - 1 && this.tiles[cell.x + 1][cell.y].isAlive)
      live.push(this.tiles[cell.x + 1][cell.y]);

   if (cell.y != this.yNumCells - 1 && this.tiles[cell.x][cell.y + 1].isAlive)
      live.push(this.tiles[cell.x][cell.y + 1]);
   
   return live.length;
};

Board.prototype.drawCells = function() {
   var c = 0;

   this.eachCell(function(cell) {
      cell.draw();
   });
};


/* .eachCell applies 'func' function to 
 * each cell on the board. On each call
 * of the argument function, a new cell
 * is passed as the single a parameter.
 * */

Board.prototype.eachCell = function(func) {
   this.tiles.forEach(function(col, i) {
      col.forEach(function(cell, i) {
         func(cell)
      });
   });
};

Board.prototype.randomize = function(/*opt*/likelyhood) {
   var rdm;

   this.eachCell(function(cell) {
      rdm = Math.ceil(Math.random() * 100);

      if (rdm < (likelyhood || 5))
         cell.birth();
      else
         cell.die();
   });

   return this;
};

Board.prototype.updateBoard = function() {

   this.eachCell(function(cell) {

      /* A live Cell **dies** if it has more than 
       * three live neighboring Cells.
       * */

      if (cell.isAlive) {



      }

   });
};

Board.prototype.anyAlive = function() {
   var self = this;

   this.eachCell(function(cell) {

      if (cell.isAlive && self.getNumLiveNeighbors(cell) > 0) {
         cell.draw('#00f');
      }
      
   });
}


Board.prototype.run = function(delay) {
   if (!delay)
      throw new Error("Missing delay argument.");

   var loop = setInterval(function() {

      this.updateBoard();


      
   }, delay);


};


