import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Board, Player, Swordsman } from "./schema/Board";
import { RoomState } from "./schema/RoomState";

export class BattleArenaRoom extends Room<RoomState> {
  maxClients = 2;
  onCreate(options: any) {
    this.setState(new RoomState());
    this.onMessage("moveCharacter", (client, message) => {
      //
      // handle "type" message
      //
      console.log(message);
      const matchedCell = this.state.board.cells.at(message.startIndex);
      if (!matchedCell.character) return;
      this.state.board.cells[message.endIndex].character =
        matchedCell.character;
      matchedCell.character = undefined;
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
    this.state.board.cells[this.state.players.length - 1].character =
      new Swordsman();
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
