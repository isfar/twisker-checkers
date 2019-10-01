import React, { Component } from "react";
import Piece from "./Piece";

class Box extends Component {

    getNextPositionBy(player, rowIndex, colIndex, top = true, right = true, recursive = true) {
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

    getPieceByPosition = position => this.props.getPieceByPosition(position);

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

    setMovables = (piece, e) => {
        e.stopPropagation();

        if (!this.props.hasTurn(piece.player)) {
            console.log("This is not your turn!");
            return;
        }

        this.props.selectPiece(piece);
        const movablePositions = this.getMovablePositionsForPiece(piece);

        if (movablePositions.length !== 0) {
            this.props.setMovables(movablePositions);
        } else {
            console.log("The piece is not movable");
        }
    }

    render() {
        const props = this.props;

        return (
            <div
                className={"box " + props.bg + (props.movable ? " movable" : "")}
                onClick={() => this.props.move({
                    ...this.props.position
                })}
            >
                {props.piece ?
                    <Piece
                        setMovables={this.setMovables}
                        piece={props.piece}
                    /> : 
                    ""
                }
            </div>
        );
    }
}

export default Box;