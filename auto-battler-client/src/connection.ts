// connection.ts (client-side)
import {Client, Room} from "colyseus.js";
const client = new Client("ws://localhost:2567");
let room: Room<{ mySynchronizedProperty: string }>

export async function connect () {
    try {
         room = await client.joinOrCreate("my_room",{});
        console.log(room)
        room.onStateChange((newState) => {
            console.log("New state:", newState);
        });
        room.onLeave((code) => {
            console.log("You've been disconnected.");
        });
    return room
    } catch (e) {
        console.error("Couldn't connect:", e);
    }
}

export function change(text:string) {
    room.send('change', {stateMessage: text})
}

export function state() {
    return room.state
}