

/* Board class
 *
 *    Properties:
 *       pixWidth
 *       pixHeight
 *       width          (tiles)
 *       height         (tiles) 
 *       tiles[][]      ()
 *
 *    Methods:
 *       draw()
 *
 *       
 * */


function Board(canvas, /*opt*/ size) {

   this.width = canvas.width;
   this.height = canvas.height;

   this.tiles = [];

   this.cellSize = size || Math.ceil(wpix / 100) - 4; 
   this.cellBorder = 1;


};

Board.prototype.drawGridlines = function(c) {
   var x = 0;
   var y = 0;

   for ( ; x < this.width; x += this.cellSize) {
      this.drawVLine(c, x++);
      this.drawVLine(c, x++);
   }

   for ( ; y < this.height; y += this.cellSize) {
      this.drawHLine(c, y++);
      this.drawHLine(c, y++);
   }

};

Board.prototype.drawVLine = function(c, x) {
   c.fillStyle = '#fff';
   c.fillRect(x, 0, 1, this.height);
};

Board.prototype.drawHLine = function(c, y) {
   c.fillStyle = '#fff';
   c.fillRect(0, y, this.width, 1);
};

