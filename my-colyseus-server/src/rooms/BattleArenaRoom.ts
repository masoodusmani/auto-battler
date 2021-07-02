import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Board, Player, Swordsman } from "./schema/Board";
import { RoomState } from "./schema/RoomState";

function moveCharacter(state, client, message) {
  console.log(message);
  const matchedCell = state.board.cells.at(message.startIndex);
  if (
    !matchedCell.character ||
    matchedCell.character.owner !== client.sessionId
  )
    return;
  const cellToMoveTo = state.board.cells[message.endIndex];
  if (cellToMoveTo.character) return;
  state.board.cells[message.endIndex].character = matchedCell.character;
  matchedCell.character = undefined;
}

export class BattleArenaRoom extends Room<RoomState> {
  maxClients = 2;
  onCreate(options: any) {
    this.setState(new RoomState());
    this.onMessage("moveCharacter", (client, message) => {
      //
      // handle "type" message
      //
      moveCharacter(this.state, client, message);
    });

    this.onMessage("change", (client, message) => {
      //
      // handle "type" message
      //
      // console.log(client,message)
      // this.setState({message.stateMessage)
      if (message.stateMessage === "error") return;
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.push(new Player());
    // this.state.players[this.state.players.length - 1].arsenal.characters.push(
    //   new Swordsman()
    // );
    const char = new Swordsman();
    char.owner = client.sessionId;
    this.state.board.cells[
      Math.floor((this.state.players.length - 1) * 32 + Math.random() * 32)
    ].character = char;
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
