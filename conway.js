
var ready = setInterval( function() {
   if (document.readyState === 'complete') {
      clearInterval(ready);
      start();
   }
}, 100)


var canvas;
var context;
var board;

function start() {

   canvas = document.getElementById('board');
   context = canvas.getContext('2d');

   canvas.width = window.innerWidth;
   canvas.height = window.innerHeight - document.getElementById('head').clientHeight; ;

   board = new Board(canvas, 6);
};

var done = false;
var running = false;

document.documentElement.addEventListener("keydown", function(event) {
   if (event.keyCode == 13) {
      if (!running) {
         done = false;
         running = true;
         board.run(70);
      }
      else {
         done = true;
         running = false;
         board.clear();
         board.randomize(70).draw();
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight - document.getElementById('head').clientHeight;


      }

   }
});
