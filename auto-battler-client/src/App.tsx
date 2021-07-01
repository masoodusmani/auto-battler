import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { change, connect, state } from "./connection";
import { Room } from "colyseus.js";
import {
  BoardState,
  CellState,
  CharacterState,
  connectToArena,
  RoomState,
} from "./arenaConnection";

type CharacterProps = CharacterState;
function Character({ name }: CharacterProps) {
  return <div className={`Character-${name}`}></div>;
}

type CellProps = {
  character: CharacterState | undefined;
  type: "main" | "alternate";
};

function Cell({ character, type }: CellProps) {
  return (
    <div className={`Cell Cell-${type}`}>
      {character && <Character name={character.name} />}
    </div>
  );
}

type BoardProps = { board: BoardState };

function Board({ board: { rowLength, cells } }: BoardProps) {
  function getRow(index: number) {
    return Math.floor(index / rowLength);
  }
  console.log("inside board", cells);
  return (
    <div className={"Board-container"}>
      {cells.map((cell, index) => (
        <Cell
          key={`${index}-${cell.character?.name}`}
          character={cell.character}
          type={(index + getRow(index)) % 2 === 0 ? "main" : "alternate"}
        />
      ))}
    </div>
  );
}
function JoinedRoom() {
  const [room, setRoom] = useState<Room<RoomState> | undefined>(undefined);
  // const [board, setBoard] = useState<BoardState | undefined>();
  room?.onStateChange((newState) => {
    console.log(
      "asdasd",
      room?.state.board,

      room?.state.board?.cells[0]?.character?.name,

      room?.state.board?.cells.findIndex((cell) => cell.character != null)
    );
    // setBoard(newState.board);
  });
  function moveCharacter() {
    const index = room?.state.board.cells.findIndex((cell) => cell.character);
    console.log(index);
    if (index != null) {
      room?.send("moveCharacter", {
        startIndex: index,
        endIndex: index + 1,
      });
    }
  }
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
      {room?.state.board && room.state.board.cells ? (
        <Board key={Math.random()} board={room?.state.board} />
      ) : null}
      <button onClick={() => moveCharacter()}>Move</button>
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
