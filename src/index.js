import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  console.log(props.className);
  return (
    <button 
      className={props.className}
      onClick={props.onClick}>
      {props.value}
    </button>
  )
}

const winningStyle = {
  backgroundColor: 'green',
}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      className:  'square',
    }
  }
  renderSquare(i) {
    if (this.props.winningLine != null){
      if (inWinningLine(this.props.winningLine, i)) {
        return (
          <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            className='square winner-square'
          />
        )
      }
    } 
    return (
      <Square 
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        className={this.state.className}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      moves: [
      ],
      stepNumber: 0, 
      xIsNext: true,
      winningLine: null,
    }
  }
  getColRow(i) {
    const col = i + 1;
    if (i < 3) {
      return `Row: 1, Col: ${col}`;
    } else if (i < 6) {
      return `Row: 2, Col: ${col}`;
    } else {
      return `Row: 3, Col: ${col}`;
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const moves = this.state.moves.concat([this.getColRow(i)]);
    if (this.state.winningLine) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      moves: moves,
      stepNumber: history.length, 
      xIsNext: !this.state.xIsNext,
    });

  }
  jumpTo(step) {
    let history = this.state.history.slice(0, step + 1);
    this.setState({
      history: history, // update the moves so they remove ones after 
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winningLine: null
    });
  }
  updateWinningLine(line) {
    this.setState( state => {
      return { winningLine: line.line };
    })
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningLine = calculateWinner(current.squares, this);

    const moves = history.map( (step, move) => {
      const location = this.state.moves[move - 1];
      const desc = move ? 
        `Go to move #${move} (${location})` : 
        `Go to game start`;
      return (
        <li 
          key={move}>
          <button onClick={(e) => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;

    if (this.state.winningLine) {
      status = `Winner: ${winningLine.winner}`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningLine={this.state.winningLine}
            currentSquares={current.squares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares, game) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [2, 5, 8],
    [1, 4, 7],
    [2, 4, 5],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      game.state.winningLine = {
        line: [a, b, c],
        winner: squares[a],
      };
      return {
        line: [a, b, c],
        winner : squares[a],
      }
    } else if (containsNoNulls(squares)) {
      return 'Draw!';
    }
  }
  return null;
}
function inWinningLine(winningLine, square) {
  for (let i = 0; i < winningLine.line.length; i++) {
    if (winningLine.line[i] == square) {
      return true;
    }
  }
  return false;
}
function containsNoNulls(array) {
  let bool = false;

  for (let i = 0; i < array.length; i++) {
    if (array[i]) {
      bool = true;
    } else {
      bool = false;
      return;
    }
  }
  return bool;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

