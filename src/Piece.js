import React from 'react';
import crown from "./crown.png";

const Piece = ({ piece, setMovables }) => {
    return (
        <div
            className={"circle " + piece.player}
            onClick={e => setMovables(piece, e)}
        >
            {piece.crowned ? <img className="crown" src={crown} alt="crown"></img> : ""}
        </div>
    );
}

export default Piece;
