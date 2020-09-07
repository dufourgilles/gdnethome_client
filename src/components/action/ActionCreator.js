import React from 'react';
import { connect } from 'react-redux';
import FreezeView from "../common/FreezeView";
import {fetchActionTypes, createNewAction, updateAction} from "../../actions/actionActions";
import ActionParameters from "./ActionParameters";
import DatapointParameter from "../datapoint/DatapointParameter";
import { getEmptyAction } from "../../reducers/actionReducer";
import {getActionTypeIndex, getActionTypeDefaultParameters} from "./common";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";

class ActionCreator extends FreezeView {
    state = {
        actionTypes: [],
        advanced: false,
        action: this.props.action == null ? getEmptyAction() : this.props.action
    };

    componentDidMount() {
        fetchActionTypes()
            .then(actionTypes => {
                const action = this.state.action;
                if (this.props.action == null) {
                    action.parameters = this.getActionTypeDefaultParameters(action.type, actionTypes);
                }
                this.setState({actionTypes, action})
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.action === prevProps.action) {
            return;
        }
        this.setState({action: this.props.action});
    }

    getActionTypeIndex(type, types) {
        return getActionTypeIndex(this.state.actionTypes, type);
    }

    getActionTypeDefaultParameters(type, types = null) {
        return getActionTypeDefaultParameters(types == null ? this.state.actionTypes : types, type);
    }

    handleValueChange = (key, value) =>  {
        const action = Object.assign({}, this.state.action);
        if (key === "type" && action.type !== value) {
            action.parameters = this.getActionTypeDefaultParameters(value);
        }
        else if (key === "triggerEventID" && value === "none") {
            value = "";
        }
        else if (key === "enable") {
            value = value === "true" || value === true;
        }
        action[key] = value.id == null ? value : value.id;
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

    renderAdvancedParams = action => {
        const toggleAdvancedParams = () => {
            this.setState({advanced: !this.state.advanced})
        }
        if (this.state.advanced) {
            return (
                <div className="action-advanced-params">
                    <div onMouseUp={toggleAdvancedParams}>hide advanced params</div>
                    <DatapointParameter
                        key="maxExecute"
                        onChange={this.handleValueChange}
                        label="Max Execution"
                        name="maxExecute"
                        editable={true}
                        data={action}
                    />
                    <DatapointParameter
                        key="enable"
                        onChange={this.handleValueChange}
                        label="enabled"
                        name="enable"
                        data={action}
                        list={[{id: "true", value: true}, {id: "false", value: false}]}
                        display="id"
                        match="value"
                    />
                    <DatapointParameter
                        key="delaySeconds"
                        onChange={this.handleValueChange}
                        label="Delay"
                        name="delaySeconds"
                        data={action}
                        editable={true}
                    />
                    <DatapointParameter
                        key="minIntervalSeconds"
                        onChange={this.handleValueChange}
                        label="Min Interval"
                        name="minIntervalSeconds"
                        data={action}
                        editable={true}
                    />
                    <DatapointParameter
                        key="executeIntervalSeconds"
                        onChange={this.handleValueChange}
                        label="Execute Interval"
                        name="executeIntervalSeconds"
                        data={action}
                        editable={true}
                    />
                    <DatapointParameter
                        key="disabledInterval"
                        onChange={this.handleValueChange}
                        label="Disabled Interval"
                        name="disabledInterval"
                        data={action}
                        editable={true}
                    />
                    <DatapointParameter
                        key="totalExecuted"
                        onChange={this.handleValueChange}
                        label="Total Executed"
                        name="totalExecuted"
                        data={action}
                        editable={false}
                    />
                    <DatapointParameter
                        key="executedCounter"
                        onChange={this.handleValueChange}
                        label="Interval Executed"
                        name="executedCounter"
                        data={action}
                        editable={false}
                    />
                </div>
            );
        }
        else {
            return (
                <div className="action-advanced-params" onMouseUp={toggleAdvancedParams}>advanced params</div>
            );
        }
    }
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
            this.setState({action: this.props.action == null ? getEmptyAction() : Object.assign({}, this.props.action)});
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
        const displayTriggerName = item => {
            return `${item.name}(${item.id})`;
        };

        const advancedParams = this.renderAdvancedParams(action);
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
                    editable={this.props.action == null}
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
                    match="id"
                    display={displayTriggerName}
                    filterKeys={["id", "name"]}
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
                    filterKeys={["id", "name"]}
                />
                {advancedParams}
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


