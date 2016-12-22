
import {Cell, CellFactory, ICoordinates, CellStatus} from './cell';

export class Board {

  private width: number;
  private height: number;
  private numXCells: number;
  private numYCells: number;
  private context: CanvasRenderingContext2D;
  private tiles: Cell[][];
  private cellFactory: CellFactory;


  constructor(
    private args: {
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      cellSize?: number,
      cellHeight?: number
    }) {

    args.cellSize = args.cellSize || 10;
    this.width = args.canvas.width;
    this.height = args.canvas.height;
    this.context = args.context;
    this.tiles = [];

    this.numXCells = this.width / args.cellSize;
    this.numYCells = this.height / (args.cellHeight || args.cellSize);

    this.cellFactory = new CellFactory({
      context: args.context,
      cellWidth: args.cellSize,
      cellHeight: args.cellHeight || args.cellSize
    });

    this.constructBoard();
  }

  constructBoard() {
    for (let x = 0; x < this.numXCells; x++) {
      let col = [];
      for (let y = 0; y < this.numYCells; y++) {
        let cell = this.cellFactory.createCell(x, y);
        col.push(cell);
        // if (cell.isAlive) {
        //   console.log(cell);
        // }
      }
      this.tiles.push(col);
    }
  }

  draw() {
    this.eachCell((cell) => cell.draw());
  }

  eachCell( func: (cell: Cell) => any ) {
    this.tiles.forEach( col => col.forEach( c => {
      func(c);
    }));
  }

  clear() {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.width, this.height);
  }

  reset() {
    this.eachCell((cell) => cell.die())

  }

  update() {
    // let dupTiles = this.duplicateGrid();
    // let fakeBoard = {
    //   tiles: dupTiles
    // };
    //
    // this.eachCell.call(fakeBoard, (fakeCell) => {
    //
    // });
    //
    this.eachCell((cell) => {
      let numLiveCells = this.getNumLiveNeighbors(cell);
      if (cell.isAlive) {
        if (numLiveCells > 3) {
          cell.willDie();
        } else if (numLiveCells < 2) {
          cell.willDie();
        }
      } else if (numLiveCells === 3) {
        cell.willSpawn();
      }
    });
    this.eachCell((cell) => cell.update());
    return this;
  }

  getCell(coordinates?: ICoordinates): Cell {
    let col = this.tiles[coordinates.x];
    if (!col) return null;
    return col[coordinates.y];
  }

  getNeighbor(cell: Cell, direction: Directions): Cell {
    let coordinates: ICoordinates = {
      x: cell.coordinates.x,
      y: cell.coordinates.y
    };

    switch(direction) {
      case Directions.Up:
        coordinates.y -= 1;
        break;
      case Directions.Right:
        coordinates.x += 1;
        break;
      case Directions.Down:
        coordinates.y += 1;
        break;
      case Directions.Left:
        coordinates.y -= 1;
        break;
    }

    return (this.validateCoordinates(coordinates)
      ? this.getCell(coordinates)
      : null
    )
  }

  validateCoordinates(coordinates: ICoordinates): boolean {
    return (
      coordinates.x > -1 &&
      coordinates.y > -1 &&
      coordinates.x < this.numXCells &&
      coordinates.y < this.numYCells
    )
  }

  getNeighbors(c: Cell): Cell[] {
    let ns: Cell[] = [];
    ns.push(this.getCell({x: c.coordinates.x - 1, y: c.coordinates.y + 1}));
    ns.push(this.getCell({x: c.coordinates.x - 1, y: c.coordinates.y    }));
    ns.push(this.getCell({x: c.coordinates.x - 1, y: c.coordinates.y - 1}));
    ns.push(this.getCell({x: c.coordinates.x    , y: c.coordinates.y + 1}));
    ns.push(this.getCell({x: c.coordinates.x    , y: c.coordinates.y - 1}));
    ns.push(this.getCell({x: c.coordinates.x + 1, y: c.coordinates.y + 1}));
    ns.push(this.getCell({x: c.coordinates.x + 1, y: c.coordinates.y    }));
    ns.push(this.getCell({x: c.coordinates.x + 1, y: c.coordinates.y - 1}));
    return ns.filter((cell) => cell);
  }

  getNumLiveNeighbors(cell: Cell): number {
    let neighbors = this.getNeighbors(cell);
    return neighbors.filter((n) => n.isAlive).length;
    // console.log('.');
    // let numLive = 0;
    // let checkCell;
    // checkCell = this.getNeighbor(cell, Directions.Up);
    // if (checkCell && checkCell.isAlive)
    //   numLive++;
    // checkCell = this.getNeighbor(cell, Directions.Right);
    // if (checkCell && checkCell.isAlive)
    //   numLive++;
    // checkCell = this.getNeighbor(cell, Directions.Down);
    // if (checkCell && checkCell.isAlive)
    //   numLive++;
    // checkCell = this.getNeighbor(cell, Directions.Left);
    // if (checkCell && checkCell.isAlive)
    //   numLive++;
    // return numLive;
  };

  randomize(likelyhood: number = 5) {
    let numCells = 0;
    let numSpawn = 0;
    let numDie = 0;
    this.eachCell((cell) => {
      numCells++;
      let random = Math.random() * 10;
      if (random < likelyhood) {
        cell.spawn();
        numSpawn++;
      }
      else {
        cell.die();
        numDie++;
      }
    });
    console.log(`Out of ${numCells} cells, ${numSpawn} spawned, and ${numDie} died.`);
    console.log(`==> ${Math.ceil((numSpawn / numCells)*10000)/100}% of cells spawned`);
    return this;
  }

  duplicateGrid(): Cell[][] {
    let fakeTiles: Cell[][] = [];
    let fakeBoard = {
      numXCells: this.numXCells,
      numYCells: this.numYCells,
      cellFactory: this.cellFactory,
      tiles: fakeTiles
    };

    this.constructBoard.call(fakeBoard);
    return fakeTiles;

    // this.tiles.forEach( col => {
    //   let statusCol = [];
    //   col.forEach( cell => {
    //     statusCol.push(this.cellFactory.createCell())
    //   });
    //   cellStatus.push(statusCol);
    // });
    // return cellStatus;
  }

  // constructBoard() {
  //   for (let x = 0; x < this.numXCells; x++) {
  //     let col = [];
  //     for (let y = 0; y < this.numYCells; y++) {
  //       let cell = this.cellFactory.createCell(x, y) ;
  //       col.push(cell);
  //     }
  //     this.tiles.push(col);
  //   }
  //}

}

enum Directions {
  Up,
  Right,
  Down,
  Left
}
