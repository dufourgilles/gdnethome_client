import React from 'react';
import DatapointParameter from "../../datapoint/DatapointParameter";

class TemplateRange extends React.Component{
    handleValueChange = (key, value) => {
        this.props.handleValueChange(this.props.parameter, {[key]: Number(value)});        
    }
    render() {
        return (
            <div className="template-range">
                <DatapointParameter 
                    key={`${this.props.parameter.id}-low`}
                    onChange={this.handleValueChange}
                    label={`${this.props.parameter.name} min`}
                    name="low"
                    data={this.props.data}
                    editable={true}
                />
                <DatapointParameter 
                    key={`${this.props.parameter.id}-high`}
                    onChange={this.handleValueChange}
                    label={`${this.props.parameter.name} max`}
                    name="high"
                    data={this.props.data}
                    editable={true}
                />
            </div>
        );
    }
}


export default TemplateRange;