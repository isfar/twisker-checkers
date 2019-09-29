import React, { Component } from "react"
import "./Check.css"

class Check extends Component {

    constructor(props) {
        super(props);
        this.state = props;
    }

    render() {
        return (
            <div className="Check">
                {this.state.i}
                {this.state.j}
            </div>
        );
    }
}

export default Check;