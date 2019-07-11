import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import {fetchActionTypes, createNewAction, updateAction} from "../../actions/actionActions";
import ActionParameters from "./ActionParameters";
import DatapointParameter from "../datapoint/DatapointParameter";
import {EMPTY_ACTION} from "../../reducers/actionReducer";
import {getActionTypeIndex, getActionTypeDefaultParameters} from "./common";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";

class ActionCreator extends FreezeView {
    state = {
        actionTypes: [],
        action: this.props.action == null ? EMPTY_ACTION : this.props.action
    };

    componentDidMount() {
        fetchActionTypes()
            .then(actionTypes => {
                this.setState({actionTypes})
        });
    }

    getActionTypeIndex(type) {
        return getActionTypeIndex(this.state.actionTypes, type);
    }

    getActionTypeDefaultParameters(type) {
        return getActionTypeDefaultParameters(this.state.actionTypes, type);
    }

    handleValueChange = (key, value) =>  {
        const action = Object.assign({}, this.state.action);
        if (key === "type" && action.type !== value) {
            action.parameters = this.getActionTypeDefaultParameters(value);
        }
        else if (key === "triggerEventID" && value === "none") {
            value = "";
        }
        action[key] = value;
        this.setState({action});
    };

    handleParameterChange = parameters =>  {
        const action = Object.assign({}, this.state.action);
        action.parameters = parameters;
        this.setState({action});
    };

    validateID = () => {
        return true;
    };

    renderContent() {
        const saveFunc = () => {
            this.setFreezeOn();
            let createOrUpdate;
            if (this.props.action == null) {
                createOrUpdate = this.props.createNewAction(this.state.action);
            }
            else {
                createOrUpdate = this.props.updateAction(this.state.action);
            }
            createOrUpdate
                .then(() => toastr.success('Success', "Save OK"))
                .catch(e => toastr.error('Error', e.message))
                .then(() => this.setFreezeOff());
        };

        const cancelFunc = () => {
            this.setState({action: this.props.action == null ? EMPTY_ACTION : this.props.action});
        };

        const action = this.state.action;
        const actionTypeIndex = this.getActionTypeIndex(action.type);
        let actionParameters;
        if (actionTypeIndex >= 0) {
            actionParameters = (
                <ActionParameters
                        name={this.state.action.type}
                        parameterTypes={this.state.actionTypes[actionTypeIndex].parameters}
                        parameters = {this.state.action.parameters}
                        onChange={this.handleParameterChange}
                    />
            );
        }
        return (
            <div className="action-creator">
                <div className="action-actions">
                    <div className="datapoint-editor-button" onClick={saveFunc}>Save</div>
                    <div className="datapoint-editor-button" onClick={cancelFunc}>Cancel</div>
                </div>
                <DatapointParameter
                    key="id"
                    validator={this.validateID}
                    onChange={this.handleValueChange}
                    editable={true}
                    label="id"
                    name="id"
                    data={action}
                />
                <DatapointParameter
                    key="type"
                    onChange={this.handleValueChange}
                    label="type"
                    name="type"
                    data={action}
                    list={this.state.actionTypes}
                    display="id"
                    match="id"
                />
                <DatapointParameter
                    key="triggerID"
                    onChange={this.handleValueChange}
                    label="trigger"
                    name="triggerEventID"
                    data={action}
                    list={this.props.triggers}
                    display="id"
                    match="id"
                />
                <DatapointParameter
                    key="conditionID"
                    onChange={this.handleValueChange}
                    label="condition"
                    name="conditionID"
                    data={action}
                    list={this.props.conditions}
                    display="id"
                    match="id"
                />
                {actionParameters}
            </div>
        );
    }
}


ActionCreator.propTypes = {
    triggers: PropTypes.array.isRequired,
    conditions: PropTypes.array.isRequired,
    createNewAction: PropTypes.func.isRequired,
    action: PropTypes.object
};


const mapStateToProps = state => ({
    triggers: state.triggers.items,
    conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
    return {
        createNewAction: createNewAction(dispatch),
        updateAction: updateAction(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ActionCreator);


