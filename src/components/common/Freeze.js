import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./Freeze.css";

class Freeze extends Component {
    render() {
        return (
            <div className={`gdnet-freeze ${this.props.enable === true ? "visible" : "hidden"}`}>
                <div className="gdnet-freeze-blurred"></div>
                <div className="gdnet-freeze-message"><p>... please wait ...</p></div>
            </div>
        );
    }
}

Freeze.proptypes = {
    enable: PropTypes.bool.isRequired
};

export default Freeze;