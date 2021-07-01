import { Room, Client } from "colyseus";
import { MyRoomState } from "./schema/MyRoomState";
import { Board, RoomState } from "./schema/Board";

export class BattleArenaRoom extends Room<RoomState> {
  onCreate(options: any) {
    this.setState(new RoomState());
    this.onMessage("type", (client, message) => {
      //
      // handle "type" message
      //
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
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
