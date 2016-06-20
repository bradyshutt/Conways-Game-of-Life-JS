
#Conway's Game of Life Simulation

   Conway's Game of Life is a cellular automation simulation, devised by
   the British mathematician, John Horton Conway.  

   Each Cell on the board remains in one of two states: _Alive_, or _Dead_.
   Cells influence each other upon each 'Tick' of a constant timer. Upon each 
   'Tick', a single Cell can _die_, _begin living_, or _remain in it's previous
   state_, based upon the few simple rules below. You can read more about 
   [Conway's Game of Life on Wikipedia](http://en.wikipedia.org/wiki/Conway's_Game_of_Life)

   This simulation was written in 'strict' (ECMAScript5) JavaScript on an 
   HTML5 Canvas.

###Cells Live by the Following Rules:

   1. A live Cell **dies** if it has _more than three_ live neighboring Cells.

   2. A live Cell **dies** if it has _fewer than two_ live neighboring Cells.

   3. A live Cell **continues to live**, so long as it has _two, or three_ live
      neighboring Cells.

   4. A dead Cell **begins to live** if it has _three_ neighboring live Cells.

