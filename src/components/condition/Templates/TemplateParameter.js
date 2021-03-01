import React from 'react';
import TemplateNumber from './TemplateNumber';
import TemplateRange from './TemplateRange';
import TemplateHours from './TemplateHours';

class TemplateParameter extends React.Component{
    render() {
        const parameter = this.props.parameter;
        if (parameter == null ) { return ""; }
        const type = parameter.type.toLowerCase();
        if (type === "number") {
            return (
                <TemplateNumber {...this.props} />
            );
        }
        else if (type === "range") {
            return (
                <TemplateRange {...this.props} />
            );
        }
        else if (type === "hours") {
            return (
                <TemplateHours {...this.props} />
            );
        }
    }
}


export default TemplateParameter;