import React from 'react';
import DatapointParameter from "../../datapoint/DatapointParameter";

class TemplateDatapointCtl extends React.Component{
    handleValueChange = (key, value) => {
        this.props.handleValueChange(this.props.object, value);
    }
    displayTriggerName = item => {
        return `${item.name}(${item.id})`;
    };
    render() {
        return (
            <div className="template-triggerevents">
                <DatapointParameter 
                    key={this.props.object.id}
                    onChange={this.handleValueChange}
                    label={this.props.object.name}
                    name="id"
                    data={this.props.data}
                    list={this.props.datapointctls}
                    display="name"
                    match="id"
                    filterKeys={["id", "name"]}
                />
            </div>
        );
    }
}

export default TemplateDatapointCtl;