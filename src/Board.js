import React, { Component } from "react"
import Box from "./Box"
import "./Board.css"

class Board extends Component {

    constructor(props) {
        super(props);

        this.state = {
            players: {
                one: {
                    pieceCount: 16,
                },
                two: {
                    pieceCount: 16,
                }
            },
            selectedPiece: null,
            movablePositions: [],
            board: [
                [
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                ],
                [
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                ],
                [
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                ],
                [
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                ],
                [
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                ],
                [
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                ],
                [
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                ],
                [
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                    { piece: null, bg: "white" },
                    { piece: null, bg: "black" },
                ],
            ],
        };

        this.state.board = this.initBoard();
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
        const board = this.state.board;
        const targetBox = board[targetPosition.rowIndex][targetPosition.colIndex];

        if (targetBox.movable) { 
            let selectedPiece = this.state.selectedPiece;
            const currentBox = board[selectedPiece.position.rowIndex][selectedPiece.position.colIndex];
            const piece = { ...currentBox.piece};

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

    initBoard = () => {
        const playerMap = {
            one: [ 0, 1, 2 ],
            two: [ 5, 6, 7 ]
        };

        const board = this.state.board.map((boardRow, rowIndex) => {
            const row = boardRow.map((box, colIndex) => {
                let player = null;
                if (box.bg === "black") {
                    if (playerMap.one.includes(rowIndex)) {
                        player = 'one';
                    }

                    if (playerMap.two.includes(rowIndex)) {
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
                                        getPieceByPosition={this.getPieceByPosition}
                                        key={"" + i + j}
                                        box={box}
                                        setMovables={this.setMovables}
                                        selectPiece={this.selectPiece}
                                        move={this.move}
                                    ></Box>
                                );
                            })}

                        </div>
                    );
                })}

            </div>
        );
    }
} 

export default Board;
