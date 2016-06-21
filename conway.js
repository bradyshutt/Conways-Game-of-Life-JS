
var ready = setInterval( function() {
   if (document.readyState === 'complete') {
      clearInterval(ready);
      start();
   }
}, 100)


var canvas;
var context;

function start() {

   var cell = new Cell(100, 100, 100, 100);

   canvas = document.getElementById('board');
   context = canvas.getContext('2d');

   var headerHeight = document.getElementById('head').clientHeight;
   var pageHeight = window.innerHeight;


   canvas.width = window.innerWidth;
   canvas.height = pageHeight - headerHeight;

   var board = new Board(canvas, 100);


   board.randomize(8).drawCells();

   board.anyAlive();

   //board.start(1000);

   //board.fillBoard();


};

