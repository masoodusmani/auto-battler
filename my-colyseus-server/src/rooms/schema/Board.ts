import { ArraySchema, Schema, type } from "@colyseus/schema";

export enum Direction {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
}
export enum Action {
  wait = "wait",
  move = "move",
  attack = "attack",
}
export class Character extends Schema {
  @type("string") name: string = "";
  @type("string") owner: string = "";
  @type("number") maxHealth: number = 0;
  @type("number") health: number = 0;
  @type("number") attack: number = 0;
  @type("string") facing: Direction = Direction.N;
  @type("string") action: Action = Action.wait;
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

  constructor(i: number, j: number, character?: Character) {
    super();
    this.x = j;
    this.y = i;
    this.character = character;
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

export class Arsenal extends Schema {
  @type("number") characterLimit = 8;
  @type([Character]) characters = new ArraySchema<Character>();
}

export class Player extends Schema {
  @type(Arsenal) arsenal = new Arsenal();
}
