import React, { Component } from "react";
import Box from "./Box";
import "./Board.css";

const initialState = {
    count: {
        one: 12,
        two: 12
    },
    killed: false,
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
        turn: this.state.turn === "one" ? "two" : "one",
        killed: false,
    }, () => this.clearMovables());

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


    hasTurn = player => player === this.state.turn;

    getPieceByPosition = position => this.state.board[position.rowIndex][position.colIndex].piece;

    clearMovables = () => {
        const board = [...this.state.board];
        this.state.movablePositions.map( position => board[position.rowIndex][position.colIndex].movable = false);
        this.setState({
            board
        });
    }

    move = targetPosition => {
        const board = [ ...this.state.board ];
        const targetBox = board[targetPosition.rowIndex][targetPosition.colIndex];

        if (!targetBox.movable) {
            console.log("Not movable");
            return;
        }

        const selectedPiece = { ...this.state.selectedPiece };
        const selectedBox = board[selectedPiece.position.rowIndex][selectedPiece.position.colIndex];

        const interimPiece = this.getPieceBetween(selectedPiece.position, targetPosition);
        const count = { ...this.state.count };
        
        let tempState;

        if (interimPiece) {
            if (interimPiece.player === "one") {
                count.one--;
                tempState = {
                    count,
                    winner: count.one === 0 ? "two" : null,
                    killed: !this.state.killed
                };

            } else {
                count.two--;
                tempState = {
                    count,
                    winner: count.two === 0 ? "two" : null,
                    killed: !this.state.killed
                };
            }

            board[interimPiece.position.rowIndex][interimPiece.position.colIndex].piece = null;
        }

        selectedPiece.position = targetPosition;
        targetBox.piece = selectedPiece;
        targetBox.movable = false;
        selectedBox.piece = null;

        /**
         * Let's crown the piece as he reached the opposite end
         */
        const bound = selectedPiece.player === "one" ? 7 : 0;
        selectedPiece.crowned = selectedPiece.position.rowIndex === bound ? true : selectedPiece.crowned;

        this.setState({
            selectedPiece,
            board,
            ...tempState
        }, () => {
            this.clearMovables();

            if (this.state.killed) {
                this.setState({
                    killed: !this.state.killed
                }, () => {
                    const movablePositions = this.getMovablePositionsForPiece(selectedPiece);
                    if (movablePositions.length) {
                        this.setMovables(selectedPiece);
                    } else {
                        this.toggleTurn();
                    }
                });
            } else {
                this.toggleTurn();
            }
        });
    }

    getNextPositionBy = (player, rowIndex, colIndex, top = true, right = true, recursive = true) => {
        const mirror = index => 7 - index;
        const colBoundForPlayerOne = right ? 0 : 7;
        const colBoundForPlayerTwo = right ? 7 : 0;
        const rowBound = top ? 7 : 0;
        rowIndex = player === "one" ? rowIndex : mirror(rowIndex);

        let position = null;

        if (player === "one") {
            if (colIndex !== colBoundForPlayerOne && rowIndex !== rowBound) { 
                position = {
                    rowIndex: top ? rowIndex + 1 : rowIndex - 1,
                    colIndex: right ? colIndex - 1 : colIndex + 1
                }
            }
        } else {
            if (colIndex !== colBoundForPlayerTwo && rowIndex !== rowBound) {
                position = {
                    rowIndex: top ? mirror(rowIndex + 1) : mirror(rowIndex - 1),
                    colIndex: right ? colIndex + 1 : colIndex - 1
                }
            }
        } 

        if (position) {
            const nextPiece = this.getPieceByPosition(position);

            if (nextPiece) {
                if (player === nextPiece.player) {
                    return null;
                } else {
                    if (recursive) {
                        position = this.getNextPositionBy(player, position.rowIndex, position.colIndex, top, right, false);

                        if (position && this.getPieceByPosition(position)) {
                            return null;
                        }
                    }
                }
            }
        }

        return position;
    }

    setMovables = piece => {
        if (!this.hasTurn(piece.player)) {
            console.log("This is not your turn!");
            return;
        }

        this.selectPiece(piece);
        const movablePositions = this.getMovablePositionsForPiece(piece);

        if (movablePositions.length !== 0) {
            this.clearMovables();
            const board = [ ...this.state.board ];
            movablePositions.map(position => board[position.rowIndex][position.colIndex].movable = true);
            this.setState({
                movablePositions,
                board
            });
        } else {
            console.log("The piece is not movable");
        }
    }

    getMovablePositionsForPiece = piece => {
        const movablePositions = [];
        const colIndex = piece.position.colIndex;
        const rowIndex = piece.position.rowIndex;

        movablePositions.push(this.getNextPositionBy(piece.player, rowIndex, colIndex, true, true));
        movablePositions.push(this.getNextPositionBy(piece.player, rowIndex, colIndex, true, false));

        if (piece.crowned) {
            movablePositions.push(this.getNextPositionBy(piece.player, rowIndex, colIndex, false, true));
            movablePositions.push(this.getNextPositionBy(piece.player, rowIndex, colIndex, false, false));
        }

        return  movablePositions.filter(position => position !== null);
    }

    getPieceBetween = (position, targetPosition) => {
        const rowIndex = (position.rowIndex + targetPosition.rowIndex) / 2;

        if (!Number.isInteger(rowIndex))
            return null;

        const colIndex = (position.colIndex + targetPosition.colIndex) / 2;

        return this.getPieceByPosition({
            rowIndex,
            colIndex
        });
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
                                                move={this.move}
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
                            onClick={this.toggleTurn}
                        >Toggle Turn</button>

                        <button
                            onClick={this.resetBoard}
                        >Reset Board</button>
                    </div>
                </div>
            </div>
        );
    }
} 

export default Board;