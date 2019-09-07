import React, { Component } from 'react';
import Freeze from "./Freeze";
import "./Freeze.css"

class FreezeView extends Component {
    state = {
        freeze: false,
    };

    setFreezeOn() {
        this.setState({freeze: true})
    }

    setFreezeOff() {
        this.setState({freeze: false})
    }

    isFreezed() {
        return this.state.freeze;
    }

    renderContent() {
        return;
    }
    
    render() {
        const content = this.renderContent();
        return (
            <div className="freeze-view-container">
                <Freeze enable={this.state.freeze} />
                <div className="freeze-view-content">
                    {content}
                </div>
            </div>
        );
    }
}


export default FreezeView;


