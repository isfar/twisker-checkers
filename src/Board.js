import React, { Component } from "react"
import Box from "./Box"
import "./Board.css"

const initialState = {
    count: {
        one: 12,
        two: 12
    },
    turn: "one",
    selectedPiece: null,
    movablePositions: [],
    board: [],
    winner: null
};

class Board extends Component {
    constructor() {
        super();

        const board = this.initBoard(this.populateBoard());
        this.state = {
            ...initialState,
            board
        };
    }

    resetBoard = () => {
        const board = this.initBoard(this.populateBoard());
        this.setState({
            ...initialState,
            board
        });
    }

    toggleTurn = () => this.setState({
        turn: this.state.turn === "one" ? "two" : "one"
    });

    populateBoard = () => {
        const board = [];
        const dimension = {
            numRows: 8,
            numCols: 8
        };

        let bg = "black";

        for (let rowIndex = 0; rowIndex < dimension.numRows; rowIndex++) {
            const row = [];

            for (let colIndex = 0; colIndex < dimension.numCols; colIndex++) {
                if (colIndex !== 0) {
                    bg = bg === "black" ? "white" : "black";
                }
                
                row[colIndex] = {
                    piece: null,
                    bg
                };
            }

            board.push(row);
        }

        return board;
    }

    selectPiece = selectedPiece => this.setState({
            selectedPiece
    });

    hasPiece = position => this.state.board[position.rowIndex][position.colIndex].piece !== null;

    setMovables = movablePositions => {
        this.clearMovables();
        const board = [...this.state.board];

        movablePositions.map(position => board[position.rowIndex][position.colIndex].movable = true);

        this.setState({
            movablePositions,
            board
        });
    }

    hasTurn = player => player === this.state.turn;

    getPieceByPosition = position => this.state.board[position.rowIndex][position.colIndex].piece;

    clearMovables = () => {
        const board = [...this.state.board];

        this.state.movablePositions.map( position => {
            board[position.rowIndex][position.colIndex].movable = false;
        });

        this.setState({
            board
        });
    }

    move = targetPosition => {
        const board = [ ...this.state.board ];
        const targetBox = board[targetPosition.rowIndex][targetPosition.colIndex];

        if (targetBox.movable) { 
            let selectedPiece = { ...this.state.selectedPiece};
            const currentBox = board[selectedPiece.position.rowIndex][selectedPiece.position.colIndex];
            const piece = { ...currentBox.piece};

            const interimPiece = this.getPieceBetween(selectedPiece.position, targetPosition);

            const count = { ...this.state.count };

            if (interimPiece) {
                if (interimPiece.player === "one") {
                    count.one--;

                    this.setState({
                        count,
                        winner: count === 0 ? "two" : null
                    });

                } else {
                    count.two--;

                    this.setState({
                        count,
                        winner: count === 0 ? "two" : null
                    });
                }
                
                board[interimPiece.position.rowIndex][interimPiece.position.colIndex].piece = null;
            }

            currentBox.piece.player = null;
            piece.position = targetPosition;
            targetBox.piece = piece;
            targetBox.movable = false;

            const bound = piece.player === "one" ? 7 : 0;
            piece.crowned = piece.position.rowIndex === bound ? true : piece.crowned;

            selectedPiece = piece;

            this.setState({
                selectedPiece,
                board
            })

            currentBox.piece = null;

            this.toggleTurn();
            this.clearMovables();
        } else {
            console.log("Not movable");
        }
    }

    getPieceBetween = (position, targetPosition) => {
        const rowIndex = (position.rowIndex + targetPosition.rowIndex) / 2;

        if (Number.isInteger(rowIndex)) {
            const colIndex = (position.colIndex + targetPosition.colIndex) / 2;
            return this.getPieceByPosition({
                rowIndex,
                colIndex
            });
        }

        return null;
    }

    initBoard = board => {
        const playerRowMap = {
            one: [ 0, 1, 2 ],
            two: [ 5, 6, 7 ]
        };

        board = board.map((boardRow, rowIndex) => {
            const row = boardRow.map((box, colIndex) => {
                let player = null;
                if (box.bg === "black") {
                    if (playerRowMap.one.includes(rowIndex)) {
                        player = 'one';
                    }

                    if (playerRowMap.two.includes(rowIndex)) {
                        player = 'two';
                    }
                }

                const piece = player ? {
                    player,
                    crowned: false,
                    position: {
                        rowIndex,
                        colIndex
                    }
                } : null;

                box =  {
                    ...box,
                    piece,
                    movable: false,
                };

                return box;
            });

            return row;
        });

        return board;
    }

    render() {
        return (
            <div id="Board">
                <h1>Twisker Checkers Game!</h1>
                <div className="board-wrapper">
                    <div className="checkers-board">
                        {this.state.board.map((row, i) => {
                            return (
                                <div className="row" key={i}>
                                    {row.map((box, j) => {
                                        return (
                                            <Box
                                                position={{ rowIndex: i, colIndex: j }}
                                                key={"" + i + j}
                                                setMovables={this.setMovables}
                                                selectPiece={this.selectPiece}
                                                hasTurn={this.hasTurn}
                                                move={this.move}
                                                getPieceByPosition={this.getPieceByPosition}
                                                { ...box }
                                            />
                                        );
                                    })}

                                </div>
                            );
                        })}

                    </div>
                </div>

                <div className="info">
                    <div className="currentPlayer">
                        <strong>Current Player:</strong>
                        <span className={ "circle " + this.state.turn}></span>
                    </div>
                    <div className="pieceCount">
                        <span className="circle one"></span> has&nbsp;
                        <strong>{this.state.count.one}</strong> pieces left
                    </div>
                    <div className="pieceCount">
                        <span className="circle two"></span> has&nbsp;
                        <strong>{this.state.count.two}</strong> pieces left
                    </div>
                    <div className="winner">
                        Winner: { this.state.winner ? 
                            (<span className={"circle " + this.state.winner}></span>)
                            : "N/A" }
                    </div>
                    <div>
                        <button
                            id="resetBoard"
                            onClick={this.resetBoard}
                        >Reset Board</button>
                    </div>
                </div>

            </div>
        );
    }
} 

export default Board;
