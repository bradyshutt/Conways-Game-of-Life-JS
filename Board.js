/* Board.js Class */

function Cell(xGrid, yGrid) {
   this.xPix = xGrid * this.width; /* Pixel location */
   this.yPix = yGrid * this.height; /* Pixel location */
   this.x = xGrid;
   this.y = yGrid;
   this.status = 'dead'; 

   Object.defineProperty(this, "isAlive", {
      get: function() { return (this.status === 'alive') ? true : false },
   });

   Object.defineProperty(this, "isDead", {
      get: function() { return (this.status === 'dead') ? true : false },
   });
};

Cell.prototype.birth = function() { this.status = 'alive'; };
Cell.prototype.die = function() { this.status = 'dead'; };

Cell.prototype.draw = function(/*opt*/ color) {

   if (color)
      context.fillStyle = color;
   else
      context.fillStyle = (this.status == 'dead') ? '#000' : '#fff';

   context.fillRect(this.xPix, this.yPix, this.width, this.height);
};


function Board(canvas, /*opt*/ cellSizePixels) {

   this.width = canvas.width;
   this.height = canvas.height;

   this.tiles = [];

   var _cellSize = cellSizePixels || 10;

   this.xNumCells = this.width / cellSizePixels;
   this.yNumCells = this.height / cellSizePixels;
   this.self = this;

   Cell.prototype.width = _cellSize
   Cell.prototype.height = _cellSize;

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

   if (cell.x > 0 && this.tiles[cell.x - 1][cell.y].isAlive)
      live.push(this.tiles[cell.x - 1][cell.y]);

   if (cell.y > 0 && this.tiles[cell.x][cell.y - 1].isAlive)
      live.push(this.tiles[cell.x][cell.y - 1]);

   if (cell.x < this.xNumCells - 1 && this.tiles[cell.x + 1][cell.y].isAlive)
      live.push(this.tiles[cell.x + 1][cell.y]);

   if (cell.y < this.yNumCells - 1 && this.tiles[cell.x][cell.y + 1].isAlive)
      live.push(this.tiles[cell.x][cell.y + 1]);
   
   return live.length;
};

Board.prototype.draw = function() {
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

Board.prototype.update = function() {
   var self = this;

   this.eachCell(function(cell) {

      var numLiveCells = self.getNumLiveNeighbors(cell);

      if (cell.isAlive) {

         if (numLiveCells > 3)
            cell.die();

         if (numLiveCells < 2)
            cell.die();
      }
      else if (cell.isDead && numLiveCells >= 3)
         cell.birth();
   });

   return this;
};

Board.prototype.test = function() {
   var self = this;

   this.eachCell(function(cell) {

      if (cell.isAlive && self.getNumLiveNeighbors(cell) > 0) {
         cell.draw('#00f');
      }
      
   });
}


Board.prototype.clear = function() {

   context.fillStyle = '#000' ;
   context.fillRect(0, 0, this.width, this.height);
   
}

Board.prototype.run = function(delay, iterations) {
   if (!delay)
      throw new Error("Missing delay argument.");

   var self = this;
   iterations = iterations || 9999;

   var loop = setInterval(function() {

      if (done || !--iterations) {
         clearInterval(loop);
         return;
      }

      self.update().draw();


   }, delay);


};


