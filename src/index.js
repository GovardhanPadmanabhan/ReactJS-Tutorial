import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { thisExpression } from '@babel/types';


function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}
  
class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        const size=3;
        let rows=[];
        for (let i=0; i<3; i++){
            let col=[];
            for(let j =0; j<3; j++){
                col.push(this.renderSquare((i*3)+j));
            }
            rows.push(<div className="board-row">{col}</div>);
        }

        return (
            <div>
                {/* for (let i=0; i<this.size; i++) {
                    <div className="board-row">
                        for(let j=0; j<3; j++){
                            this.renderSquare(i+j)
                        }
                    </div>
                } */}
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state={
            history: [{squares: Array(9).fill(null)}],
            rowcol: [{moves: Array(2).fill(null)}],
            xIsNext: true,
            stepNumber: 0
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        const rowcol = this.state.rowcol.slice(0, this.state.stepNumber + 1);
        const current_move = rowcol[rowcol.length - 1];
        const moves = current_move.moves.slice();
        
        if(calculateWinner(squares) || squares[i]){
            return;
        }
        
        squares[i] = this.state.xIsNext ? "X" : "O";
        moves[0] = (Math.floor(i/3) + 1);
        moves[1] = (i%3 + 1); 
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            rowcol: rowcol.concat([{
                moves: moves
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const move_list = this.state.rowcol;
        
        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move +  "\t[" + move_list[move].moves.toString() + "]":
                'Go to game start';
                
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move == this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? "X" : "O");
        }

      return (
        <div className="game">
          <div className="game-board">
            <Board squares={current.squares} onClick={i => this.handleClick(i)}/>
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
}
  
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

// ========================================
  
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
  