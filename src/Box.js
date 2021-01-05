import React from "react";
import Piece from "./Piece";

const Box = ({ setMovables, bg, movable, move, position, piece }) => {

    const thisSetMovables = (piece, e) => {
        e.stopPropagation();
        setMovables(piece);
    };

    return (
        <div
            className={"box " + bg + (movable ? " movable" : "")}
            onClick={() => move({
                ...position
            })}
        >
            {piece ?
                <Piece
                    setMovables={thisSetMovables}
                    piece={piece}
                /> :
                ""
            }
        </div>
    );
}

export default Box;