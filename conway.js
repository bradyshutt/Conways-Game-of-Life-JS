
var ready = setInterval( function() {
   if (document.readyState === 'complete') {
      clearInterval(ready);
      start();
   }
}, 100)


function start() {

   var cell = new Cell(100, 100, 100, 100);

   var canvas = document.getElementById('board');
   var context = canvas.getContext('2d');


   var headerHeight = document.getElementById('head').clientHeight;
   var pageHeight = window.innerHeight;

   canvas.width = window.innerWidth;
   canvas.height = pageHeight - headerHeight;

   var board = new Board(canvas, 20);

   board.drawGridlines(context);

   cell.draw(context);

};

