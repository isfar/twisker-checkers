import React, { Component } from "react";
import classNames from "classnames";

const mirror = index => 7 - index;

class Box extends Component {
    constructor(props) {
        super(props);
    }

    getNextPositionBy(player, rowIndex, colIndex, top = true, right = true, recursive = true) {

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

    setMovables = (box, event) => {
        event.stopPropagation();

        const player = box.piece.player;

        if (!this.props.hasTurn(player)) {
            console.log("This is not your turn!");
            return;
        }

        let movablePositions = [];
        const colIndex = box.piece.position.colIndex;
        const rowIndex = box.piece.position.rowIndex;
        //const rowIndex = player === "one" ? box.piece.position.rowIndex : mirror(box.piece.position.rowIndex);

        let nextPlayer;

        movablePositions.push(
            this.getNextPositionBy(player, rowIndex, colIndex, true, true)
        );

        movablePositions.push(
            this.getNextPositionBy(player, rowIndex, colIndex, true, false)
        );

        if (box.piece.crowned) {
            movablePositions.push(
                this.getNextPositionBy(player, rowIndex, colIndex, false, true)
            );

            movablePositions.push(
                this.getNextPositionBy(player, rowIndex, colIndex, false, false)
            );
        }
        
        this.props.selectPiece(box.piece);
        movablePositions = movablePositions.filter(position => position !== null);

        if (movablePositions.length !== 0) {
            this.props.setMovables(movablePositions);
        } else {
            console.log("The piece is not movable");
        }
    }

    render() {
        const box = this.props.box;
        const spanClassName = classNames({
            circle: true,
            one: box.piece && box.piece.player === 'one',
            two: box.piece && box.piece.player === 'two',
        });

        return (
            <div
                className={"box " + box.bg + (box.movable ? " movable" : "")}
                onClick={() => this.props.move({
                    ...this.props.position
                })}
            >
                { box.piece ?
                    (<span
                        className={spanClassName}
                        onClick={(event) => this.setMovables(box, event)}
                    ></span>) : 
                    ""
                }
            </div>
        );
    }
}

export default Box;
