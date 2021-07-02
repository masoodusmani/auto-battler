import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { change, connect, state } from "./connection";
import { Room } from "colyseus.js";
import { connectToArena } from "./arenaConnection";
import { RoomState } from "./schema/RoomState";
import { Board } from "./schema/Board";
import { Character } from "./schema/Character";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export enum Direction {
  N = "N",
  S = "S",
  E = "E",
  W = "W",
}
export enum Action {
  wait = "wait",
  move = "move",
  attack = "attack",
}
type CharacterProps = {
  name: Character["name"];
  health: number;
  maxHealth: number;
  alignment: "friend" | "foe";
};
function CharacterIcon({
  name,
  health,
  maxHealth,
  alignment,
  facing,
  action,
}: CharacterProps) {
  console.log("health", health, maxHealth, action, facing);
  return (
    <div
      className={`Character-${name} Character-${facing} Character-${action}`}
    >
      <div
        className={`Character-health Character-${alignment}`}
        style={{
          width: `${(health / maxHealth) * 100}%`,
        }}
      />
    </div>
  );
}

type CellProps = {
  character: Character | undefined;
  type: "main" | "alternate";
};

function Cell({ character, type, children, sessionId }: CellProps) {
  return (
    <div className={`Cell Cell-${type}`}>
      {character ? (
        <CharacterIcon
          name={character.name}
          health={character.health}
          maxHealth={character.maxHealth}
          facing={character.facing}
          action={character.action}
          alignment={sessionId === character.owner ? "friend" : "foe"}
        />
      ) : (
        children
      )}
    </div>
  );
}

type BoardProps = { board: Board };

function getRow(index: number, rowLength: number) {
  return Math.floor(index / rowLength);
}
function BoardComponent({
  board: { rowLength, cells },
  sessionId,
}: BoardProps) {
  console.log("inside board", cells);
  return (
    <div className={"Board-container"}>
      {cells?.map((cell, index) => (
        <Cell
          key={`${index}-${cell.character?.name}`}
          character={cell.character}
          type={
            (index + getRow(index, rowLength)) % 2 === 0 ? "main" : "alternate"
          }
          sessionId={sessionId}
        >
          {cell.x},{cell.y}
        </Cell>
      ))}
    </div>
  );
}
function GameComponent({ room }: { room: Room<RoomState> }) {
  function moveCharacter() {
    const index = room?.state.board.cells.findIndex(
      (cell) => cell.character?.owner === room?.sessionId
    );
    // console.log(index);
    if (index != null) {
      room?.send("moveCharacter", {
        startIndex: index,
        endIndex: index + 1,
      });
    }
  }
  return (
    <>
      <DragDropContext
        onDragEnd={(result, provided) => console.log(result, provided)}
      >
        {room.state.board ? (
          <BoardComponent
            key={Math.random()}
            board={room.state.board}
            sessionId={room.sessionId}
          />
        ) : null}
        <button onClick={() => moveCharacter()}>Move</button>
      </DragDropContext>
    </>
  );
}
function JoinedRoom() {
  const [room, setRoom] = useState<Room<RoomState> | undefined>(undefined);
  const [board, setBoard] = useState<Board | undefined>();
  const [re, setRe] = useState(false);
  const [html, setHTML] = useState("");
  // const [cells, setCells] = useState<Cell | undefined>();
  useEffect(() => {
    room?.onStateChange((newState) => {
      console.log(
        "board\n",
        room?.state.board?.cells
          ?.map(
            ({ x, y, character }, index) =>
              (character
                ? `${character.name}${character?.health}/${character?.maxHealth}`
                : index) +
              "," +
              (x == 7 ? "\n" : "")
          )
          .join("")
      );
      //This setRe triggers a rerender
      setRe((re) => !re);
      setBoard(newState.board);
    });
  }, [room]);

  return (
    <main>
      {!room ? (
        <button
          type="button"
          onClick={async () => {
            setRoom(await connectToArena());
          }}
        >
          Connect to battle_arena_room
        </button>
      ) : (
        <>
          {`${room.name}: ${room.id}`}
          <div>
            {room.state.phase === Phase.countdown
              ? Math.ceil((3000 - room.state.time) / 1000)
              : room.state.phase}
            {/*{room.state?.board?.cells?.at(26).character?.health}*/}
            {/*{room.state?.board?.cells?.at(27).character?.health}*/}
          </div>
          <GameComponent room={room} />
        </>
      )}
    </main>
  );
}
export enum Phase {
  wait = "wait",
  countdown = "countdown",
  earn = "earn",
  buy = "buy",
  fight = "fight",
}

function App() {
  // const [count, setCount] = useState(0);
  // const [text, setText] = useState("");
  // const [room, setRoom] = useState<
  //   Room<{ mySynchronizedProperty: string }> | undefined
  // >(undefined);
  // room?.onStateChange((newState) => {
  //   setText(newState.mySynchronizedProperty);
  // });
  return (
    <div className="App">
      <header className="App-header">
        {/*<p>*/}
        {/*  <button*/}
        {/*    type="button"*/}
        {/*    onClick={async () => {*/}
        {/*      setRoom(await connect());*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    Connect to my_room*/}
        {/*  </button>*/}
        {/*  <input value={text} onChange={(e) => change(e.target.value)} />*/}
        {/*</p>*/}
        <JoinedRoom />
      </header>
    </div>
  );
}

export default App;
