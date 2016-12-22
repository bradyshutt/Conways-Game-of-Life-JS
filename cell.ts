'use strict';

export class Cell {

  private xLoc: number;
  private yLoc: number;
  private xPix: number;
  private yPix: number;
  private width: number;
  private height: number;
  private status: CellStatus;
  private futureStatus: CellStatus;
  private context: CanvasRenderingContext2D;

  constructor(
    private args: {
      x: number,
      y: number,
      width: number,
      height: number,
      context: CanvasRenderingContext2D
    }) {
    this.status = CellStatus.DEAD;
    this.context = args.context;
    this.xLoc = args.x;
    this.yLoc = args.y;
    this.width = args.width;
    this.height = args.height;
    this.xPix = this.xLoc * this.width;
    this.yPix = this.yLoc * this.height;
  };

  get isAlive(): boolean {
    return this.status === CellStatus.ALIVE;
  }

  get coordinates(): ICoordinates {
    return {
      x: this.xLoc,
      y: this.yLoc
    }
  }

  spawn() {
    this.status = CellStatus.ALIVE;
  }

  die() {
    this.status = CellStatus.DEAD;
  }

  willDie() {
    this.futureStatus = CellStatus.DEAD;
  }

  willSpawn() {
    this.futureStatus = CellStatus.ALIVE;
  }

  update() {
    if (this.futureStatus && this.status !== this.futureStatus)
      this.status = this.futureStatus;
  }

  draw() {
    let color;
    if (this.status === CellStatus.ALIVE)
      color = '#F00';
    else if (this.status === CellStatus.DEAD)
      color = '#111';
    else {
      color = '#000000';
      console.log(this.status);
    }

    this.context.fillStyle = color;
    // this.context.fillStyle = color || (this.status === CellStatus.DEAD
    //     ? '#000'
    //     : '#fff');
    this.context.fillRect(this.xPix, this.yPix, this.width, this.height);
  }

}

export class CellFactory {

  private context: CanvasRenderingContext2D;
  private cellWidth: number;
  private cellHeight: number;

  constructor(
    private args: {
      context: CanvasRenderingContext2D,
      cellWidth: number,
      cellHeight: number
    }) {
    this.context = args.context;
    this.cellWidth = args.cellWidth;
    this.cellHeight = args.cellHeight;
  };

  createCell(gridX: number, gridY: number): Cell {
    let cell =  new Cell({
      x: gridX,
      y: gridY,
      width: this.cellWidth,
      height: this.cellHeight,
      context: this.context
    });
    cell.die();
    return cell;
  }

}

export enum CellStatus {
  ALIVE = 1,
  DEAD = 2,
  INACTIVE = 3
}

export interface ICoordinates {
  x: number;
  y: number;
}
