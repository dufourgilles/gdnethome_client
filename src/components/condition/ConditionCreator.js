import React from 'react';
import { connect } from 'react-redux';
import { fetchConditionTypes, createNewCondition, updateCondition } from "../../actions/conditionActions";
import {EMPTY_CONDITION} from "../../reducers/conditionReducer";
import DatapointParameter from "../datapoint/DatapointParameter";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import FreezeView from "../common/FreezeView";

class ConditionCreator extends FreezeView {
    state = {
        conditionTypes: [],
        condition: this.props.condition == null ? EMPTY_CONDITION : this.props.condition,
        conditionLength: this.props.condition == null ? 1 : this.props.condition.conditionIDs.length
    };

    componentDidMount() {
        fetchConditionTypes()
            .then(conditionTypes => {
                this.setState({conditionTypes})
        });
    }

    handleValueChange = (key, value, index) =>  {
        const condition = Object.assign({}, this.state.condition);
        let conditionLength = this.state.conditionLength
        if (key === "triggerEventID") {
            condition[key] = value.id == null ? value : value.id;
        }
        else if (key === "operator") {
            if ((value === "AND" || value === "OR" || value === "NOT") &&
                condition.operator !== "AND" &&
                condition.operator !== "NOT" &&
                condition.operator !== "OR") {
                condition.triggerEventID = "";
                if (value === "NOT") {
                    conditionLength = 1;
                }
                else {
                    conditionLength = 2;
                }
            }
            else if ((condition.operator === "AND" || condition.operator === "OR" || condition.operator === "NOT") &&
                value !== "AND" && value !== "OR" && value !== "NOT") {
                condition.conditionIDs = [];
                conditionLength = 1;
            }
            if (value === "NOT" && condition.conditionIDs.length > 1) {
                condition.conditionIDs = condition.conditionIDs.slice(0,1);
                conditionLength = 1;
            }
            condition.operator = value;
        }
        else if (index == null) {
            condition[key] = value.id == null ? value : value.id;
        }
        else {
            condition[key][index] = value.id == null ? value : value.id;
        }
        this.setState({condition,conditionLength});
    };

    renderConditionParameters() {
        const condition = this.state.condition;
        const conditions = this.props.conditions;

        if (this.state.condition.operator === "AND" || this.state.condition.operator === "OR") {
            const renderCondition = index => {
                const condChanged = (key,value) => {
                    this.handleValueChange(key, value, index);
                }
                return (
                    <DatapointParameter
                        key={`cond${index}`}
                        onChange={condChanged}
                        label={`Condition ${index+1}`}
                        name="conditionIDs"
                        data={condition}
                        list={conditions}
                        filterKeys={["id"]}
                        display={"id"}
                        match={"id"}
                        index={index}
                    />
                );
            }
            const renderedConditions = [];
            for(let i = 0; i < this.state.conditionLength; i++) {
                renderedConditions.push(renderCondition(i));
            }
            return (
                <React.Fragment>
                    {renderedConditions}
                </React.Fragment>
            );
        }
        else if (this.state.condition.operator === "NOT") {
            return (
                <DatapointParameter
                    key="cond1"
                    onChange={this.handleValueChange}
                    label="Condition"
                    name="conditionIDs"
                    data={condition}
                    list={conditions}
                    filterKeys={["id"]}
                    display={"id"}
                    match={"id"}
                    index={0}
                />
            );
        }
        else {
            const displayTriggerName = item => {
                return `${item.name}(${item.id})`;
            };
            return (
                <React.Fragment>
                    <DatapointParameter
                        key="triggerID"
                        onChange={this.handleValueChange}
                        label="trigger"
                        name="triggerEventID"
                        data={condition}
                        list={this.props.triggers}
                        display={displayTriggerName}
                        match="id"
                        filterKeys={["id", "name"]}
                    />
                    <DatapointParameter
                        key="triggerValue"
                        validator={this.validateID}
                        onChange={this.handleValueChange}
                        editable={true}
                        label="Trigger Value"
                        name="triggerValue"
                        data={condition}
                    />
                </React.Fragment>
            );
        }
    }

    renderContent() {
        const condition = this.state.condition;
        const conditionParameters = this.renderConditionParameters();
        const saveFunc = () => {
            this.setFreezeOn();
            let createOrUpdate;
            if (this.props.condition == null) {
                createOrUpdate = this.props.createNewCondition(this.state.condition);
            }
            else {
                createOrUpdate = this.props.updateCondition(this.state.condition);
            }
            createOrUpdate
                .then(() => toastr.success('Success', "Save OK"))
                .catch(e => toastr.error('Error', e.message))
                .then(() => this.setFreezeOff());
        };

        const cancelFunc = () => {
            this.setState({condition: this.props.condition == null ? EMPTY_CONDITION : Object.assign({}, this.props.condition)});
        };

        const newFunc = () => {
            if (this.props.reset) {
                this.props.reset();
            }
            this.setState({condition: EMPTY_CONDITION});
        };

        const addConditionFunc = () => {
            const conditionLength = this.state.conditionLength + 1;
            this.setState({conditionLength});
        };

        const op = this.state.condition.operator;
        const addConditionBtn = (op === "AND" || op === "OR") ? 
        (<div className="datapoint-editor-button" onClick={addConditionFunc}>more</div>) :
        "";

        return (
            <div className="condition-creator">
                <div className="action-actions">
                    <div className="datapoint-editor-button" onClick={saveFunc}>Save</div>
                    <div className="datapoint-editor-button" onClick={newFunc}>New</div>
                    <div className="datapoint-editor-button" onClick={cancelFunc}>Cancel</div>
                    {addConditionBtn}
                </div>
                <DatapointParameter
                    key="id"
                    validator={this.validateID}
                    onChange={this.handleValueChange}
                    editable={this.props.condition == null}
                    label="id"
                    name="id"
                    data={condition}
                />
                <DatapointParameter 
                    key="operator"
                    onChange={this.handleValueChange}
                    label="operator"
                    name="operator"
                    data={condition}
                    list={this.state.conditionTypes}
                    display="id"
                    match="id"
                />
                {conditionParameters}
            </div>
        );
    }
}

ConditionCreator.propTypes = {
    triggers: PropTypes.array.isRequired,
    createNewCondition: PropTypes.func.isRequired,
    updateCondition: PropTypes.func.isRequired,
    condition: PropTypes.object,
    conditions: PropTypes.array.isRequired,
    reset: PropTypes.func,
};


const mapStateToProps = state => ({
    triggers: state.triggers.items,
    conditions: state.conditions.items
});

const mapDispatchToProps = dispatch => {
    return {
        createNewCondition: createNewCondition(dispatch),
        updateCondition: updateCondition(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConditionCreator);