// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.25
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from '@colyseus/schema';
import { Board } from './Board'
import { Player } from './Player'

export class RoomState extends Schema {
    @type(Board) public board: Board = new Board();
    @type([ Player ]) public players: ArraySchema<Player> = new ArraySchema<Player>();
    @type("string") public phase!: string;
    @type("number") public time!: number;
}
