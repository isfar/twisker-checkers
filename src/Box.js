import React, { Component } from "react";
import Piece from "./Piece";

const Box = props => {

    const setMovables = (piece, e) => {
        e.stopPropagation();
        props.setMovables(piece);
    };

    return (
        <div
            className={"box " + props.bg + (props.movable ? " movable" : "")}
            onClick={() => props.move({
                ...props.position
            })}
        >
            {props.piece ?
                <Piece
                    setMovables={setMovables}
                    piece={props.piece}
                /> :
                ""
            }
        </div>
    );
}

export default Box;