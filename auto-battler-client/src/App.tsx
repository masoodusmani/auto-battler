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

type CharacterProps = {
  name: Character["name"];
};
function CharacterIcon({ name }: CharacterProps) {
  return <div className={`Character-${name}`}></div>;
}

type CellProps = {
  character: Character | undefined;
  type: "main" | "alternate";
};

function Cell({ character, type, children }: CellProps) {
  return (
    <div className={`Cell Cell-${type}`}>
      {character ? <CharacterIcon name={character.name} /> : children}
    </div>
  );
}

type BoardProps = { board: Board };

function getRow(index: number, rowLength: number) {
  return Math.floor(index / rowLength);
}
function BoardComponent({ board: { rowLength, cells } }: BoardProps) {
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
          <BoardComponent key={Math.random()} board={room.state.board} />
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
              (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
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
