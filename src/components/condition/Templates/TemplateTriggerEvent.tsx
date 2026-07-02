// @ts-nocheck
import React from 'react';
import DatapointParameter from "../../datapoint/DatapointParameter";
import { getById } from "../../../hooks/domain";
import { useTriggerQuery } from "../../../hooks/useSystem";

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

export default function TemplateTriggerEventQuery(props) {
    const triggers = useTriggerQuery();
    const items = triggers.data || [];
    return <TemplateTriggerEvent {...props} triggers={items} getTriggerByID={getById(items)} />;
}
