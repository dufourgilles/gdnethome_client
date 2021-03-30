import React from 'react';
import DatapointParameter from "../../datapoint/DatapointParameter";

class TemplateString extends React.Component{
    handleValueChange = (key, value) => {
        this.props.handleValueChange(this.props.parameter, {[key]: value});
    }
    render() {
        return (
            <DatapointParameter 
                key={this.props.parameter.id}
                onChange={this.handleValueChange}
                label={this.props.parameter.name}
                name="value"
                data={this.props.data}
                editable={true}
            />
        );
    }
}

export default TemplateString;