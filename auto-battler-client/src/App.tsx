import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { change, connect, state } from "./connection";
import { Room } from "colyseus.js";
import {
  BoardState,
  CellState,
  connectToArena,
  RoomState,
} from "./arenaConnection";

type CellProps = {
  character: any;
  type: "main" | "alternate";
};

function Cell({ character, type }: CellProps) {
  return <div className={`Cell-${type}`}></div>;
}

type BoardProps = BoardState;

function Board({ rowLength, cells }: BoardProps) {
  function getRow(index: number) {
    return Math.floor(index / rowLength);
  }

  return (
    <div className={"Board-container"}>
      {cells.map((cell, index) => (
        <Cell
          key={index}
          character={cell.character}
          type={(index + getRow(index)) % 2 === 0 ? "main" : "alternate"}
        />
      ))}
    </div>
  );
}
function JoinedRoom() {
  const [room, setRoom] = useState<Room<RoomState> | undefined>(undefined);
  const [board, setBoard] = useState<BoardState | undefined>();
  room?.onStateChange((newState) => {
    setBoard(newState.board);
  });
  return (
    <main>
      <button
        type="button"
        onClick={async () => {
          setRoom(await connectToArena());
        }}
      >
        Connect to battle_arena_room
      </button>
      {board ? <Board rowLength={board.rowLength} cells={board.cells} /> : null}
    </main>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const [room, setRoom] = useState<
    Room<{ mySynchronizedProperty: string }> | undefined
  >(undefined);
  room?.onStateChange((newState) => {
    setText(newState.mySynchronizedProperty);
  });
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
