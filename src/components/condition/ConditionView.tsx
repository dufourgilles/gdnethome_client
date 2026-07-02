// @ts-nocheck
import React from 'react';
import FreezeView from "../common/FreezeView";
import ConditionCreator from "./ConditionCreator";
import ConditionList from "./ConditionList";
import { getById, getEmptyCondition } from "../../hooks/domain";
import PropTypes from "prop-types";
import { useConditionQuery } from "../../hooks/useCondition";


class ConditionView extends FreezeView {
    state = {
        condition: getEmptyCondition(),
    };

    componentWillReceiveProps(newProps) {
        
        if (this.state.condition.id !== "") {
            const condition = this.props.getConditionByID(this.state.condition.id);
            if (condition) {
                this.setState({condition});
            }
        }
    }

    componentDidMount() {
        this.setFreezeOff();
    }

    handleDelete = () => {
        this.setState({condition: getEmptyCondition()});
    }

    handleSelect = condition => {
        this.setState({condition});
    };

    renderContent() {
        const condition = this.state.condition;
        const selectedTitle = condition.id === "" ? "New condition" : condition.name || condition.id;
        return (
            <div className="gdnet-view">
                <div className="gdnet-container-header">
                    <div>
                        <div className="gdnet-title">Conditions</div>
                        <div className="gdnet-subtitle">{this.props.conditions.length} conditions configured</div>
                    </div>
                </div>
                <div key={"condition-view"} className={`gdnet-container ${this.isFreezed() === true ? "blurred" : ""}`}>
                    <div className="gdnet-container-panel">
                        <div className="gdnet-panel-header">
                            <span>Conditions</span>
                        </div>
                        <ConditionList onSelect={this.handleSelect} onDelete={this.handleDelete} selected={condition} />
                    </div>
                    <div className="gdnet-container-panel gdnet-container-panel-wide">
                        <div className="gdnet-panel-header">
                            <span>{selectedTitle}</span>
                            <span className="gdnet-panel-meta">{condition.operator}</span>
                        </div>
                        <ConditionCreator
                            id={condition.id}
                            condition={condition}
                            reset={() => {this.setState({condition: getEmptyCondition()})}}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

ConditionView.propTypes = {
    conditions: PropTypes.array.isRequired,
    getConditionByID: PropTypes.func.isRequired
};

export default function ConditionViewQuery() {
    const conditions = useConditionQuery();
    const items = conditions.data || [];
    return <ConditionView conditions={items} getConditionByID={getById(items)} />;
}
