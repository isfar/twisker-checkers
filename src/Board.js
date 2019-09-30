import React, { Component } from "react"
import Box from "./Box"
import "./Board.css"

class Board extends Component {

    constructor(props) {
        super(props);

        this.state = {
            playerOnePieceCount: 12,
            playerTwoPieceCount: 12,
            turn: "one",
            selectedPiece: null,
            movablePositions: [],
            board: [],
        };

        this.state.board = this.populateBoard();
        this.state.board = this.initBoard();
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

    selectPiece = selectedPiece => {
        this.setState({
            selectedPiece
        });
    }

    hasPiece = position => this.state.board[position.rowIndex][position.colIndex].piece !== null;

    setMovables = movablePositions => {
        this.clearMovables();
        const board = this.state.board;
        let position;
        for (position of movablePositions) {
            if (position !== null)
                board[position.rowIndex][position.colIndex].movable = true;
        }

        this.setState({
            movablePositions,
            board
        });
    }

    getPieceByPosition = position => {
        return this.state.board[position.rowIndex][position.colIndex].piece;
    }

    clearMovables = () => {
        const movablePositions = [ ...this.state.movablePositions ];
        const board = [ ...this.state.board ];

        let position;

        for (position of movablePositions) {
            board[position.rowIndex][position.colIndex].movable = false;
        }

        this.setState({
            movablePositions,
            board
        });
    }

    move = (targetPosition) => {
        const board = [ ...this.state.board ];
        const targetBox = board[targetPosition.rowIndex][targetPosition.colIndex];

        if (targetBox.movable) { 
            let selectedPiece = { ...this.state.selectedPiece};
            const currentBox = board[selectedPiece.position.rowIndex][selectedPiece.position.colIndex];
            const piece = { ...currentBox.piece};

            const interimPiece = this.getPieceBetween(selectedPiece.position, targetPosition);

            let obj;

            if (interimPiece) {
                if (interimPiece.player === "one") {
                    obj = {
                        playerOnePieceCount: this.state.playerOnePieceCount - 1
                    };
                } else {
                    obj = {
                        playerTwoPieceCount: this.state.playerTwoPieceCount - 1
                    };
                }
                
                board[interimPiece.position.rowIndex][interimPiece.position.colIndex].piece = null;

                this.setState(obj);
            }

            currentBox.piece.player = null;
            piece.position = targetPosition;
            targetBox.piece = piece;
            targetBox.movable = false;

            selectedPiece = piece;

            this.setState({
                selectedPiece,
                board
            })

            currentBox.piece = null;
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

    initBoard = () => {
        const playerRowMap = {
            one: [ 0, 1, 2 ],
            two: [ 5, 6, 7 ]
        };

        const board = this.state.board.map((boardRow, rowIndex) => {
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
                    selected: false,
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
            <div className="Board">
                {this.state.board.map((row, i) => {
                    return (
                        <div className="row" key={i}>
                            {row.map((box, j) => {
                                return (
                                    <Box
                                        position={{ rowIndex: i, colIndex: j }}
                                        key={"" + i + j}
                                        box={box}
                                        setMovables={this.setMovables}
                                        selectPiece={this.selectPiece}
                                        move={this.move}
                                        getPieceByPosition={this.getPieceByPosition}
                                    ></Box>
                                );
                            })}

                        </div>
                    );
                })}

                <div>{this.state.playerOnePieceCount}</div>
                <div>{this.state.playerTwoPieceCount}</div>
            </div>
        );
    }
} 

export default Board;
