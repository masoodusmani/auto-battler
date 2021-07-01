// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.25
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from '@colyseus/schema';
import { Character } from './Character'

export class Cell extends Schema {
    @type("number") public x!: number;
    @type("number") public y!: number;
    @type(Character) public character: Character = new Character();
}
