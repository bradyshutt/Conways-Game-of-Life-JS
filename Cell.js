

/* Cell class
 *
 *    Properties:
 *       width
 *       height
 *       status      -Either 'dead' or 'alive'
 *
 *    Methods:
 *       draw()
 *
 *       
 * */


function Cell(x, y, w, h) {

   this.x = x;
   this.y = y;
   this.width = w;
   this.height = h;
   this.status = 'dead'; 
   
}

Cell.prototype.draw = function(c) {
   c.fillStyle = '#f00';
   c.fillRect(this.x, this.y, this.width, this.height);
};



