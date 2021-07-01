// connection.ts (client-side)
import { Client, Room } from "colyseus.js";
const client = new Client("ws://localhost:2567");
let room: Room<RoomState>;

export type CharacterState = {
  name: string;
};
export type CellState = {
  character: CharacterState;
};
export type BoardState = {
  rowLength: number;
  cells: CellState[];
};
export type RoomState = {
  board: BoardState;
};
export async function connectToArena() {
  try {
    room = await client.joinOrCreate("battle_arena_room", {});
    console.log(room);
    room.onStateChange((newState) => {
      console.log("New state:", newState);
    });
    room.onLeave((code) => {
      console.log("You've been disconnected.");
    });
    return room;
  } catch (e) {
    console.error("Couldn't connect:", e);
  }
}

export function change(text: string) {
  room.send("change", { stateMessage: text });
}

export function state() {
  return room.state;
}
