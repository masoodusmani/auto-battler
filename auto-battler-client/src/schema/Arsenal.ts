// 
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
// 
// GENERATED USING @colyseus/schema 1.0.25
// 

import { Schema, type, ArraySchema, MapSchema, DataChange } from '@colyseus/schema';
import { Character } from './Character'

export class Arsenal extends Schema {
    @type("number") public characterLimit!: number;
    @type([ Character ]) public characters: ArraySchema<Character> = new ArraySchema<Character>();
}
