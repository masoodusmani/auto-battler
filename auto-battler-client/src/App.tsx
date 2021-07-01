import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import {change, connect, state} from "./connection";
import {Room} from "colyseus.js";

function App() {
  const [count, setCount] = useState(0)
  const [text, setText]= useState('')
  const [room, setRoom]= useState<Room<{ mySynchronizedProperty: string }>|undefined>(undefined)
  room?.onStateChange(newState=> {
    setText(newState.mySynchronizedProperty)
  })
  return (
    <div className="App">
      <header className="App-header">

        <p>

          <button type="button" onClick={async () => {
           setRoom(await connect())

          }}>
            Connect to my_room
          </button>
          <input value={text} onChange={(e)=> change(e.target.value)} />
          {/*<button onClick={()=>change(text)}>Change</button>*/}
        </p>

      </header>
    </div>
  )
}

export default App
