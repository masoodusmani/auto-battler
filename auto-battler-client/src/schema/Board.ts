// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.25
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from '@colyseus/schema';
import { Cell } from './Cell'

export class Board extends Schema {
    @type("number") public rowLength!: number;
    @type([ Cell ]) public cells: ArraySchema<Cell> = new ArraySchema<Cell>();
}
