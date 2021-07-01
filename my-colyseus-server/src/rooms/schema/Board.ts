import { Schema, Context, type, ArraySchema } from "@colyseus/schema";

export class Character extends Schema {
  @type("string") name: string = "";
}

export class Swordsman extends Character {
  constructor() {
    super();
    this.name = "Swordsman";
  }
}
export class Wizard extends Character {
  constructor() {
    super();
    this.name = "Wizard";
  }
}

export class Cell extends Schema {
  @type("number") x: number;
  @type("number") y: number;
  @type(Character) character: Character | undefined;

  constructor(i: number, j: number) {
    super();
    this.x = i;
    this.y = j;
  }
}

export class Board extends Schema {
  @type("number") rowLength = 8;
  @type([Cell]) cells = new ArraySchema<Cell>();
  constructor() {
    super();
    for (let i = 0; i < this.rowLength; i++) {
      for (let j = 0; j < this.rowLength; j++) {
        this.cells.push(new Cell(i, j));
      }
    }
  }
}

export class RoomState extends Schema {
  @type(Board) board = new Board();
}
