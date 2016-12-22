'use strict';

import { Board } from './board';

const CELL_SIZE = 10;
const GAME_DELAY = 90;
const CHANCE_OF_SPAWN = 5;

export class Conway {

  private board: Board;
  private delay: number = GAME_DELAY;
  public isRunning: boolean = false;

  constructor(private canvas: HTMLCanvasElement,
              private context: CanvasRenderingContext2D) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.getElementById('head').clientHeight;
    this.board = new Board({
      canvas: this.canvas,
      context: this.context,
      cellSize: CELL_SIZE
    });
  }

  start() {
    this.isRunning = true;
    this.board.randomize(CHANCE_OF_SPAWN).draw();
    this.run(this.delay);
  }

  run(delay: number, iterations?: number) {
    iterations = iterations || 9999;

    let loop = setInterval(() => {
      if (!this.isRunning || !--iterations) {
        clearInterval(loop);
        this.isRunning = false;
      } else {
        this.board.update().draw();
      }
    }, delay);
  }

  stop() {
    this.isRunning = false;
    this.reset();
  }

  reset() {
    this.board.clear();
    this.board.reset();
  }
}

