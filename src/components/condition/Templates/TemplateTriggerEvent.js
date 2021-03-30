import React from 'react';
import DatapointParameter from "../../datapoint/DatapointParameter";
import {getTriggerByID} from "../../../reducers/triggerEventReducer";
import { connect } from 'react-redux';

class TemplateTriggerEvent extends React.Component{
    handleValueChange = (key, value) => {
        if (value.id == null) {
            const trigger = this.props.getTriggerByID(value);
            if (trigger == null) {
                console.log(`Unknown trigger id ${value}`);
                return;
            }
            value = trigger;
        }
        this.props.handleValueChange(this.props.object, value);
    }
    displayTriggerName = item => {
        if (item.name == null || item.id == null) {
            return "--select--";
        }
        return `${item.name}(${item.id})`;
    };
    render() {
        return (
            <div className="template-triggerevents">
                <DatapointParameter 
                    key={this.props.object.id}
                    onChange={this.handleValueChange}
                    label={this.props.object.name}
                    name={"id"}
                    data={this.props.data}
                    list={this.props.triggers}
                    display={this.displayTriggerName}
                    match={"id"}
                    filterKeys={["id", "name"]}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    getTriggerByID: getTriggerByID(state),
});

export default connect(mapStateToProps, null)(TemplateTriggerEvent);
