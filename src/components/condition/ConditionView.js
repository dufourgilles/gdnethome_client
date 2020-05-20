import React from 'react';
import FreezeView from "../common/FreezeView";
import ConditionCreator from "./ConditionCreator";
import ConditionList from "./ConditionList";

import "./ConditionView.css";


class ConditionView extends FreezeView {
    state = {
        condition: null,
    };

    componentDidMount() {
        this.setFreezeOff();
    }

    handleSelect = condition => {
        this.setState({condition});
    };

    renderContent() {
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Conditions</div>
                <div key={"condition-view"} className="condition-view-container">
                    <ConditionList onSelect={this.handleSelect} />
                    <ConditionCreator 
                        id={this.state.condition == null ? null : this.state.condition.id} 
                        condition={this.state.condition}
                        reset={() => {this.setState({condition: null})}}
                    />
                </div>
            </div>
        );
    }
}



export default ConditionView;


