import { Client, Room } from "colyseus";
import { Cell, Player, Swordsman } from "./schema/Board";
import { Phase, RoomState } from "./schema/RoomState";
import { SimulationCallback } from "colyseus/lib/Room";

const goal = {
  x: 3,
  y: 3,
};
function moveCharacterFromMessage(state, client, message) {
  console.log(message);
  const matchedCell = state.board.cells.at(message.startIndex);
  if (
    !matchedCell.character
    // ||matchedCell.character.owner !== client.sessionId
  )
    return;
  const cellToMoveTo = state.board.cells[message.endIndex];
  if (
    message.endIndex > 63 ||
    cellToMoveTo.character ||
    (cellToMoveTo.x === matchedCell.x && cellToMoveTo.y === matchedCell.y)
  )
    return false;
  state.board.cells[message.endIndex].character = matchedCell.character;
  matchedCell.character = undefined;
  return true;
}
function moveCharacter(
  state: RoomState,
  x: number,
  y: number,
  endX: number,
  endY: number
) {
  const startCell = state.board.cells.at(x + y * state.board.rowLength);
  const endCell = state.board.cells.at(endX + endY * state.board.rowLength);
  if (endCell.character) return 0;
  state.board.cells[endX + endY * state.board.rowLength].character =
    startCell.character;
  startCell.character = undefined;
  return 1;
}
function getDirection(
  state: RoomState,
  x: number,
  y: number,
  target: typeof goal
) {
  const xDist = Math.abs(target.x - x);
  const yDist = Math.abs(target.y - y);
  if (xDist === 0 && yDist === 0) {
    return {
      x: x,
      y: y,
    };
  }
  if (xDist > yDist) {
    return {
      x: (target.x - x < 0 ? -1 : 1) + x,
      y: y,
    };
  } else {
    return {
      x: x,
      y: (target.y - y < 0 ? -1 : 1) + y,
    };
  }
}
function getCoords(
  state: RoomState,
  x: number,
  y: number,
  target: typeof goal
) {
  if (x === target.x && y === target.y) {
    return [x, y];
  }
  const N = [x, y - 1];
  const S = [x, y + 1];
  const E = [x + 1, y];
  const W = [x - 1, y];
  const Ncompare = [Math.abs(N[0] - target.x), Math.abs(N[1] - target.y)];
  const Scompare = [Math.abs(S[0] - target.x), Math.abs(S[1] - target.y)];
  const Ecompare = [Math.abs(E[0] - target.x), Math.abs(E[1] - target.y)];
  const Wcompare = [Math.abs(W[0] - target.x), Math.abs(W[1] - target.y)];
  const sumN = Ncompare[0] + Ncompare[1];
  const sumS = Scompare[0] + Scompare[1];
  const sumE = Ecompare[0] + Ecompare[1];
  const sumW = Wcompare[0] + Wcompare[1];
  const minVal = Math.min(sumN, sumS, sumE, sumW);
  if (sumN === minVal) return N;
  if (sumS === minVal) return S;
  if (sumE === minVal) return E;
  if (sumW === minVal) return W;
}
function getIndex(x: number, y: number, rowLength: number) {
  return x + y * rowLength;
}
function attack(state: RoomState, cell: Cell) {
  const { x, y } = cell;
  const N = [x, y - 1];
  const S = [x, y + 1];
  const E = [x + 1, y];
  const W = [x - 1, y];
  const attack = cell.character.attack;
  const NCell = state.board.cells.at(
    getIndex(N[0], N[1], state.board.rowLength)
  );
  const SCell = state.board.cells.at(
    getIndex(S[0], S[1], state.board.rowLength)
  );
  const ECell = state.board.cells.at(
    getIndex(E[0], E[1], state.board.rowLength)
  );
  const WCell = state.board.cells.at(
    getIndex(W[0], W[1], state.board.rowLength)
  );

  function attackCell(cell: Cell) {
    if (cell.character != null) {
      console.log("attacking", cell.x, cell.y, cell.character.health, attack);
      // Clone is necessary for the update to propagate
      const char = cell.character.clone();
      char.health -= attack;
      cell.character = char;

      if (cell.character.health <= 0) {
        cell.character = undefined;
      }
      return true;
    }
  }

  if (attackCell(NCell)) return;
  if (attackCell(SCell)) return;
  if (attackCell(ECell)) return;
  if (attackCell(WCell)) return;
}
const game = (state: RoomState, tick = 1000) => {
  if (state.players.length == 1) {
    state.phase = Phase.wait;
  } else {
    if (state.phase === Phase.wait) {
      state.phase = Phase.countdown;
    } else {
      state.time += tick;
      if (state.time >= 3000 && state.phase !== Phase.fight) {
        state.phase = Phase.fight;
        state.time = 0;
      } else if (state.phase === Phase.fight) {
        if (state.time >= 500) {
          state.time = 0;
          // console.log(
          //   "board before\n",
          //   this1.state.board?.cells
          //     ?.map(
          //       ({ x, y, character }, index) =>
          //         (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
          //     )
          //     .join("")
          // );
          state.board.cells.clone().forEach((cell, index) => {
            if (cell.character) {
              const end = getDirection(state, cell.x, cell.y, goal);
              const coords = getCoords(state, cell.x, cell.y, goal);
              // console.log(
              //   `start ${index} ${cell.x} ${cell.y} end ${end.x} ${end.y}, coords ${coords[0]} ${coords[1]}`
              // );
              if (coords[0] === cell.x && coords[1] === cell.y) {
                attack(state, cell);
              } else {
                const moved = moveCharacterFromMessage(
                  state,
                  {},
                  {
                    startIndex: index,
                    endIndex: coords[0] + coords[1] * state.board.rowLength,
                  }
                );
                console.log("could move?", moved);
                if (!moved) {
                  attack(state, cell);
                }
              }
              const orig = state.board.cells.at(index);
              console.log(
                "orig mhealth",
                orig.character?.maxHealth,
                "attack",
                orig.character?.attack,
                "health",
                orig.character?.health
              );
              // const end = getDirection(state, cell.x, cell.y, goal);
              // console.log("character found at ", cell.x, cell.y);
              // console.log("going to ", end.x + state.board.rowLength * end.y);
              // const moved = moveCharacter(
              //   this1.state,
              //   cell.x,
              //   cell.y,
              //   end.x,
              //   end.y
              // );
              // console.log("moved ", moved, cell.character?.name);
            }
          });
          // console.log(
          //   "board after\n",
          //   this1.state.board?.cells
          //     ?.map(
          //       ({ x, y, character }, index) =>
          //         (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
          //     )
          //     .join("")
          // );
        }
      }
    }
  }
};
const gameLoop = (state: RoomState, this1: Room<RoomState>) => {
  const tick = 500;
  setInterval(() => game(state), tick);
};

export class BattleArenaRoom extends Room<RoomState> {
  maxClients = 2;

  onCreate(options: any) {
    this.setState(new RoomState());
    this.clock.start();
    const delayedInterval = this.clock.setInterval(() => {
      // console.log("Time now " + this.clock.currentTime);
      game(this.state);
    }, 1000);

    // gameLoop(this.state, this);
    this.onMessage("moveCharacter", (client, message) => {
      //
      // handle "type" message
      //
      console.log(
        "board before\n",
        this.state.board?.cells
          ?.map(
            ({ x, y, character }, index) =>
              (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
          )
          .join("")
      );
      moveCharacterFromMessage(this.state, client, message);
      console.log(
        "board after\n",
        this.state.board?.cells
          ?.map(
            ({ x, y, character }, index) =>
              (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
          )
          .join("")
      );
    });
    // this.state.board.cells.onChange((c, k) => console.log("changed, ", c, k));
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
    function rand() {
      return Math.floor(Math.random() * 5);
    }
    const char = new Swordsman();
    char.owner = client.sessionId;
    char.maxHealth = 50 + rand() * 10;
    char.health = char.maxHealth;
    char.attack = 3 + rand();
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
