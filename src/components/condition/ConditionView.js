import React from 'react';
import FreezeView from "../common/FreezeView";
import ConditionCreator from "./ConditionCreator";
import ConditionList from "./ConditionList";
import { getEmptyCondition, getConditionByID } from "../../reducers/conditionReducer";
import { connect } from 'react-redux';
import PropTypes from "prop-types";
import "./ConditionView.css";


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
        return (
            <div className="gdnet-view">
                <div className="gdnet-title">Conditions</div>
                <div key={"condition-view"} className="view-container">
                    <ConditionList onSelect={this.handleSelect} onDelete={this.handleDelete} selected={this.state.condition} />
                    <ConditionCreator 
                        id={this.state.condition.id} 
                        condition={this.state.condition}
                        reset={() => {this.setState({condition: getEmptyCondition()})}}
                    />
                </div>
            </div>
        );
    }
}

ConditionView.propTypes = {
    conditions: PropTypes.array.isRequired,
    getConditionByID: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    conditions: state.conditions.items,
    getConditionByID: getConditionByID(state)
});


export default connect(mapStateToProps, undefined )(ConditionView);


