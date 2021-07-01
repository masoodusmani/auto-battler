import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Board, Player } from "./Board";

export class RoomState extends Schema {
  @type(Board) board = new Board();
  @type([Player]) players = new ArraySchema<Player>();
}
