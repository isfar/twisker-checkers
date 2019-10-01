import React from 'react';
import crown from "./crown.png";

function Piece(props) {
    return (
        <div
            className={"circle " + props.piece.player}
            onClick={e => props.setMovables(props.piece, e)}
        >
            {props.piece.crowned ? <img className="crown" src={crown}></img> : ""}
        </div>
    );
}

export default Piece;
