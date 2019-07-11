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
        condition: this.props.condition == null ? EMPTY_CONDITION : this.props.condition
    };

    componentDidMount() {
        fetchConditionTypes()
            .then(conditionTypes => {
                this.setState({conditionTypes})
        });
    }

    handleValueChange = (key, value) =>  {
        const condition = Object.assign({}, this.state.condition);
        if (key === "triggerEventID") {
            condition[key] = value.id;
        }
        else {
            condition[key] = value;
        }
        this.setState({condition});
    };

    renderConditionParameters() {
        const condition = this.state.condition;
        if (this.state.condition.operator === "AND" || this.state.condition.operator === "OR") {
            return (
                <React.Fragment>
                    <DatapointParameter
                        key="cond1"
                        onChange={this.handleValueChange}
                        label="Condition 1"
                        name="conditionIDs"
                        data={condition}
                        index={0}
                    />
                    <DatapointParameter
                        key="cond2"
                        onChange={this.handleValueChange}
                        label="Condition 2"
                        name="conditionIDs"
                        data={condition}
                        index={1}
                    />
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
            this.setState({condition: this.props.condition == null ? EMPTY_CONDITION : this.props.condition});
        };

        const newFunc = () => {
            this.setState({condition: EMPTY_CONDITION});
        };

        return (
            <div className="condition-creator">
                <div className="action-actions">
                    <div className="datapoint-editor-button" onClick={saveFunc}>Save</div>
                    <div className="datapoint-editor-button" onClick={newFunc}>New</div>
                    <div className="datapoint-editor-button" onClick={cancelFunc}>Cancel</div>
                </div>
                <DatapointParameter
                    key="id"
                    validator={this.validateID}
                    onChange={this.handleValueChange}
                    editable={true}
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
    condition: PropTypes.object,
    setFreezeOff: PropTypes.func,
    setFreezeOn: PropTypes.func
};


const mapStateToProps = state => ({
    triggers: state.triggers.items,
});

const mapDispatchToProps = dispatch => {
    return {
        createNewCondition: createNewCondition(dispatch),
        updateCondition: updateCondition(dispatch)
    }
  };

export default connect(mapStateToProps, mapDispatchToProps)(ConditionCreator);