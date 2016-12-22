'use strict';

import { Conway } from './conway';

let canvas = <HTMLCanvasElement> document.getElementById('board');
let context = canvas.getContext('2d');

let game: Conway = new Conway(canvas, context);

document.documentElement.addEventListener('keydown', function(event) {
  if (event.keyCode == 13) {
    if (!game.isRunning) {
      game.start();
    }
    else {
      game.stop();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight - document.getElementById('head').clientHeight;
    }
  }
});

