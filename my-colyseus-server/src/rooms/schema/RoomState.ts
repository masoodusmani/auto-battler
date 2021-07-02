import { ArraySchema, Schema, type } from "@colyseus/schema";
import { Board, Player } from "./Board";

export enum Phase {
  wait = "wait",
  countdown = "countdown",
  earn = "earn",
  buy = "buy",
  fight = "fight",
}

export class RoomState extends Schema {
  @type(Board) board = new Board();
  @type([Player]) players = new ArraySchema<Player>();
  @type("string") phase: Phase = Phase.wait;
  @type("number") time: number = 0;
}
