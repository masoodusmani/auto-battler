import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { change, connect, state } from "./connection";
import { Room } from "colyseus.js";
import { connectToArena } from "./arenaConnection";
import { RoomState } from "./schema/RoomState";
import { Board } from "./schema/Board";
import { Character } from "./schema/Character";

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

function Cell({ character, type }: CellProps) {
  return (
    <div className={`Cell Cell-${type}`}>
      {character && <CharacterIcon name={character.name} />}
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
      {cells.map((cell, index) => (
        <Cell
          key={`${index}-${cell.character?.name}`}
          character={cell.character}
          type={
            (index + getRow(index, rowLength)) % 2 === 0 ? "main" : "alternate"
          }
        />
      ))}
    </div>
  );
}
function JoinedRoom() {
  const [room, setRoom] = useState<Room<RoomState> | undefined>(undefined);
  const [board, setBoard] = useState<Board | undefined>();
  const [re, setRe] = useState(false);
  const [html, setHTML] = useState("");
  // const [cells, setCells] = useState<Cell | undefined>();
  room?.onStateChange((newState) => {
    // console.log(
    //   "asdasd",
    //   room?.state.board,
    //
    //   room?.state.board?.cells[0]?.character?.name,
    //
    //   room?.state.board?.cells.findIndex((cell) => cell.character != null)
    // );
    console.log(
      "board\n",
      room?.state.board?.cells
        ?.map(
          ({ x, y, character }, index) =>
            (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
        )
        .join("")
    );
    setHTML(
      room?.state.board?.cells
        ?.map(
          ({ x, y, character }, index) =>
            (character?.name ?? index) + "," + (y == 7 ? "\n" : "")
        )
        .join("")
    );
    // setBoard(undefined);
    // setRe((re) => !re);
    setBoard(newState.board);
  });
  // useEffect(() => {
  //   console.log("test", board);
  // }, [re]);
  function moveCharacter() {
    const index = room?.state.board.cells.findIndex((cell) => cell.character);
    // console.log(index);
    if (index != null) {
      room?.send("moveCharacter", {
        startIndex: index,
        endIndex: index + 1,
      });
    }
  }
  // const get = () =>
  //   room?.state.board?.cells?.map(
  //     ({ x, y, character }, index) => (character?.name ?? index) + ","
  //   );

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
      {/*<div*/}
      {/*  dangerouslySetInnerHTML={{*/}
      {/*    __html: html,*/}
      {/*  }}*/}
      {/*></div>*/}
      {/*{get()}*/}
      {board ? <BoardComponent key={Math.random()} board={board} /> : null}
      {/*<div className={"Board-container"} key={Math.random()}>*/}
      {/*  {board?.cells.map((cell, index) => {*/}
      {/*    // console.log(index);*/}
      {/*    return (*/}
      {/*      <div*/}
      {/*        key={`${index}-${cell.character?.name}`}*/}
      {/*        className={`Cell Cell-${*/}
      {/*          (index + getRow(index, board?.rowLength)) % 2 === 0*/}
      {/*            ? "main"*/}
      {/*            : "alternate"*/}
      {/*        }`}*/}
      {/*      >*/}
      {/*        {cell.character && <CharacterIcon name={cell.character.name} />}*/}
      {/*      </div>*/}
      {/*    );*/}
      {/*  })}*/}
      {/*</div>*/}
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
