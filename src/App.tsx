import React, { useState } from 'react';
import './App.css';


const ROWS = 10;
const COLUMNS = 10;

type EnumCellState = "none" | "white" | "black";
type EnumGameState = "white" | "black" | "finished";
interface BoardState {
  cells: EnumCellState[],
  gameState: EnumGameState
}

const Cell = (props: { value: EnumCellState, onclick: (event: any) => void }) => {
  const cell_state_to_string = (state: EnumCellState): string =>
    state === "none" ? "" : state === "white" ? "○" : "●";

  return (
    <button className="cell stone" onClick={props.onclick}>{cell_state_to_string(props.value)}</button >
  )
}

const Board = () => {

  const [state, setState] = useState<BoardState>({
    cells: Array<EnumCellState>(ROWS * COLUMNS).fill("none"),
    gameState: "white"
  });

  const handleCellClick = (x: number, y: number) => {
    if (state.gameState == "finished") return;
    const cells = state.cells.slice();
    cells[x * ROWS + y] = state.gameState;
    setState({ ...state, cells: cells });

  }

  const renderCell = (x: number, y: number) => <Cell value={state.cells[x * ROWS + y]} onclick={() => handleCellClick(x, y)} />;


  const goban = [];
  for (let i = 0; i < ROWS; ++i) {
    const row_cells = [];
    for (let j = 0; j < COLUMNS; ++j) {
      row_cells.push(renderCell(i, j));
    }
    goban.push(<div className="board-row">{row_cells}</div>);
  }

  return (
    <div id="game" className="item">
      <div id="goban">
        {goban}
      </div>
    </div>
  )
}

const SideBar = () => {
  return (
    <div id="side" className="item">
      <button /*onclick="restart()"*/>RESTART</button>
      <p id="turn">次は<span className="stone">○</span>の手番です</p>
      <p id="winner" hidden><span className="stone"></span>が勝ちました</p>
      <section>
        <h1>遊び方</h1>
        <ol>
          <li>[RESTART]を押します</li>
          <li>白黒を交互に打ちます</li>
          <li>先に5つ縦横斜めのどこかに連続して並べたら勝利です</li>
        </ol>
      </section>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>五目並べ</h1>
      <div className="container">
        <Board />
        <SideBar />
      </div>
    </div>
  );
}

export default App;
